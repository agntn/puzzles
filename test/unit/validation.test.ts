import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { isValidAddress, isValidTransactionId } from "../../src/core/chains.ts";
import {
  addressesEqual,
  addressFromPrivateKey,
  privateKeyToWif,
  wifToPrivateKey,
} from "../../src/core/crypto.ts";
import {
  AddressKind,
  answer,
  artifact,
  assets,
  confirmation,
  fact,
  type Hint,
  type KeyData,
  official,
  p2pkh,
  party,
  type Party,
  PartyKind,
  profile,
  PubkeyFormat,
  stage,
  TransactionType,
} from "../../src/core/parts.ts";
import { bitcoinPuzzle, type Puzzle, Status } from "../../src/core/puzzle.ts";
import type { AnyCollection } from "../../src/core/registry.ts";
import { ArweaveCollection } from "../../src/collections/arweave.ts";
import { TeikhosCollection } from "../../src/collections/teikhos.ts";
import { NamedCollection } from "../../src/core/collection.ts";
import { all, collections, verify } from "../../src/index.ts";
import { decryptBip38, isBip38 } from "../support/bip38.ts";

const puzzles = await all();
const registered = await collections();

function privateKeyBits(hexKey: string): number {
  return BigInt(`0x${hexKey}`).toString(2).length;
}

function bip38KeyProblem(
  puzzle: Puzzle,
  encrypted: string,
  passphrase: string,
): string | undefined {
  const decrypted = decryptBip38(encrypted, passphrase);
  const hexKey = decrypted.privateKey;
  const key = puzzle.keyData();
  if (key?.hex !== undefined && key.hex !== hexKey) {
    return `${puzzle.id()}: BIP38 private key does not match the declared hex key`;
  }
  const wif = key?.wif?.decrypted;
  if (wif !== undefined && wif !== privateKeyToWif(hexKey, puzzle.chain(), decrypted.compressed)) {
    return `${puzzle.id()}: BIP38 private key does not match the decrypted WIF`;
  }
  return undefined;
}

function encryptedWifProblem(puzzle: Puzzle): string | undefined {
  const wif = puzzle.keyData()?.wif;
  if (wif?.encrypted === undefined) {
    return undefined;
  }
  if (!isBip38(wif.encrypted)) {
    return `${puzzle.id()}: invalid BIP38 payload`;
  }
  return wif.passphrase === undefined
    ? undefined
    : bip38KeyProblem(puzzle, wif.encrypted, wif.passphrase);
}

function declaredKeyProblem(puzzle: Puzzle, key: KeyData, hexKey: string): string | undefined {
  if (key.bits !== undefined && key.bits !== privateKeyBits(hexKey)) {
    return `${puzzle.id()}: declared bit length does not match the key`;
  }
  const decrypted = key.wif?.decrypted;
  if (decrypted !== undefined && wifToPrivateKey(decrypted, puzzle.chain()).hex !== hexKey) {
    return `${puzzle.id()}: decrypted WIF does not match the hex key`;
  }
  return undefined;
}

function derivationProblem(puzzle: Puzzle, hexKey: string): string | undefined {
  const pubkey = puzzle.pubkey();
  const formats =
    pubkey === undefined ? [PubkeyFormat.Compressed, PubkeyFormat.Uncompressed] : [pubkey.format];
  const derives = formats.some((format) => {
    const derived = addressFromPrivateKey(hexKey, puzzle.chain(), format, puzzle.address().kind);
    /* A chain without key to address derivation has nothing to contradict. */
    return derived === undefined || addressesEqual(puzzle.chain(), derived, puzzle.address().value);
  });
  return derives ? undefined : `${puzzle.id()}: private key does not derive its stored address`;
}

function privateKeyProblem(puzzle: Puzzle): string | undefined {
  const key = puzzle.keyData();
  if (key?.hex === undefined) {
    return undefined;
  }
  return declaredKeyProblem(puzzle, key, key.hex) ?? derivationProblem(puzzle, key.hex);
}

