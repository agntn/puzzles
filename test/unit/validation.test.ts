import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { isValidAddress, isValidTransactionId } from "../../src/core/chains.ts";
import {
  addressesEqual,
  addressFromPrivateKey,
  privateKeyToWif,
  wifToPrivateKey,
} from "../../src/core/crypto.ts";
import {
  AddressKind,
  assets,
  confirmation,
  type Hint,
  type KeyData,
  official,
  p2pkh,
  PubkeyFormat,
  TransactionType,
} from "../../src/core/parts.ts";
import { bitcoinPuzzle, type Puzzle, Status } from "../../src/core/puzzle.ts";
import { ArweaveCollection } from "../../src/collections/arweave.ts";
import { all, collections } from "../../src/index.ts";
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

function claimedPubkeyProblem(puzzle: Puzzle): string | undefined {
  if (
    puzzle.status() === Status.Unsolved ||
    puzzle.collection() === ArweaveCollection.key ||
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
 * The problems of one hint: a field that is empty or spans lines, a source or a confirmation that
 * is not a web URL, a confirmation that repeats the source and so confirms nothing, or a date
 * that is not on the calendar.
 *
 * @param {Hint} hint - The hint.
 * @returns {string[]} One problem per failed check.
 */
function problemsOf(hint: Hint): string[] {
  return [
    ...(isOneLine(hint.text) ? [] : ["text is not one line"]),
    ...(isOneLine(hint.confirmation.description) ? [] : ["description is not one line"]),
    ...(isWebUrl(hint.source) ? [] : ["source is not a web URL"]),
    ...(isWebUrl(hint.confirmation.url) ? [] : ["confirmation is not a web URL"]),
    ...(hint.confirmation.url === hint.source ? ["confirmation repeats the source"] : []),
    ...(hint.date === undefined || isRecordDate(hint.date) ? [] : ["date is not a record date"]),
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

  it("keeps every hint on one line with a source and a separate confirmation", () => {
    expect(puzzles.flatMap((puzzle) => hintProblems(puzzle.id(), puzzle.hints()))).toEqual([]);
    expect(
      registered.flatMap((collection) => hintProblems(collection.key, collection.hints)),
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
      "fixture/hinted: hint 2 confirmation repeats the source",
      "fixture/hinted: hint 2 date is not a record date",
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
