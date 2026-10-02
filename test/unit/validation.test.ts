import { existsSync, readFileSync } from "node:fs";
import { resolve, sep } from "node:path";
import { sha256 } from "@agntn/hashes";
import { bech32, createBase58check } from "@scure/base";
import { describe, expect, it } from "vite-plus/test";
import { isValidAddress, isValidTransactionId, sameAddress } from "../../src/core/chains.ts";
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
  digest,
  type Digest,
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
  standard,
  technique,
  type TechniqueTag,
  TransactionType,
} from "../../src/core/parts.ts";
import { type Technique, techniques } from "../../src/core/technique.ts";
import { type Puzzle, puzzle, Status } from "../../src/core/puzzle.ts";
import type { AnyCollection } from "../../src/core/registry.ts";
import { ArweaveCollection } from "../../src/collections/arweave.ts";
import { TeikhosCollection } from "../../src/collections/teikhos.ts";
import { NamedCollection } from "../../src/core/collection.ts";
import { all, collections, verify } from "../../src/index.ts";
import { decryptBip38, isBip38 } from "../support/bip38.ts";

const puzzles = await all();
const base58check = createBase58check(sha256);
const CASHADDR_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
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

/** An archive of a file's exact bytes: a Wayback replay without the toolbar. */
const WAYBACK_REPLAY = /^https:\/\/web\.archive\.org\/web\/\d{14}id_\/https?:\/\/\S+$/u;

/** A pinned SHA-256: 64 lowercase hex digits. */
const SHA256_HEX = /^[0-9a-f]{64}$/u;

function digestFieldProblems(id: string, item: Digest): string[] {
  return [
    ...(SHA256_HEX.test(item.sha256)
      ? []
      : [`${id}: digest of ${item.file} is not lowercase SHA-256 hex`]),
    ...(Number.isSafeInteger(item.bytes) && item.bytes >= 0
      ? []
      : [`${id}: digest of ${item.file} has no byte count`]),
    ...(item.url === undefined || isWebUrl(item.url)
      ? []
      : [`${id}: digest of ${item.file} has no web URL for its origin`]),
    ...(item.archive === undefined || WAYBACK_REPLAY.test(item.archive)
      ? []
      : [`${id}: digest of ${item.file} archive is not a Wayback id_ replay`]),
  ];
}