/**
 * A derived mark needs a secret to mark, and since no source printed that secret, the derivation
 * is its only evidence: the key has to verify against the stored address.
 *
 * @param {Puzzle} puzzle - The puzzle to check.
 * @returns {Promise<string | undefined>} The problem, or nothing when the mark holds.
 */
async function derivedKeyProblem(puzzle: Puzzle): Promise<string | undefined> {
  if (puzzle.keyData()?.derived !== true) {
    return undefined;
  }
  if (!puzzle.hasPrivateKey()) {
    return `${puzzle.id()}: derived mark without a private key`;
  }
  const result = await verify(puzzle);
  return result.verified ? undefined : `${puzzle.id()}: derived key does not verify`;
}

function claimedPubkeyProblem(puzzle: Puzzle): string | undefined {
  if (
    puzzle.status() === Status.Unsolved ||
    puzzle.collection() === ArweaveCollection.key ||
    // A TeikhosBounty address is a contract: it pays by self-destructing and never signs.
    puzzle.collection() === TeikhosCollection.key ||
    puzzle.address().kind === AddressKind.P2SH
  ) {
    return undefined;
  }
  const claimed =
    puzzle.claimTransaction() !== undefined ||
    puzzle.transaction(TransactionType.Sweep) !== undefined;
  return claimed && !puzzle.hasPubkey()
    ? `${puzzle.id()}: claim or sweep requires a recorded public key`
    : undefined;
}

function transactionProblems(puzzle: Puzzle): string[] {
  return puzzle
    .transactions()
    .filter((transaction) => !isValidTransactionId(puzzle.chain(), transaction.txid))
    .map(
      (transaction) =>
        `${puzzle.id()}: ${transaction.tx_type} txid does not match the ${puzzle.chain()} format`,
    );
}

function assetProblems(puzzle: Puzzle): string[] {
  const directory = resolve("assets", puzzle.collection());
  return puzzle.assetLinks().flatMap((link) => {
    const target = resolve(link.path);
    if (!target.startsWith(`${directory}${sep}`)) {
      return [`${puzzle.id()}: asset ${link.file} leaves assets/${puzzle.collection()}/`];
    }
    return existsSync(target) ? [] : [`${puzzle.id()}: missing asset ${link.path}`];
  });
}

/** A hint date is the record's `YYYY-MM-DD HH:MM:SS`, or the day alone when the source has no time. */
const HINT_DATE = /^(\d{4}-\d{2}-\d{2})(?: (\d{2}:\d{2}:\d{2}))?$/u;

/**
 * Whether a field is one line that parses as an `http(s)` URL.
 *
 * @param {string} value - The field.
 * @returns {boolean} `true` for `https://example.com/x`, `false` for `ftp://`, a tab or a line break.
 */
function isWebUrl(value: string): boolean {
  return isOneLine(value) && /^https?:$/u.test(URL.parse(value)?.protocol ?? "");
}

/**
 * Whether a hint date names a day, and a time when it has one, that exist on the calendar.
 *
 * @param {string} value - The date as the record spells it.
 * @returns {boolean} `true` for `2013-11-19` and `2013-11-19 20:12:25`, `false` for `2026-02-30`.
 */
function isRecordDate(value: string): boolean {
  const match = HINT_DATE.exec(value);
  if (match === null) {
    return false;
  }
  const iso = `${match[1]}T${match[2] ?? "00:00:00"}.000Z`;
  const parsed = new Date(iso);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === iso;
}

/**
 * Whether a printed field stays on the tab-separated line `puzzles_show` gives it.
 *
 * @param {string | undefined} value - The field, when the record has it.
 * @returns {boolean} `true` for an absent field or a non-empty one without line or tab breaks.
 */
