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
const HINT_DATE = /^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2})?$/u;

function isWebUrl(value: string): boolean {
  return URL.canParse(value) && /^https?:$/u.test(new URL(value).protocol);
}

/**
 * The problems of one hint: a text that is empty or spans lines, a source or a confirmation that
 * is not a web URL, a confirmation that repeats the source and so confirms nothing, or a date in
 * another format.
 *
 * @param {Hint} hint - The hint.
 * @returns {string[]} One problem per failed check.
 */
function hintProblems(hint: Hint): string[] {
  return [
    ...(hint.text.trim() === "" || /[\n\r\t]/u.test(hint.text) ? ["text is not one line"] : []),
    ...(isWebUrl(hint.source) ? [] : ["source is not a web URL"]),
    ...(isWebUrl(hint.confirmation.url) ? [] : ["confirmation is not a web URL"]),
    ...(hint.confirmation.url === hint.source ? ["confirmation repeats the source"] : []),
    ...(hint.date === undefined || HINT_DATE.test(hint.date) ? [] : ["date is not a record date"]),
  ];
}

function hintRecordProblems(puzzle: Puzzle): string[] {
  return puzzle
    .hints()
    .flatMap((hint, index) =>
      hintProblems(hint).map((problem) => `${puzzle.id()}: hint ${index + 1} ${problem}`),
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
    expect(puzzles.flatMap((puzzle) => hintRecordProblems(puzzle))).toEqual([]);
    expect(
      registered.flatMap((collection) =>
        collection.hints.flatMap((hint, index) =>
          hintProblems(hint).map((problem) => `${collection.key}: hint ${index + 1} ${problem}`),
        ),
      ),
    ).toEqual([]);
  });

  it("names every way a hint can fail the data gate", () => {
    const hinted = bitcoinPuzzle({
      id: "fixture/hinted",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      hints: [
        official("one\ntwo", "ftp://example.com/puzzle", confirmation("not a url")),
        official(" ", "https://example.com/puzzle", confirmation("https://example.com/puzzle"), {
          date: "2026-1-3",
        }),
      ],
    });

    expect(hintRecordProblems(hinted)).toEqual([
      "fixture/hinted: hint 1 text is not one line",
      "fixture/hinted: hint 1 source is not a web URL",
      "fixture/hinted: hint 1 confirmation is not a web URL",
      "fixture/hinted: hint 2 text is not one line",
      "fixture/hinted: hint 2 confirmation repeats the source",
      "fixture/hinted: hint 2 date is not a record date",
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