function digestProblems(puzzle: Puzzle): string[] {
  const links = puzzle.assetLinks();
  const digests = puzzle.assets()?.digests ?? [];
  const unpinned = links.flatMap((link) => {
    if (link.sha256 === undefined || link.bytes === undefined) {
      return [`${puzzle.id()}: asset ${link.file} has no digest`];
    }
    if (!existsSync(link.path)) {
      return [];
    }
    const data = readFileSync(link.path);
    const actual = sha256(new Uint8Array(data)).toHex();
    return actual === link.sha256 && data.length === link.bytes
      ? []
      : [
          `${puzzle.id()}: asset ${link.file} is ${actual} (${data.length} bytes), not ${link.sha256} (${link.bytes} bytes)`,
        ];
  });
  const stray = digests.flatMap((item, index) => [
    ...digestFieldProblems(puzzle.id(), item),
    ...(links.some((link) => link.file === item.file)
      ? []
      : [`${puzzle.id()}: digest of ${item.file} names no file the record ships`]),
    ...(digests.findIndex((other) => other.file === item.file) === index
      ? []
      : [`${puzzle.id()}: digest of ${item.file} repeats`]),
  ]);
  return [...unpinned, ...stray];
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
 * The problems of an owner's techniques: a vocabulary name, a web URL source, each name once.
 *
 * @param {string} owner - The puzzle, its stage or the collection the tags belong to.
 * @param {readonly TechniqueTag[]} tags - The tags.
 * @returns {string[]} One line per failed check.
 */
function techniqueProblems(owner: string, tags: readonly TechniqueTag[]): string[] {
  return tags.flatMap((tag, index) => [
    ...(techniques.includes(tag.name)
      ? []
      : [`${owner}: technique ${index + 1} is not in the vocabulary`]),
    ...(isWebUrl(tag.source) ? [] : [`${owner}: technique ${index + 1} source is not a web URL`]),
    ...(tags.findIndex((other) => other.name === tag.name) === index
      ? []
      : [`${owner}: technique ${index + 1} repeats ${tag.name}`]),
  ]);
}

/**
 * Every technique tag a collection carries, with the owner a problem names.
 *
 * @param {AnyCollection} collection - The collection.
 * @returns {Array<readonly [string, readonly TechniqueTag[]]>} Each owner with its tags.
 */
function techniqueOwners(
  collection: AnyCollection,
): Array<readonly [string, readonly TechniqueTag[]]> {
  return [
    [collection.key, collection.techniques],
    ...collection
      .all()
      .flatMap((item) => [
        [item.id(), item.techniques()] as const,
        ...item
          .stages()
          .map(
            (entry, index) => [`${item.id()} stage ${index + 1}`, entry.techniques ?? []] as const,
          ),
      ]),
  ];
}

/**
 * The hash technique a BIP39 entropy recipe needs, read off the length of its hash.
 *
 * @param {string} hash - The entropy hash in hex.
 * @returns {Technique | undefined} MD5 for 32 hex characters, SHA-256 for 64, nothing otherwise.
 */
function entropyTechnique(hash: string): Technique | undefined {
  const byLength: Readonly<Record<number, Technique>> = {
    32: "md5-to-bip39-entropy",
    64: "sha256-to-bip39-entropy",
  };
  return byLength[hash.length];
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

/**
 * The hash an address encodes, in hex: the payload after the version byte of a Base58Check or
 * CashAddr address, or the witness program of a SegWit one. The address format test has already
 * checked the checksum, so a CashAddr only drops its eight checksum characters here.
 *
 * @param {string} address - The address as the record stores it.
 * @returns {string} The encoded hash in hex.
 */
function encodedHash(address: string): string {
  const cashAddr = /^(?:bitcoincash|ecash):/u.exec(address);
  if (cashAddr !== null) {
    const words = Array.from(address.slice(cashAddr[0].length, -8), (character) =>
      CASHADDR_CHARSET.indexOf(character),
    );
    return bech32.fromWords(words).slice(1).toHex();
  }
  if (/^(bc|ltc)1/u.test(address)) {
    return bech32.fromWords(bech32.decode(address as `${string}1${string}`).words.slice(1)).toHex();
  }
  return base58check.decode(address).slice(1).toHex();
}

function hash160Problem(puzzle: Puzzle): string | undefined {
  const { hash160, value } = puzzle.address();
  if (hash160 === undefined) {
    return undefined;
  }
  const encoded = encodedHash(value);
  return encoded === hash160
    ? undefined
    : `${puzzle.id()}: hash160 ${hash160} is not the ${encoded} its address encodes`;
}

/**
 * The target and the escrow in the chain's format, and the escrow somewhere else than the target:
 * an escrow on the target itself would count the prize twice.
 *
 * @param {Puzzle} puzzle - The record to check.
 * @returns {string[]} One line per problem.
 */
function addressProblems(puzzle: Puzzle): string[] {
  const id = puzzle.id();
  const chain = puzzle.chain();
  const target = puzzle.address().value;
  const escrow = puzzle.escrow()?.value;
  const problems: string[] = [];
  if (!isValidAddress(chain, target)) {
    problems.push(`${id}: address does not match the ${chain} format`);
  }
  if (escrow !== undefined && !isValidAddress(chain, escrow)) {
    problems.push(`${id}: escrow does not match the ${chain} format`);
  } else if (escrow !== undefined && sameAddress(chain, target, escrow)) {
    problems.push(`${id}: escrow is the target address`);
  }
  return problems;
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

  it("keeps puzzle identifiers unique, kebab-case and owned by their collection", () => {
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
        if (id.includes("_")) {
          problems.push(`${id}: id has an underscore, not kebab-case`);
        }
      }
    }

    expect(problems).toEqual([]);
  });

  it("keeps every address and escrow in its chain's format", () => {
    expect(puzzles.flatMap((puzzle) => addressProblems(puzzle))).toEqual([]);
  });

  it("names every way an escrow can fail the data gate", () => {
    const target = "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf";
    const record = (escrow: string): Puzzle =>
      puzzle({
        id: "fixture/escrow",
        chain: "ethereum",
        address: standard(target),
        escrow: standard(escrow),
        sourceUrl: "https://example.com/puzzle",
        startedAt: "2026-01-01",
      });

    expect(addressProblems(record("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"))).toEqual([
      "fixture/escrow: escrow does not match the ethereum format",
    ]);
    expect(addressProblems(record(target.toLowerCase()))).toEqual([
      "fixture/escrow: escrow is the target address",
    ]);
  });

  it("keeps every hash160 equal to the hash its address encodes", () => {
    expect(collect(hash160Problem)).toEqual([]);
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
        "picture-puzzle",
        "quizchain/6",
        "quizchain/7",
        "quizchain/8",
        "quizchain/9",
        "quizchain/12",
        "quizchain/13",
        "quizchain/14",
        "quizchain/15",
        "quizchain/16",
        "quizchain/17",
        "quizchain/18",
        "quizchain/19",
        "quizchain/20",
        "quizchain/21",
        "quizchain/22",
        "quizchain/24",
        "quizchain/25",
        "quizchain/26",
        "quizchain/27",
        "quizchain/28",
        "quizchain/29",
        "quizchain/30",
        "quizchain/31",
        "quizchain/32",
        "quizchain/33",
        "quizchain/34",
        "quizchain/35",
        "quizchain/36",
        "quizchain/37",
        "quizchain/38",
        "quizchain/40",
        "quizchain/43",
        "quizchain/45",
        "quizchain/46",
        "quizchain/47",
        "quizchain/49",
        "quizchain/50",
        "quizchain/51",
        "quizchain/52",
        "quizchain/53",
        "quizchain/54",
        "quizchain/56",
        "quizchain/57",
        "quizchain/60",
        "quizchain/61",
        "quizchain/63",
        "quizchain/65",
        "quizchain/68",
        "quizchain/69",
        "quizchain/75",
        "quizchain/77",
        "quizchain2/1",
        "quizchain2/4",
        "quizchain2/5",
        "quizchain2/7",
        "quizchain2/8",
        "quizchain2/9",
        "quizchain2/10",
        "quizchain2/11",
        "quizchain2/13",
        "quizchain2/14",
        "quizchain2/15",
        "quizchain2/16",
        "quizchain2/17",
        "quizchain2/18",
        "quizchain2/19",
        "quizchain2/20",
        "quizchain2/21",
        "quizchain2/22",
        "quizchain2/23",
        "quizchain2/24",
        "quizchain2/25",
        "quizchain2/26",
        "quizchain2/27",
        "quizchain2/28",
        "quizchain2/29",
        "quizchain2/30",
        "quizchain2/31",
        "quizchain2/32",
        "quizchain2/33",
        "quizchain2/34",
        "quizchain2/35",
        "quizchain2/36",
        "quizchain2/37",
        "quizchain2/38",
        "quizchain2/39",
        "quizchain2/40",
        "satoshi-birthday-quiz",
        "trivia-brainwallet",
      ],
    );
  });

  it("records a public key for every claimed or swept puzzle", () => {
    expect(collect(claimedPubkeyProblem)).toEqual([]);
  });

  it("references only existing assets", () => {
    expect(puzzles.flatMap((puzzle) => assetProblems(puzzle))).toEqual([]);
  });

  it("pins the bytes of every asset to the repository copy", () => {
    expect(puzzles.flatMap((puzzle) => digestProblems(puzzle))).toEqual([]);
  });

  it("names every way an asset digest can fail the data gate", () => {
    const image = readFileSync("assets/gsmg/puzzle.png");
    const pinned = puzzle({
      id: "gsmg",
      chain: "bitcoin",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      assets: assets({
        puzzle: "puzzle.png",
        hints: ["follow-the-white-rabbit.png", "phase2.txt"],
        digests: [
          digest("puzzle.png", "0".repeat(64), image.length),
          digest("follow-the-white-rabbit.png", "ABC", -1, {
            url: "ftp://gsmg.io/rabbit.png",
            archive: "https://archive.ph/rabbit",
          }),
          digest("gone.png", "0".repeat(64), 1),
          digest("gone.png", "0".repeat(64), 1),
        ],
      }),
    });

    expect(digestProblems(pinned)).toEqual([
      `gsmg: asset puzzle.png is 38125bbdf1ea58b9b30b075bc6bf71e4089d04bba37098317e47097e2f2a1830 (${image.length} bytes), not ${"0".repeat(64)} (${image.length} bytes)`,
      "gsmg: asset follow-the-white-rabbit.png is 5e8d84b88f8f829428df5d2a8bf36c7268346f169b799ac7570b6223990d204f (1958 bytes), not ABC (-1 bytes)",
      "gsmg: asset phase2.txt has no digest",
      "gsmg: digest of follow-the-white-rabbit.png is not lowercase SHA-256 hex",
      "gsmg: digest of follow-the-white-rabbit.png has no byte count",
      "gsmg: digest of follow-the-white-rabbit.png has no web URL for its origin",
      "gsmg: digest of follow-the-white-rabbit.png archive is not a Wayback id_ replay",
      "gsmg: digest of gone.png names no file the record ships",
      "gsmg: digest of gone.png names no file the record ships",
      "gsmg: digest of gone.png repeats",
    ]);
  });

  it("refuses an asset that resolves outside its collection directory", () => {
    const escaped = puzzle({
      id: "fixture/escaped",
      chain: "bitcoin",
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
    const escaped = puzzle({
      id: "fixture/escaped",
      chain: "bitcoin",
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
    const staged = puzzle({
      id: "fixture/staged",
      chain: "bitcoin",
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
    const hinted = puzzle({
      id: "fixture/hinted",
      chain: "bitcoin",
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

  it("tags every technique from the vocabulary with a web source, each name once per owner", () => {
    expect(
      registered
        .flatMap(techniqueOwners)
        .flatMap(([owner, tags]) => techniqueProblems(owner, tags)),
    ).toEqual([]);
  });

  it("names every way a technique can fail the data gate", () => {
    expect(
      techniqueProblems("fixture", [
        technique("rot13" as Technique, "https://example.com/rules"),
        technique("atbash", "ftp://example.com/rules"),
        technique("atbash", "https://example.com/rules"),
      ]),
    ).toEqual([
      "fixture: technique 1 is not in the vocabulary",
      "fixture: technique 2 source is not a web URL",
      "fixture: technique 3 repeats atbash",
    ]);
  });

  it("tags every BIP39 entropy hash with the hash its length fits, and nothing else", () => {
    const problems = registered.flatMap((collection) =>
      collection.all().flatMap((item) => {
        const hash = item.keyData()?.seed?.entropy?.hash;
        if (hash === undefined) {
          return [];
        }
        const tagged = collection
          .techniquesById(item.id())
          .map((tag) => tag.name)
          .filter((name) => name.endsWith("-to-bip39-entropy"))
          .join(", ");
        return tagged === (entropyTechnique(hash) ?? "an unknown hash")
          ? []
          : [
              `${item.id()}: entropy of ${hash.length} hex characters tagged ${tagged || "nothing"}`,
            ];
      }),
    );
    expect(problems).toEqual([]);
  });

  it("rebuilds every SHA-256 brainwallet key the record holds from its passphrase", () => {
    const checked = registered.flatMap((collection) =>
      collection.all().flatMap((item) => {
        const key = item.keyData();
        const phrase = key?.wif?.passphrase;
        const tagged = collection
          .techniquesById(item.id())
          .some((tag) => tag.name === "sha256-brainwallet");
        return tagged && key?.hex !== undefined && phrase !== undefined
          ? [[item.id(), sha256(new TextEncoder().encode(phrase)).toHex() === key.hex] as const]
          : [];
      }),
    );
    expect(checked).toHaveLength(28);
    expect(checked.filter(([, rebuilt]) => !rebuilt)).toEqual([]);
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
      puzzle({
        id: "fixture/one",
        chain: "bitcoin",
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
        puzzle({
          id: "fixture/one",
          chain: "bitcoin",
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