function isOneLine(value: string | undefined): boolean {
  return value === undefined || (value.trim() !== "" && !/[\n\r\t]/u.test(value));
}

/**
 * Checks hint text, its source, optional corroboration and dates.
 *
 * @param {Hint} hint - The hint.
 * @returns {string[]} One problem per failed check.
 */
function problemsOf(hint: Hint): string[] {
  return [
    ...(isOneLine(hint.text) ? [] : ["text is not one line"]),
    ...(isOneLine(hint.confirmation?.description) ? [] : ["description is not one line"]),
    ...(isWebUrl(hint.source) ? [] : ["source is not a web URL"]),
    ...(hint.confirmation === undefined || isWebUrl(hint.confirmation.url)
      ? []
      : ["confirmation is not a web URL"]),
    ...(hint.date === undefined || isRecordDate(hint.date) ? [] : ["date is not a record date"]),
    ...answerProblems(hint.answer),
  ];
}

/**
 * The problems of every stage a puzzle runs in: a one line name and description, at least one
 * artifact with a one line name and a web URL, and an answer that passes the hint answer checks.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {string[]} One line per failed check, named after the puzzle and the stage number.
 */
function stageProblems(puzzle: Puzzle): string[] {
  return puzzle.stages().flatMap((item, index) => {
    const owner = `${puzzle.id()} stage ${index + 1}`;
    return [
      ...(isOneLine(item.name) ? [] : [`${owner}: name is not one line`]),
      ...(isOneLine(item.about) ? [] : [`${owner}: about is not one line`]),
      ...(item.artifacts.length === 0 ? [`${owner}: has no artifact`] : []),
      ...answerProblems(item.answer).map((problem) => `${owner}: ${problem}`),
      ...item.artifacts.flatMap((entry, number) => [
        ...(isOneLine(entry.name) ? [] : [`${owner} artifact ${number + 1}: name is not one line`]),
        ...(isWebUrl(entry.url) ? [] : [`${owner} artifact ${number + 1}: url is not a web URL`]),
      ]),
    ];
  });
}

/**
 * Checks the separately published answer without borrowing the hint's date or source.
 *
 * @param {Hint["answer"]} value - The answer, if recorded.
 * @returns {string[]} One problem per failed check.
 */
function answerProblems(value: Hint["answer"]): string[] {
  if (value === undefined) return [];
  return [
    ...(isOneLine(value.text) ? [] : ["answer text is not one line"]),
    ...(isWebUrl(value.source) ? [] : ["answer source is not a web URL"]),
    ...(value.date === undefined || isRecordDate(value.date)
      ? []
      : ["answer date is not a record date"]),
  ];
}

/**
 * The problems of every hint an owner carries, named after the owner and the hint number.
 *
 * @param {string} owner - The puzzle identifier or the collection key the hints belong to.
 * @param {readonly Hint[]} hints - The hints.
 * @returns {string[]} One line per failed check.
 */
function hintProblems(owner: string, hints: readonly Hint[]): string[] {
  return hints.flatMap((hint, index) =>
    problemsOf(hint).map((problem) => `${owner}: hint ${index + 1} ${problem}`),
  );
}

/**
 * Checks the prose of a party record: one-line name, about and aliases, an alias never the name.
 *
 * @param {Party} author - The record.
 * @returns {string[]} One problem per failed check.
 */
function partyProseProblems(author: Party): string[] {
  return [
    ...(isOneLine(author.name) ? [] : ["name is not one line"]),
    ...(isOneLine(author.about) ? [] : ["about is not one line"]),
    ...(author.aliases ?? []).flatMap((alias, index) =>
      isOneLine(alias) && alias !== author.name
        ? []
        : [`alias ${index + 1} is not a distinct line`],
    ),
  ];
}

/**
 * Checks what a party record points at: profile URLs, addresses in the collection's chains, facts.
 *
 * @param {Party} author - The record.
 * @param {readonly Puzzle[]} puzzles - The puzzles the party published, for their chains.
 * @returns {string[]} One problem per failed check.
 */
