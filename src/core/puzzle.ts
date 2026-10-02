import { version } from "../version.ts";
import type { BalanceOptions } from "./balance.ts";
import { addressExplorerUrl, Chain, chainSymbol, transactionExplorerUrl } from "./chains.ts";
import type { Balance } from "./types.ts";
import {
  type Address,
  addressOn,
  type Assets,
  type Digest,
  defined,
  frozen,
  type Hint,
  type Key,
  type KeyData,
  type Party,
  type Pubkey,
  secretOf,
  type Stage,
  type TechniqueTag,
  type Transaction,
  TransactionType,
} from "./parts.ts";
import { Status } from "./status.ts";

export { Status } from "./status.ts";

/** Serialized puzzle record. Absent fields are omitted, never null. */
export interface PuzzleData {
  readonly address: Address;
  readonly assets?: Assets;
  readonly chain: Chain;
  readonly currency?: string;
  readonly escrow?: Address;
  readonly hints?: readonly Hint[];
  readonly id: string;
  readonly key?: KeyData;
  readonly pre_genesis?: boolean;
  readonly prize?: number;
  readonly pubkey?: Pubkey;
  readonly solve_date?: string;
  readonly solve_time?: number;
  readonly solver?: Party;
  readonly source_url: string;
  readonly stages?: readonly Stage[];
  readonly start_date: string;
  readonly status: Status;
  readonly techniques?: readonly TechniqueTag[];
  readonly transactions?: readonly Transaction[];
}

/** One file a puzzle ships: its role, its name, where it lives and what the record pins. */
export interface AssetLink {
  readonly archive?: string;
  readonly bytes?: number;
  readonly file: string;
  readonly kind: "puzzle" | "hint" | "solution" | "artifact";
  readonly origin?: string;
  readonly path: string;
  readonly sha256?: string;
  readonly url: string;
}

/** The transaction list of a puzzle that recorded none, frozen like every other part. */
const NO_TRANSACTIONS: readonly Transaction[] = Object.freeze([]);

/** The asset list of a puzzle that ships no files. */
const NO_ASSET_LINKS: readonly AssetLink[] = Object.freeze([]);

/** The stage list of a puzzle that runs in one. */
const NO_STAGES: readonly Stage[] = Object.freeze([]);

/** The hint list of a puzzle that recorded none. */
const NO_HINTS: readonly Hint[] = Object.freeze([]);

/** The technique list of a puzzle that recorded none. */
const NO_TECHNIQUES: readonly TechniqueTag[] = Object.freeze([]);

/**
 * Assets under the release tag of this package version, not `main`: a published record keeps
 * pointing at the files it was written against after a later release moves or renames them.
 */
const ASSET_ROOT = `https://raw.githubusercontent.com/agntn/puzzles/v${version}`;

/**
 * The canonical remote URL of a repository path, encoded segment by segment so a file name that
 * carries a `#` or a `?` still addresses the file rather than a fragment or a query.
 *
 * @param {string} path - The path from the repository root.
 * @returns {string} The URL.
 */
