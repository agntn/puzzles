import type { PuzzleFile } from "../../../src/core/files.ts";
import type {
  Answer,
  Chain,
  Entropy,
  Hint,
  KeyData,
  Puzzle,
  TechniqueTag,
} from "../../../src/index.ts";
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

/** How the viewer shows a file: a picture, rendered markdown, plain text or the browser's own. */
export type FileFormat = "image" | "markdown" | "text" | "document";

/** One file the page lets a reader open: the record's own, or a reading copy of a page it cites. */
export interface FileRow {
  readonly kind: PuzzleFile["kind"];
  readonly label: string;
  readonly path: string;
  readonly url: string;
  readonly format: FileFormat;
  /** The capture of a cited page, shown beside its transcript. */
  readonly screenshot?: string;
  readonly origin?: string;
  readonly archive?: string;
  readonly date?: string;
  readonly bytes?: number;
}

/** One artifact of a stage: where the author published it and the file the site serves, if any. */
export interface ArtifactRow {
  readonly name: string;
  readonly url: string;
  readonly file?: string;
}

/** One stage as the page prints it: its name, what it is about, its artifacts and its answer. */
export interface StageRow {
  readonly name: string;
  readonly about: string;
  readonly artifacts: readonly ArtifactRow[];
  readonly answer?: Answer;
}

/** One hint as the page prints it: the record, plus whether the whole collection shares it. */
export interface HintRow extends Hint {
  readonly shared: boolean;
}

/** One technique on the page: the tag and where it sits, the collection, the puzzle or a stage. */
export interface TechniqueRow extends TechniqueTag {
  readonly scope: string;
}

/** Everything a puzzle page shows: the landing sample plus the parts the panels leave out. */
export interface PuzzleView extends LandingSample {
  readonly name: string;
  readonly preGenesis: boolean;
  /** The contract the prize waits in, when the key's wallet has to pull it out. */
  readonly escrow:
    | { readonly address: string; readonly kind: string; readonly explorer: string }
    | undefined;
  /** No source printed the private key; the record rebuilt it from the published recipe. */
  readonly derived: boolean;
  readonly keyRows: readonly KeyRow[];
  readonly transactionRows: readonly TransactionRow[];
  readonly assetSource: string | undefined;
  readonly stages: readonly StageRow[];
  readonly hints: readonly HintRow[];
  readonly techniques: readonly TechniqueRow[];
  readonly solverName: string | undefined;
  /** The solver's page key, when the record names the solver. */
  readonly solverKey: string | undefined;
  readonly solverUrl: string | undefined;
  readonly claimUrl: string | undefined;
  readonly json: string;
}