function partyLinkProblems(author: Party, puzzles: readonly Puzzle[]): string[] {
  return [
    ...(author.profiles ?? []).flatMap((link, index) =>
      isOneLine(link.name) && isWebUrl(link.url) ? [] : [`profile ${index + 1} is not a web URL`],
    ),
    ...(author.addresses ?? []).flatMap((address, index) =>
      puzzles.some((puzzle) => isValidAddress(puzzle.chain(), address))
        ? []
        : [`address ${index + 1} is not in a chain of the collection`],
    ),
    ...(author.facts ?? []).flatMap((entry, index) => [
      ...(isOneLine(entry.text) ? [] : [`fact ${index + 1} text is not one line`]),
      ...(isWebUrl(entry.source) ? [] : [`fact ${index + 1} source is not a web URL`]),
      ...(entry.date === undefined || isRecordDate(entry.date)
        ? []
        : [`fact ${index + 1} date is not a record date`]),
    ]),
  ];
}

/**
 * Checks an author record: a page key, a known kind, one-line prose, web sources and record dates.
 *
 * @param {AnyCollection} collection - The collection whose author to check.
 * @returns {string[]} One line per failed check, named after the collection.
 */
function authorProblems(collection: AnyCollection): string[] {
  const author: Party = collection.author;
  const problems = [
    ...(author.key !== undefined && /^[a-z0-9]+(-[a-z0-9]+)*$/u.test(author.key)
      ? []
      : ["key is not kebab-case"]),
    ...(author.kind === undefined || Object.values(PartyKind).includes(author.kind)
      ? []
      : ["kind is unknown"]),
    ...partyProseProblems(author),
    ...partyLinkProblems(author, collection.all()),
  ];
  return problems.map((problem) => `${collection.key}: author ${problem}`);
}

/**
 * Checks a solver record: a named solver has a page key, and its kind, prose and links pass the
 * author checks. A solver known only by an address stays without a key.
 *
 * @param {Puzzle} puzzle - The puzzle whose solver to check.
 * @returns {string[]} One line per failed check, named after the puzzle.
 */
function solverProblems(puzzle: Puzzle): string[] {
  const solver = puzzle.solver();
  if (solver === undefined) return [];
  const problems = [
    ...(solver.name === undefined ||
    (solver.key !== undefined && /^[a-z0-9]+(-[a-z0-9]+)*$/u.test(solver.key))
      ? []
      : ["key is not kebab-case"]),
    ...(solver.key === undefined || solver.name !== undefined ? [] : ["key has no name"]),
    ...(solver.kind === undefined || Object.values(PartyKind).includes(solver.kind)
      ? []
      : ["kind is unknown"]),
    ...partyProseProblems(solver),
    ...partyLinkProblems(solver, [puzzle]),
  ];
  return problems.map((problem) => `${puzzle.id()}: solver ${problem}`);
}

function mutablePartProblem(puzzle: Puzzle): string | undefined {
  const seen = new WeakSet<object>();
  const walk = (value: unknown, path: string): string[] => {
    if (typeof value !== "object" || value === null || seen.has(value)) {
      return [];
    }
    seen.add(value);
    return [
      ...(Object.isFrozen(value) ? [] : [path]),
      ...Object.entries(value).flatMap(([key, item]) => walk(item, `${path}.${key}`)),
    ];
  };
  const parts = {
    address: puzzle.address(),
    assets: puzzle.assets(),
    hints: puzzle.hints(),
    key: puzzle.keyData(),
    pubkey: puzzle.pubkey(),
    solver: puzzle.solver(),
    transactions: puzzle.transactions(),
  };
  const mutable = Object.entries(parts).flatMap(([name, part]) => walk(part, name));
  return mutable.length === 0 ? undefined : `${puzzle.id()}: mutable ${mutable.join(", ")}`;
}