function assetUrlOf(path: string): string {
  return `${ASSET_ROOT}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * A file's digest as link fields, with its `url` as `origin` beside the repository copy's `url`.
 *
 * @param {string} file - The file name under the collection's asset directory.
 * @param {readonly Digest[] | undefined} digests - The digests on the record.
 * @returns {Pick<AssetLink, "archive" | "bytes" | "origin" | "sha256">} The fields the digest has.
 */
function pinned(
  file: string,
  digests: readonly Digest[] | undefined,
): Pick<AssetLink, "archive" | "bytes" | "origin" | "sha256"> {
  const found = digests?.find((item) => item.file === file);
  return found === undefined
    ? {}
    : defined({
        sha256: found.sha256,
        bytes: found.bytes,
        origin: found.url,
        archive: found.archive,
      });
}

/**
 * One hint or solution link under the collection's asset directory.
 *
 * @param {AssetLink["kind"]} kind - The file's role on the record.
 * @param {string} file - The file name under the directory.
 * @param {string} directory - The collection's asset directory from the repository root.
 * @param {readonly Digest[] | undefined} digests - The digests on the record.
 * @returns {AssetLink} The link.
 */
function assetLink(
  kind: AssetLink["kind"],
  file: string,
  directory: string,
  digests: readonly Digest[] | undefined,
): AssetLink {
  const path = `${directory}/${file}`;
  return { kind, file, path, url: assetUrlOf(path), ...pinned(file, digests) };
}

/**
 * The puzzle image link as `assetPath()` and `assetUrl()` answer it, so a subclass that overrides
 * either keeps its answer in the list.
 *
 * @param {string | undefined} file - The image file name on the record.
 * @param {string | undefined} path - What `assetPath()` answers.
 * @param {string | undefined} url - What `assetUrl()` answers.
 * @param {readonly Digest[] | undefined} digests - The digests on the record.
 * @returns {readonly AssetLink[]} The link, or nothing when any of the three is missing.
 */
function imageLink(
  file: string | undefined,
  path: string | undefined,
  url: string | undefined,
  digests: readonly Digest[] | undefined,
): readonly AssetLink[] {
  return file === undefined || path === undefined || url === undefined
    ? []
    : [{ kind: "puzzle", file, path, url, ...pinned(file, digests) }];
}

/**
 * The image, hint and solution links of a record that ships files, in that order.
 *
 * @param {Assets} assets - The record's assets.
 * @param {string} directory - The collection's asset directory from the repository root.
 * @param {readonly AssetLink[]} image - The puzzle image link, as `imageLink()` builds it.
 * @returns {AssetLink[]} The links.
 */
function recordLinks(assets: Assets, directory: string, image: readonly AssetLink[]): AssetLink[] {
  const { digests } = assets;
  return [
    ...image,
    ...(assets.hints ?? []).map((hint) => assetLink("hint", hint, directory, digests)),
    ...(assets.solution === undefined
      ? []
      : [assetLink("solution", assets.solution, directory, digests)]),
  ];
}

const SOLVE_TIME_UNITS = [
  [365 * 24 * 60 * 60, "y"],
  [30 * 24 * 60 * 60, "mo"],
  [24 * 60 * 60, "d"],
  [60 * 60, "h"],
  [60, "m"],
] as const;

/**
 * One crypto puzzle. Subclasses say what the target is, what's known about its key and what
 * happened on chain. Everything computable from those answers lives here.
 */
export abstract class Puzzle {
  /** Universal identifier shaped as `collection/name`, or the bare collection key for singletons. */
  abstract id(): string;

  /** Chain the target address lives on. */
  abstract chain(): Chain;

  /** Target address record. */
  abstract address(): Address;

  /** Page that documents the puzzle. */
  abstract sourceUrl(): string;

  /**
   * Contract that holds the prize and pays it out only to the target address, for a puzzle whose
   * key opens a wallet that then has to claim the prize from somewhere else.
   *
   * @returns {Address | undefined} The escrow contract, when the prize doesn't sit at the target.
   */
  escrow(): Address | undefined {
    return undefined;
  }

  /** When the puzzle was funded or announced. */
  abstract startedAt(): string;

  /**
   * Lifecycle state. Override for anything that isn't still open.
   *
   * @returns {Status} Lifecycle state. Override for anything that isn't still open.
   */
  status(): Status {
    return Status.Unsolved;
  }

  /**
   * Public key, once the address exposed one.
   *
   * @returns {Pubkey | undefined} Public key, once the address exposed one.
   */
  pubkey(): Pubkey | undefined {
    return undefined;
  }

  /**
   * Private key material, as far as it's public.
   *
   * @returns {Readonly<Key> | undefined} Private key material, as far as it's public.
   */
  key(): Readonly<Key> | undefined {
    return undefined;
  }

  /**
   * Prize in the chain's native token unless `currency()` says otherwise.
   *
   * @returns {number | undefined} Prize in the chain's native token unless `currency()` says otherwise.
   */
  prize(): number | undefined {
    return undefined;
  }

  /**
   * Prize currency when it isn't the native token.
   *
   * @returns {string | undefined} Prize currency when it isn't the native token.
   */
  currency(): string | undefined {
    return undefined;
  }

  /**
   * When the puzzle was solved.
   *
   * @returns {string | undefined} When the puzzle was solved.
   */
  solvedAt(): string | undefined {
    return undefined;
  }

  /**
   * How long the puzzle stood, in seconds.
   *
   * @returns {number | undefined} How long the puzzle stood, in seconds.
   */
  solveTime(): number | undefined {
    return undefined;
  }

  /**
   * Whether the address predates the Bitcoin genesis block conventions.
   *
   * @returns {boolean} Whether the address predates the Bitcoin genesis block conventions.
   */
  preGenesis(): boolean {
    return false;
  }

  /**
   * Transactions recorded for the address, in chronological order.
   *
   * @returns {readonly Transaction[]} Transactions recorded for the address, in chronological order.
   */
  transactions(): readonly Transaction[] {
    return NO_TRANSACTIONS;
  }

  /**
   * Who solved it, when that's known.
   *
   * @returns {Party | undefined} Who solved it, when that's known.
   */
  solver(): Party | undefined {
    return undefined;
  }

  /**
   * Images and hints shipped with the puzzle.
   *
   * @returns {Assets | undefined} Images and hints shipped with the puzzle.
   */
  assets(): Assets | undefined {
    return undefined;
  }

  /**
   * The stages of a puzzle that runs in several, in the author's order, each with what the author
   * published for it.
   *
   * @returns {readonly Stage[]} The stages, or an empty list for a puzzle that runs in one.
   */
  stages(): readonly Stage[] {
    return NO_STAGES;
  }

  /**
   * Hints about this puzzle alone, in record order; the collection's sit on `Collection.hints`.
   *
   * @returns {readonly Hint[]} The hints, or an empty list when the record has none.
   */
  hints(): readonly Hint[] {
    return NO_HINTS;
  }

  /**
   * Techniques of this record alone; its stages and `Collection.techniques` hold their own.
   *
   * @returns {readonly TechniqueTag[]} The techniques, or an empty list when the record has none.
   */
  techniques(): readonly TechniqueTag[] {
    return NO_TECHNIQUES;
  }

  /**
   * Collection segment of the identifier.
   *
   * @returns {string} Collection segment of the identifier.
   */
  collection(): string {
    const id = this.id();
    return id.split("/", 1)[0] ?? id;
  }

  /**
   * Name segment of the identifier, empty for singletons.
   *
   * @returns {string} Name segment of the identifier, empty for singletons.
   */
  name(): string {
    const id = this.id();
    return id.includes("/") ? id.slice(id.indexOf("/") + 1) : "";
  }

  /**
   * Serializable key material.
   *
   * @returns {KeyData | undefined} Serializable key material.
   */
  keyData(): KeyData | undefined {
    return this.key()?.data();
  }

  /**
   * Prize currency, falling back to the chain's native symbol.
   *
   * @returns {string} Prize currency, falling back to the chain's native symbol.
   */
  prizeCurrency(): string {
    return this.currency() ?? chainSymbol(this.chain());
  }

  /**
   * Whether the public key is known.
   *
   * @returns {boolean} Whether the public key is known.
   */
  hasPubkey(): boolean {
    return this.pubkey() !== undefined;
  }

  /**
   * Whether any private key representation is known.
   *
   * @returns {boolean} Whether any private key representation is known.
   */
  hasPrivateKey(): boolean {
    return secretOf(this.keyData()) !== undefined;
  }

  /**
   * Whether the private key is known only because the record rebuilt it from a published recipe,
   * not because a source printed it.
   *
   * @returns {boolean} Whether the known private key is derived.
   */
  hasDerivedKey(): boolean {
    return this.keyData()?.derived === true && this.hasPrivateKey();
  }

  /**
   * Fetches the current native token balance of the target address, plus its escrow's when the
   * prize waits in one: that sum is what the key would bring its finder.
   *
   * The `@agntn/explorers` provider for the chain loads on first use, so the
   * package imports without any network code. Dogecoin and Monero have no
   * provider and reject with `UnsupportedChainError`.
   *
   * @param {BalanceOptions} [options] - Lookup options.
   * @returns {Promise<Balance>} The current native token balance of the target address.
   */
  async balance(options: BalanceOptions = {}): Promise<Balance> {
    const { lookupBalance } = await import("./providers.ts");
    return lookupBalance(this, options);
  }

  /**
   * Inclusive key range implied by the declared bit length.
   *
   * @returns {readonly [bigint, bigint] | undefined} Inclusive key range implied by the declared bit length.
   */
  keyRange(): readonly [bigint, bigint] | undefined {
    const bits = this.keyData()?.bits;
    if (bits === undefined || bits < 1 || bits > 256) {
      return undefined;
    }
    const width = BigInt(bits);
    return [1n << (width - 1n), (1n << width) - 1n];
  }

  /**
   * First transaction of a given role.
   *
   * @param {TransactionType} type - Transaction role.
   * @returns {Transaction | undefined} First transaction of a given role.
   */
  transaction(type: TransactionType): Transaction | undefined {
    return this.transactions().find((item) => item.tx_type === type);
  }

  /**
   * First funding transaction.
   *
   * @returns {Transaction | undefined} First funding transaction.
   */
  fundingTransaction(): Transaction | undefined {
    return this.transaction(TransactionType.Funding);
  }

  /**
   * First claim transaction.
   *
   * @returns {Transaction | undefined} First claim transaction.
   */
  claimTransaction(): Transaction | undefined {
    return this.transaction(TransactionType.Claim);
  }

  /**
   * Solve duration rendered with stable calendar approximations.
   *
   * @returns {string | undefined} Solve duration rendered with stable calendar approximations.
   */
  formattedSolveTime(): string | undefined {
    const seconds = this.solveTime();
    if (seconds === undefined) {
      return undefined;
    }
    let remaining = seconds;
    const parts: string[] = [];
    for (const [unit, suffix] of SOLVE_TIME_UNITS) {
      const count = Math.floor(remaining / unit);
      remaining %= unit;
      if (count > 0) {
        parts.push(`${count}${suffix}`);
      }
    }
    return parts.length === 0 ? `${seconds}s` : parts.join(" ");
  }

  /**
   * Path from the repository root of the primary asset.
   *
   * @returns {string | undefined} Path from the repository root of the primary asset.
   */
  assetPath(): string | undefined {
    const file = this.assets()?.puzzle;
    return file === undefined ? undefined : `assets/${this.collection()}/${file}`;
  }

  /**
   * Canonical remote URL of the primary asset.
   *
   * @returns {string | undefined} Canonical remote URL of the primary asset.
   */
  assetUrl(): string | undefined {
    const path = this.assetPath();
    return path === undefined ? undefined : assetUrlOf(path);
  }

  /**
   * Every file the record ships, once each: the puzzle image as `assetPath()` and `assetUrl()`
   * answer it, then the hints, the solution and the stage artifacts, each with its path from the
   * repository root and its canonical remote URL.
   *
   * @returns {readonly AssetLink[]} The files, or an empty list when the record ships none.
   */
  assetLinks(): readonly AssetLink[] {
    const assets = this.assets();
    const digests = assets?.digests;
    const directory = `assets/${this.collection()}`;
    const links =
      assets === undefined
        ? []
        : recordLinks(
            assets,
            directory,
            imageLink(assets.puzzle, this.assetPath(), this.assetUrl(), digests),
          );
    for (const { file } of this.stages().flatMap((item) => item.artifacts)) {
      const link = file === undefined ? undefined : assetLink("artifact", file, directory, digests);
      if (link !== undefined && !links.some((other) => other.path === link.path)) {
        links.push(link);
      }
    }
    return links.length === 0 ? NO_ASSET_LINKS : frozen(links);
  }

  /**
   * Address explorer URL.
   *
   * @returns {string} Address explorer URL.
   */
  explorerUrl(): string {
    return addressExplorerUrl(this.chain(), this.address().value);
  }

  /**
   * Claim transaction explorer URL.
   *
   * @returns {string | undefined} Claim transaction explorer URL.
   */
  claimExplorerUrl(): string | undefined {
    const txid = this.claimTransaction()?.txid;
    return txid === undefined ? undefined : transactionExplorerUrl(this.chain(), txid);
  }

  /**
   * Serializes the puzzle, omitting everything it doesn't have. The record comes back frozen
   * through, so the dataset views built from it stay as written whatever a subclass hands over.
   *
   * @returns {PuzzleData} The serialized record without absent fields.
   */
  toJSON(): PuzzleData {
    const transactions = this.transactions();
    const hints = this.hints();
    const stages = this.stages();
    const techniques = this.techniques();
    const record = defined<PuzzleData>({
      id: this.id(),
      chain: this.chain(),
      address: this.address(),
      escrow: this.escrow(),
      status: this.status(),
      pubkey: this.pubkey(),
      key: this.keyData(),
      prize: this.prize(),
      currency: this.currency(),
      start_date: this.startedAt(),
      solve_date: this.solvedAt(),
      solve_time: this.solveTime(),
      pre_genesis: this.preGenesis() ? true : undefined,
      source_url: this.sourceUrl(),
      transactions: transactions.length === 0 ? undefined : transactions,
      solver: this.solver(),
      assets: this.assets(),
      stages: stages.length === 0 ? undefined : stages,
      hints: hints.length === 0 ? undefined : hints,
      techniques: techniques.length === 0 ? undefined : techniques,
    });
    return frozen(record);
  }
}

/** A puzzle whose target address lives on Bitcoin. */
export abstract class BitcoinPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Bitcoin;
  }
}

/** A puzzle whose target address lives on Bitcoin Cash. */
export abstract class BitcoinCashPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.BitcoinCash;
  }
}

/** A puzzle whose target address lives on Dogecoin. */
export abstract class DogecoinPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Dogecoin;
  }
}

/** A puzzle whose target address lives on eCash. */
export abstract class ECashPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.ECash;
  }
}

/** A puzzle whose target address lives on Ethereum. */
export abstract class EthereumPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Ethereum;
  }
}

/** A puzzle whose target address lives on Base, the Ethereum layer 2. */
export abstract class BasePuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Base;
  }
}

/** A puzzle whose target address lives on Litecoin. */
export abstract class LitecoinPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Litecoin;
  }
}

/** A puzzle whose target address lives on Decred. */
export abstract class DecredPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Decred;
  }
}

/** A puzzle whose target address lives on Arweave. */
export abstract class ArweavePuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Arweave;
  }
}

/** A puzzle whose target address lives on Monero. */
export abstract class MoneroPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Monero;
  }
}

/**
 * Static data record behind a puzzle a factory builds. An absent field means the puzzle doesn't have
 * it, like a missing override on a handwritten subclass. The factory freezes the record through, so
 * every accessor hands back the data as written and no caller can rewrite it for everyone else.
 */
export interface PuzzleSpec {
  readonly address: string | Address;
  readonly assets?: Assets;
  readonly chain: Chain;
  readonly currency?: string;
  readonly escrow?: string | Address;
  readonly hints?: readonly Hint[];
  readonly id: string;
  readonly key?: Readonly<Key>;
  readonly preGenesis?: boolean;
  readonly prize?: number;
  readonly pubkey?: Pubkey;
  readonly solvedAt?: string;
  readonly solveTime?: number;
  readonly solver?: Party;
  readonly sourceUrl: string;
  readonly stages?: readonly Stage[];
  readonly startedAt: string;
  readonly status?: Status;
  readonly techniques?: readonly TechniqueTag[];
  readonly transactions?: readonly Transaction[];
}

/** A spec with its addresses read into records. */
interface ResolvedSpec extends PuzzleSpec {
  readonly address: Address;
  readonly escrow?: Address;
}

function resolved(chain: Chain, value: string | Address): Address {
  return typeof value === "string" ? addressOn(chain, value) : value;
}

class SpecPuzzle extends Puzzle {
  readonly #spec: ResolvedSpec;

  constructor(spec: PuzzleSpec) {
    super();
    const { chain } = spec;
    this.#spec = frozen(
      defined<ResolvedSpec>({
        ...spec,
        address: resolved(chain, spec.address),
        escrow: spec.escrow === undefined ? undefined : resolved(chain, spec.escrow),
      }),
    );
  }

  override id(): string {
    return this.#spec.id;
  }

  override chain(): Chain {
    return this.#spec.chain;
  }

  override address(): Address {
    return this.#spec.address;
  }

  override escrow(): Address | undefined {
    return this.#spec.escrow;
  }

  override sourceUrl(): string {
    return this.#spec.sourceUrl;
  }

  override startedAt(): string {
    return this.#spec.startedAt;
  }

  override status(): Status {
    return this.#spec.status ?? Status.Unsolved;
  }

  override pubkey(): Pubkey | undefined {
    return this.#spec.pubkey;
  }

  override key(): Readonly<Key> | undefined {
    return this.#spec.key;
  }

  override prize(): number | undefined {
    return this.#spec.prize;
  }

  override currency(): string | undefined {
    return this.#spec.currency;
  }

  override solvedAt(): string | undefined {
    return this.#spec.solvedAt;
  }

  override solveTime(): number | undefined {
    return this.#spec.solveTime;
  }

  override preGenesis(): boolean {
    return this.#spec.preGenesis ?? false;
  }

  override transactions(): readonly Transaction[] {
    return this.#spec.transactions ?? NO_TRANSACTIONS;
  }

  override solver(): Party | undefined {
    return this.#spec.solver;
  }

  override assets(): Assets | undefined {
    return this.#spec.assets;
  }

  override stages(): readonly Stage[] {
    return this.#spec.stages ?? NO_STAGES;
  }

  override hints(): readonly Hint[] {
    return this.#spec.hints ?? NO_HINTS;
  }

  override techniques(): readonly TechniqueTag[] {
    return this.#spec.techniques ?? NO_TECHNIQUES;
  }
}

/**
 * Builds a puzzle from its data record, reading a string address on the record's chain.
 *
 * @param {PuzzleSpec} spec - The puzzle's data record.
 * @returns {Puzzle} The puzzle.
 * @throws {TypeError} When an address is not one the chain encodes.
 */
export function puzzle(spec: PuzzleSpec): Puzzle {
  return new SpecPuzzle(spec);
}
