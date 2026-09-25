import type { Assets, Chain, Entropy, Hint, KeyData, Puzzle } from "../../../src/index.ts";
import { formatPrize } from "./format.ts";
import { toSample, type LandingSample, type SampleLibrary } from "./samples.ts";

export interface KeyRow {
  readonly label: string;
  readonly value: string;
  readonly mono: boolean;
  readonly href?: string;
}

export interface TransactionRow {
  readonly type: string;
  readonly txid: string;
  readonly date: string;
  readonly amount: string;
  readonly url: string;
}

export interface AssetLink {
  readonly label: string;
  readonly path: string;
  readonly url: string;
  readonly image: boolean;
}

/** One hint as the page prints it: the record, plus whether the whole collection shares it. */
export interface HintRow extends Hint {
  readonly shared: boolean;
}

/** Everything a puzzle page shows: the landing sample plus the parts the panels leave out. */
export interface PuzzleView extends LandingSample {
  readonly name: string;
  readonly preGenesis: boolean;
  /** No source printed the private key; the record rebuilt it from the published recipe. */
  readonly derived: boolean;
  readonly keyRows: readonly KeyRow[];
  readonly transactionRows: readonly TransactionRow[];
  readonly assets: readonly AssetLink[];
  readonly assetSource: string | undefined;
  readonly hints: readonly HintRow[];
  readonly solverName: string | undefined;
  /** The solver's page key, when the record names the solver. */
  readonly solverKey: string | undefined;
  readonly solverUrl: string | undefined;
  readonly claimUrl: string | undefined;
  readonly json: string;
}

/** The slice of the library a view needs; the transaction link builder is a library export too. */
export interface ViewLibrary extends SampleLibrary {
  readonly transactionExplorerUrl: (chain: Chain, txid: string) => string;
}

function row(label: string, value: string | undefined, mono = true, href?: string): KeyRow[] {
  if (value === undefined) return [];
  return [href === undefined ? { label, value, mono } : { label, value, mono, href }];
}

/**
 * The raw key and the Wallet Import Format material around it.
 *
 * @param {KeyData} key - The serialized key record.
 * @returns {KeyRow[]} One row per present field.
 */
function wifRows(key: KeyData): KeyRow[] {
  return [
    ...row("private key (hex)", key.hex),
    ...row("WIF", key.wif?.decrypted),
    ...row("BIP38 payload", key.wif?.encrypted),
    ...row("passphrase", key.wif?.passphrase),
    ...row("salt", key.wif?.salt),
    ...row("mini private key", key.mini),
  ];
}

/**
 * The external entropy a seed was built from, and the passphrase on top of it when the record names one.
 *
 * @param {Entropy | undefined} entropy - The seed's entropy block.
 * @returns {KeyRow[]} The hash, the source and the passphrase rows.
 */
function entropyRows(entropy: Entropy | undefined): KeyRow[] {
  if (entropy === undefined) return [];
  const passphrase = entropy.passphrase;
  const passphraseRows =
    passphrase === undefined
      ? []
      : passphrase === "Required"
        ? row("BIP39 passphrase", "required, not published", false)
        : row("BIP39 passphrase", passphrase.Known);
  return [
    ...row("entropy hash", entropy.hash),
    ...row(
      "entropy source",
      entropy.source?.description ?? entropy.source?.url,
      false,
      entropy.source?.url,
    ),
    ...passphraseRows,
  ];
}

/**
 * The seed record: phrase, path, xpub and the entropy the phrase was built from.
 *
 * @param {KeyData} key - The serialized key record.
 * @returns {KeyRow[]} One row per present field.
 */
function seedRows(key: KeyData): KeyRow[] {
  const seed = key.seed;
  if (seed === undefined) return [];
  return [
    ...row("seed phrase", seed.phrase),
    ...row("derivation path", seed.path),
    ...row("extended public key", seed.xpub),
    ...entropyRows(seed.entropy),
  ];
}

/**
 * The secret sharing scheme and every share that was published.
 *
 * @param {KeyData} key - The serialized key record.
 * @returns {KeyRow[]} The scheme row and one row per share.
 */
function shareRows(key: KeyData): KeyRow[] {
  const shares = key.shares;
  if (shares === undefined) return [];
  return [
    ...row(
      "secret sharing",
      `${shares.threshold} of ${shares.total} shares, ${shares.shares.length} published`,
      false,
    ),
    ...shares.shares.flatMap((share) => row(`share ${share.index}`, share.data)),
  ];
}

function keyRows(key: KeyData | undefined): KeyRow[] {
  return key === undefined ? [] : [...wifRows(key), ...seedRows(key), ...shareRows(key)];
}

/**
 * Links to the files a record ships. The site serves `assets/` from the checkout, so the
 * links stay local and never depend on which repository the package lives in this week.
 *
 * @param {string} collection - The collection key, the directory under `assets/`.
 * @param {Assets | undefined} assets - The record's asset block.
 * @returns {AssetLink[]} The puzzle image, the hints and the solution, in that order.
 */
function assetLinks(collection: string, assets: Assets | undefined): AssetLink[] {
  if (assets === undefined) return [];
  const entries: [string, string | undefined][] = [
    ["puzzle", assets.puzzle],
    ...(assets.hints ?? []).map((hint, index): [string, string] => [`hint ${index + 1}`, hint]),
    ["solution", assets.solution],
  ];
  return entries.flatMap(([label, path]) =>
    path === undefined
      ? []
      : [
          {
            label,
            path: `assets/${collection}/${path}`,
            url: `/assets/${collection}/${path}`,
            image: /\.(?:png|jpe?g|gif|webp|svg)$/iu.test(path),
          },
        ],
  );
}

/**
 * Reads one puzzle into everything its page renders. Plain data, safe for the Nuxt payload.
 *
 * @param {ViewLibrary} library - `secretOf`, `verify` and `transactionExplorerUrl`.
 * @param {Puzzle} puzzle - The puzzle to read.
 * @param {string} tool - What `puzzles_show` prints for it.
 * @param {readonly Hint[]} shared - The hints of the puzzle's collection, listed ahead of its own.
 * @returns {Promise<PuzzleView>} The sample plus key rows, transactions, assets, hints, solver and the JSON.
 */
export async function toPuzzleView(
  library: ViewLibrary,
  puzzle: Puzzle,
  tool: string,
  shared: readonly Hint[],
): Promise<PuzzleView> {
  const sample = await toSample(library, puzzle, tool);
  const assets = puzzle.assets();
  const solver = puzzle.solver();
  return {
    ...sample,
    name: puzzle.name(),
    preGenesis: puzzle.preGenesis(),
    derived: puzzle.hasDerivedKey(),
    keyRows: keyRows(puzzle.keyData()),
    transactionRows: puzzle.transactions().map((transaction) => ({
      type: transaction.tx_type.replaceAll("_", " "),
      txid: transaction.txid,
      date: transaction.date,
      amount: formatPrize(transaction.amount, puzzle.prizeCurrency()),
      url: library.transactionExplorerUrl(puzzle.chain(), transaction.txid),
    })),
    assets: assetLinks(puzzle.collection(), assets),
    assetSource: assets?.source_url,
    hints: [
      ...shared.map((hint) => ({ ...hint, shared: true })),
      ...puzzle.hints().map((hint) => ({ ...hint, shared: false })),
    ],
    solverName: solver?.name,
    solverKey: solver?.key,
    solverUrl: solver?.profiles?.[0]?.url,
    claimUrl: puzzle.claimExplorerUrl(),
    json: JSON.stringify(puzzle.toJSON(), null, 2),
  };
}