function collect(check: (puzzle: Puzzle) => string | undefined): string[] {
  return puzzles.map((puzzle) => check(puzzle)).filter((problem) => problem !== undefined);
}

describe("collection class data", () => {
  it("keeps every collection non-empty", () => {
    expect(
      registered
        .filter((collection) => collection.count() === 0)
        .map((collection) => collection.key),
    ).toEqual([]);
  });

  it("keeps puzzle identifiers unique and owned by their collection", () => {
    const seen = new Set<string>();
    const problems: string[] = [];
    for (const collection of registered) {
      for (const puzzle of collection.all()) {
        const id = puzzle.id();
        if (seen.has(id)) {
          problems.push(`Duplicate puzzle id: ${id}`);
        }
        seen.add(id);
        if (puzzle.collection() !== collection.key) {
          problems.push(`${id}: id does not belong to ${collection.key}`);
        }
      }
    }

    expect(problems).toEqual([]);
  });

  it("keeps every address in its chain's format", () => {
    expect(
      collect((puzzle) =>
        isValidAddress(puzzle.chain(), puzzle.address().value)
          ? undefined
          : `${puzzle.id()}: address does not match the ${puzzle.chain()} format`,
      ),
    ).toEqual([]);
  });

  it("keeps every transaction identifier in its chain's format", () => {
    expect(puzzles.flatMap((puzzle) => transactionProblems(puzzle))).toEqual([]);
  });

  it("keeps encrypted WIF material consistent", () => {
    expect(collect(encryptedWifProblem)).toEqual([]);
  });

  it("derives every stored address from its recorded private key", () => {
    expect(collect(privateKeyProblem)).toEqual([]);
  });

  it("verifies every key the record derived instead of quoting", async () => {
    const problems = await Promise.all(puzzles.map((puzzle) => derivedKeyProblem(puzzle)));
    expect(problems.filter((problem) => problem !== undefined)).toEqual([]);
    expect(puzzles.filter((puzzle) => puzzle.hasDerivedKey()).map((puzzle) => puzzle.id())).toEqual(
      [
        "iamabananaamaa/gif",
        "picture_puzzle",
        "quizchain/6",
        "quizchain/7",
        "quizchain/8",
        "quizchain/9",
        "satoshi_birthday_quiz",
      ],
    );
  });

  it("records a public key for every claimed or swept puzzle", () => {
    expect(collect(claimedPubkeyProblem)).toEqual([]);
  });

  it("references only existing assets", () => {
    expect(puzzles.flatMap((puzzle) => assetProblems(puzzle))).toEqual([]);
  });

  it("refuses an asset that resolves outside its collection directory", () => {
    const escaped = bitcoinPuzzle({
      id: "fixture/escaped",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      assets: assets({ puzzle: "../../README.md" }),
    });

    expect(assetProblems(escaped)).toEqual([
      "fixture/escaped: asset ../../README.md leaves assets/fixture/",
    ]);
  });

  it("refuses a stage artifact file that resolves outside its collection directory", () => {
    const escaped = bitcoinPuzzle({
      id: "fixture/escaped",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      stages: [
        stage("phase 1", "A page.", [artifact("page", "https://example.com/a", "../../README.md")]),
      ],
    });

    expect(assetProblems(escaped)).toEqual([
      "fixture/escaped: asset ../../README.md leaves assets/fixture/",
    ]);
  });

  it("describes every stage and names every artifact on one line with a web URL", () => {
    expect(puzzles.flatMap((puzzle) => stageProblems(puzzle))).toEqual([]);
  });

  it("names every way a stage can fail the data gate", () => {
    const staged = bitcoinPuzzle({
      id: "fixture/staged",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      stages: [
        stage(" ", "", []),
        stage(
          "phase 2",
          "A blob.",
          [artifact("two\nlines", "ftp://example.com/blob")],
          answer("two\nlines", "ftp://example.com/answer"),
        ),
      ],
    });

    expect(stageProblems(staged)).toEqual([
      "fixture/staged stage 1: name is not one line",
      "fixture/staged stage 1: about is not one line",
      "fixture/staged stage 1: has no artifact",
      "fixture/staged stage 2: answer text is not one line",
      "fixture/staged stage 2: answer source is not a web URL",
      "fixture/staged stage 2 artifact 1: name is not one line",
      "fixture/staged stage 2 artifact 1: url is not a web URL",
    ]);
  });

  it("keeps every hint on one line with valid source and optional confirmation URLs", () => {
    expect(puzzles.flatMap((puzzle) => hintProblems(puzzle.id(), puzzle.hints()))).toEqual([]);
    expect(
      registered.flatMap((collection) => hintProblems(collection.key, collection.hints)),
    ).toEqual([]);
  });

  it("accepts a hint with only its publication source", () => {
    expect(
      hintProblems("fixture", [
        official("Use the English word list.", "https://example.com/rules"),
      ]),
    ).toEqual([]);
  });

  it("accepts the source page as confirmation of the hint it contains", () => {
    expect(
      hintProblems("fixture", [
        official(
          "Use the English word list.",
          "https://example.com/rules",
          confirmation("https://example.com/rules", "The Word list section states this rule."),
        ),
      ]),
    ).toEqual([]);
  });

  it("names every way a hint can fail the data gate", () => {
    const hinted = bitcoinPuzzle({
      id: "fixture/hinted",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      hints: [
        official(
          "one\ntwo",
          "ftp://example.com/puzzle",
          confirmation("https://archive.ph/x\ty", "two\nlines"),
        ),
        official(" ", "https://example.com/puzzle", confirmation("https://example.com/puzzle"), {
          date: "2026-02-30",
          answer: answer("one\ntwo", "ftp://example.com/answer", { date: "2026-02-30" }),
        }),
        official("Fine.", "https://example.com/puzzle", confirmation("https://archive.ph/x"), {
          date: "2026-01-01 25:00:00",
        }),
      ],
    });

    expect(hintProblems(hinted.id(), hinted.hints())).toEqual([
      "fixture/hinted: hint 1 text is not one line",
      "fixture/hinted: hint 1 description is not one line",
      "fixture/hinted: hint 1 source is not a web URL",
      "fixture/hinted: hint 1 confirmation is not a web URL",
      "fixture/hinted: hint 2 text is not one line",
      "fixture/hinted: hint 2 date is not a record date",
      "fixture/hinted: hint 2 answer text is not one line",
      "fixture/hinted: hint 2 answer source is not a web URL",
      "fixture/hinted: hint 2 answer date is not a record date",
      "fixture/hinted: hint 3 date is not a record date",
    ]);
    expect(
      hintProblems("fixture", [
        official("Fine.", "https://example.com/puzzle", confirmation("https://archive.ph/x"), {
          date: "2013-11-19 20:12:25",
        }),
      ]),
    ).toEqual([]);
  });

  it("gives every author a page key, a kind and sourced facts", () => {
    expect(registered.flatMap(authorProblems)).toEqual([]);
    const parties = new Map<string, unknown>();
    for (const collection of registered) {
      const key = collection.author.key ?? collection.key;
      /* One author, one record: a second collection by the same person reuses that party. */
      expect(parties.get(key) ?? collection.author).toBe(collection.author);
      parties.set(key, collection.author);
    }
    expect(registered.filter((collection) => (collection.author.facts?.length ?? 0) < 2)).toEqual(
      [],
    );
  });

  it("gives every named solver a page key, an about line, sourced facts and one identity", () => {
    expect(puzzles.flatMap(solverProblems)).toEqual([]);
    const identity = new Map<string, string>();
    for (const collection of registered) {
      if (collection.author.key !== undefined) {
        identity.set(
          collection.author.key,
          JSON.stringify([collection.author.name, collection.author.kind]),
        );
      }
    }
    for (const puzzle of puzzles) {
      const solver = puzzle.solver();
      if (solver?.key === undefined) continue;
      /* The records of one solver join by key, so they have to agree on who it is. */
      const who = JSON.stringify([solver.name, solver.kind]);
      const seen = identity.get(`solver:${solver.key}`);
      expect(seen ?? who, `${puzzle.id()}: solver ${solver.key}`).toBe(who);
      identity.set(`solver:${solver.key}`, who);
      /* A solver key that is also an author key names the same party. */
      const author = identity.get(solver.key);
      expect(author ?? who, `${puzzle.id()}: author ${solver.key}`).toBe(who);
    }
    const sourced = new Set(
      puzzles.flatMap((puzzle) =>
        (puzzle.solver()?.facts?.length ?? 0) > 0 ? [puzzle.solver()?.key] : [],
      ),
    );
    const described = new Set(
      puzzles.flatMap((puzzle) =>
        puzzle.solver()?.about === undefined ? [] : [puzzle.solver()?.key],
      ),
    );
    const keys = new Set(puzzles.map((puzzle) => puzzle.solver()?.key).filter(Boolean));
    expect([...keys].filter((key) => !sourced.has(key) || !described.has(key))).toEqual([]);
  });

  it("names every way a solver can fail the data gate", () => {
    const solved = (solver: Party) =>
      bitcoinPuzzle({
        id: "fixture/one",
        address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
        sourceUrl: "https://example.com/puzzle",
        startedAt: "2026-01-01",
        solver,
      });

    expect(solverProblems(solved(party("Fixture", { kind: "team" as never })))).toEqual([
      "fixture/one: solver key is not kebab-case",
      "fixture/one: solver kind is unknown",
    ]);
    expect(solverProblems(solved(party(undefined, { key: "fixture" })))).toEqual([
      "fixture/one: solver key has no name",
    ]);
    expect(
      solverProblems(
        solved(party(undefined, { addresses: ["1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"] })),
      ),
    ).toEqual([]);
  });

  it("names every way an author can fail the data gate", () => {
    const collection = new NamedCollection(
      "fixture",
      party("Fixture", {
        key: "Fixture Key",
        kind: "team" as never,
        about: "one\ntwo",
        aliases: ["Fixture\nTwo", "Fixture"],
        addresses: ["not-an-address"],
        profiles: [profile("site", "ftp://example.com")],
        facts: [fact("one\ntwo", "ftp://example.com", { date: "2026-02-30" })],
      }),
      [
        bitcoinPuzzle({
          id: "fixture/one",
          address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
          sourceUrl: "https://example.com/puzzle",
          startedAt: "2026-01-01",
        }),
      ],
    );

    expect(authorProblems(collection)).toEqual([
      "fixture: author key is not kebab-case",
      "fixture: author kind is unknown",
      "fixture: author about is not one line",
      "fixture: author alias 1 is not a distinct line",
      "fixture: author alias 2 is not a distinct line",
      "fixture: author profile 1 is not a web URL",
      "fixture: author address 1 is not in a chain of the collection",
      "fixture: author fact 1 text is not one line",
      "fixture: author fact 1 source is not a web URL",
      "fixture: author fact 1 date is not a record date",
    ]);
  });

  it("hands back every record frozen", () => {
    expect(collect(mutablePartProblem)).toEqual([]);
    expect(registered.filter((collection) => !Object.isFrozen(collection.author))).toEqual([]);
    expect(registered.filter((collection) => !Object.isFrozen(collection.hints))).toEqual([]);
  });

  it("serializes without null placeholders", () => {
    const serialized = JSON.stringify(puzzles.map((puzzle) => puzzle.toJSON()));

    expect(serialized).not.toContain("null");
  });
});