/** The slice of the library a view needs; the transaction link builder is a library export too. */
export interface ViewLibrary extends SampleLibrary {
  readonly addressExplorerUrl: (chain: Chain, address: string) => string;
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
    ...row("BIP39 passphrase", seed.passphrase),
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
 * The site URL of a file under `assets/<collection>/`, encoded segment by segment like the
 * library's asset URLs, so a `#` or a `?` in a file name still addresses the file.
 *
 * @param {string} collection - The collection key.
 * @param {string} file - The file name under the collection's asset directory.
 * @returns {string} The site path of the file.
 */
export function assetHref(collection: string, file: string): string {
  return `/${["assets", collection, ...file.split("/")].map(encodeURIComponent).join("/")}`;
}

/**
 * Reads one puzzle into everything its page renders. Plain data, safe for the Nuxt payload.
 *
 * @param {ViewLibrary} library - `secretOf`, `verify` and the two explorer URL builders.
 * @param {Puzzle} puzzle - The puzzle to read.
 * @param {string} tool - What `puzzles_show` prints for it.
 * @param {readonly Hint[]} shared - The hints of the puzzle's collection, listed ahead of its own.
 * @param {readonly TechniqueTag[]} sharedTechniques - The collection's techniques, listed first.
 * @returns {Promise<PuzzleView>} The sample plus key rows, transactions, assets, hints, solver and the JSON.
 */
export async function toPuzzleView(
  library: ViewLibrary,
  puzzle: Puzzle,
  tool: string,
  shared: readonly Hint[],
  sharedTechniques: readonly TechniqueTag[],
): Promise<PuzzleView> {
  const sample = await toSample(library, puzzle, tool);
  const assets = puzzle.assets();
  const solver = puzzle.solver();
  const escrow = puzzle.escrow();
  return {
    ...sample,
    name: puzzle.name(),
    preGenesis: puzzle.preGenesis(),
    escrow:
      escrow === undefined
        ? undefined
        : {
            address: escrow.value,
            kind: escrow.kind,
            explorer: library.addressExplorerUrl(puzzle.chain(), escrow.value),
          },
    derived: puzzle.hasDerivedKey(),
    keyRows: keyRows(puzzle.keyData()),
    transactionRows: puzzle.transactions().map((transaction) => ({
      type: transaction.tx_type.replaceAll("_", " "),
      txid: transaction.txid,
      date: transaction.date,
      amount: formatPrize(transaction.amount, puzzle.prizeCurrency()),
      url: library.transactionExplorerUrl(puzzle.chain(), transaction.txid),
    })),
    assetSource: assets?.source_url,
    stages: puzzle.stages().map((stage) => ({
      name: stage.name,
      about: stage.about,
      ...(stage.answer === undefined ? {} : { answer: stage.answer }),
      artifacts: stage.artifacts.map((item) => ({
        name: item.name,
        url: item.url,
        ...(item.file === undefined ? {} : { file: assetHref(puzzle.collection(), item.file) }),
      })),
    })),
    hints: [
      ...shared.map((hint) => ({ ...hint, shared: true })),
      ...puzzle.hints().map((hint) => ({ ...hint, shared: false })),
    ],
    techniques: [
      ...sharedTechniques.map((tag) => ({ ...tag, scope: "collection" })),
      ...puzzle.techniques().map((tag) => ({ ...tag, scope: "puzzle" })),
      ...puzzle
        .stages()
        .flatMap((stage) =>
          (stage.techniques ?? []).map((tag) => ({ ...tag, scope: `stage ${stage.name}` })),
        ),
    ],
    solverName: solver?.name,
    solverKey: solver?.key,
    solverUrl: solver?.profiles?.[0]?.url,
    claimUrl: puzzle.claimExplorerUrl(),
    json: JSON.stringify(puzzle.toJSON(), null, 2),
  };
}

/**
 * The site path of a repository path under `assets/`, encoded like `assetHref`.
 *
 * @param {string} path - The path from the repository root.
 * @returns {string} The site path.
 */
function siteHref(path: string): string {
  return `/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * How a file opens, read off its extension; anything unknown goes to the browser.
 *
 * @param {string} path - The file's path.
 * @returns {FileFormat} The viewer the page picks.
 */
export function fileFormat(path: string): FileFormat {
  if (/\.(?:png|jpe?g|gif|webp|svg)$/iu.test(path)) return "image";
  if (/\.md$/iu.test(path)) return "markdown";
  if (/\.(?:txt|asc|csv|json)$/iu.test(path)) return "text";
  return "document";
}

/**
 * The name a file goes by on the page: its role, the hint's number, the artifact's own name.
 *
 * @param {PuzzleFile} file - The file.
 * @param {number} hint - Its position among the hint files, from one.
 * @param {ReadonlyMap<string, string>} artifacts - Artifact names by repository path.
 * @returns {string} The label.
 */
function fileLabel(file: PuzzleFile, hint: number, artifacts: ReadonlyMap<string, string>): string {
  switch (file.kind) {
    case "hint":
      return `hint ${hint}`;
    case "artifact":
      return artifacts.get(file.path) ?? "artifact";
    case "source":
      return file.citedBy === "author" ? "author's post" : "source";
    default:
      return file.kind;
  }
}

/**
 * Every file `puzzles_assets` lists, a screenshot folded into its transcript like the tool does.
 *
 * @param {Puzzle} puzzle - The puzzle, for its stage artifact names.
 * @param {readonly PuzzleFile[]} files - What `puzzleFiles()` lists for it.
 * @returns {FileRow[]} One row per file a reader opens.
 */
export function toFileRows(puzzle: Puzzle, files: readonly PuzzleFile[]): FileRow[] {
  const directory = `assets/${puzzle.collection()}`;
  const artifacts = new Map(
    puzzle
      .stages()
      .flatMap((stage) => stage.artifacts)
      .flatMap((item) =>
        item.file === undefined ? [] : [[`${directory}/${item.file}`, item.name]],
      ),
  ) as ReadonlyMap<string, string>;
  const screenshots = new Set(
    files.filter((file) => file.kind === "screenshot").map((file) => file.path),
  );
  const folded = new Set(
    files
      .filter((file) => file.kind === "source")
      .map((file) => file.path.replace(/\.md$/u, ".png"))
      .filter((path) => screenshots.has(path)),
  );
  let hints = 0;
  return files.flatMap((file): FileRow[] => {
    if (file.kind === "screenshot" && folded.has(file.path)) return [];
    if (file.kind === "hint") hints += 1;
    return [fileRow(file, fileLabel(file, hints, artifacts), folded)];
  });
}

/**
 * One file as the page opens it, with the screenshot of a cited page that has one.
 *
 * @param {PuzzleFile} file - The file.
 * @param {string} label - Its name on the page.
 * @param {ReadonlySet<string>} folded - The screenshots that ride on their transcript's row.
 * @returns {FileRow} The row.
 */
function fileRow(file: PuzzleFile, label: string, folded: ReadonlySet<string>): FileRow {
  const screenshot = file.path.replace(/\.md$/u, ".png");
  return {
    kind: file.kind,
    label,
    path: file.path,
    url: siteHref(file.path),
    format: fileFormat(file.path),
    ...(file.kind === "source" && folded.has(screenshot)
      ? { screenshot: siteHref(screenshot) }
      : {}),
    ...(file.origin === undefined ? {} : { origin: file.origin }),
    ...(file.archive === undefined ? {} : { archive: file.archive }),
    ...(file.date === undefined ? {} : { date: file.date }),
    ...(file.bytes === undefined ? {} : { bytes: file.bytes }),
  };
}
