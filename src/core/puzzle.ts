import type { BalanceOptions } from "./balance.ts";
import { addressExplorerUrl, Chain, chainSymbol, transactionExplorerUrl } from "./chains.ts";
import type { Balance } from "./types.ts";
import {
  type Address,
  type Assets,
  defined,
  frozen,
  type Key,
  type KeyData,
  type Party,
  type Pubkey,
  secretOf,
  type Transaction,
  TransactionType,
} from "./parts.ts";

/** Puzzle lifecycle states. */
export const Status = {
  Claimed: "claimed",
  Expired: "expired",
  Solved: "solved",
  Swept: "swept",
  Unsolved: "unsolved",
} as const;

/** A puzzle lifecycle state. */
export type Status = (typeof Status)[keyof typeof Status];

/** Serialized puzzle record. Absent fields are omitted, never null. */
export interface PuzzleData {
  readonly address: Address;
  readonly assets?: Assets;
  readonly chain: Chain;
  readonly currency?: string;
  readonly id: string;
  readonly key?: KeyData;
  readonly pre_genesis?: boolean;
  readonly prize?: number;
  readonly pubkey?: Pubkey;
  readonly solve_date?: string;
  readonly solve_time?: number;
  readonly solver?: Party;
  readonly source_url: string;
  readonly start_date: string;
  readonly status: Status;
  readonly transactions?: readonly Transaction[];
}

/** The transaction list of a puzzle that recorded none, frozen like every other part. */
const NO_TRANSACTIONS: readonly Transaction[] = Object.freeze([]);

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
   * Fetches the current native token balance of the target address.
   *
   * The `@agntn/explorers` provider for the chain loads on first use, so the
   * package imports without any network code. Monero has no provider and
   * rejects with `UnsupportedChainError`.
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
    const path = this.assets()?.puzzle;
    return path === undefined ? undefined : `assets/${this.collection()}/${path}`;
  }

  /**
   * Canonical remote URL of the primary asset.
   *
   * @returns {string | undefined} Canonical remote URL of the primary asset.
   */
  assetUrl(): string | undefined {
    const path = this.assetPath();
    return path === undefined
      ? undefined
      : `https://raw.githubusercontent.com/agntn/puzzles/main/${path}`;
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
   * Serializes the puzzle, omitting everything it doesn't have. The record comes back frozen, and
   * the parts in it are frozen by the factory, so the dataset views built from it stay as written.
   *
   * @returns {PuzzleData} The serialized record without absent fields.
   */
  toJSON(): PuzzleData {
    const transactions = this.transactions();
    const record = defined<PuzzleData>({
      id: this.id(),
      chain: this.chain(),
      address: this.address(),
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
    });
    return Object.freeze(record);
  }
}

/** A puzzle whose target address lives on Bitcoin. */
export abstract class BitcoinPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Bitcoin;
  }
}

/** A puzzle whose target address lives on Ethereum. */
export abstract class EthereumPuzzle extends Puzzle {
  override chain(): Chain {
    return Chain.Ethereum;
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
  readonly address: Address;
  readonly assets?: Assets;
  readonly currency?: string;
  readonly id: string;
  readonly key?: Readonly<Key>;
  readonly preGenesis?: boolean;
  readonly prize?: number;
  readonly pubkey?: Pubkey;
  readonly solvedAt?: string;
  readonly solveTime?: number;
  readonly solver?: Party;
  readonly sourceUrl: string;
  readonly startedAt: string;
  readonly status?: Status;
  readonly transactions?: readonly Transaction[];
}

class SpecPuzzle extends Puzzle {
  readonly #chain: Chain;
  readonly #spec: PuzzleSpec;

  constructor(chain: Chain, spec: PuzzleSpec) {
    super();
    this.#chain = chain;
    this.#spec = frozen(spec);
  }

  override id(): string {
    return this.#spec.id;
  }

  override chain(): Chain {
    return this.#chain;
  }

  override address(): Address {
    return this.#spec.address;
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
}

/**
 * Builds a Bitcoin puzzle from its data record.
 *
 * @param {PuzzleSpec} spec - The puzzle's data record.
 * @returns {Puzzle} The Bitcoin puzzle.
 */
export function bitcoinPuzzle(spec: PuzzleSpec): Puzzle {
  return new SpecPuzzle(Chain.Bitcoin, spec);
}

/**
 * Builds an Ethereum puzzle from its data record.
 *
 * @param {PuzzleSpec} spec - The puzzle's data record.
 * @returns {Puzzle} The Ethereum puzzle.
 */
export function ethereumPuzzle(spec: PuzzleSpec): Puzzle {
  return new SpecPuzzle(Chain.Ethereum, spec);
}

/**
 * Builds a Litecoin puzzle from its data record.
 *
 * @param {PuzzleSpec} spec - The puzzle's data record.
 * @returns {Puzzle} The Litecoin puzzle.
 */
export function litecoinPuzzle(spec: PuzzleSpec): Puzzle {
  return new SpecPuzzle(Chain.Litecoin, spec);
}

/**
 * Builds a Decred puzzle from its data record.
 *
 * @param {PuzzleSpec} spec - The puzzle's data record.
 * @returns {Puzzle} The Decred puzzle.
 */
export function decredPuzzle(spec: PuzzleSpec): Puzzle {
  return new SpecPuzzle(Chain.Decred, spec);
}

/**
 * Builds an Arweave puzzle from its data record.
 *
 * @param {PuzzleSpec} spec - The puzzle's data record.
 * @returns {Puzzle} The Arweave puzzle.
 */
export function arweavePuzzle(spec: PuzzleSpec): Puzzle {
  return new SpecPuzzle(Chain.Arweave, spec);
}

/**
 * Builds a Monero puzzle from its data record.
 *
 * @param {PuzzleSpec} spec - The puzzle's data record.
 * @returns {Puzzle} The Monero puzzle.
 */
export function moneroPuzzle(spec: PuzzleSpec): Puzzle {
  return new SpecPuzzle(Chain.Monero, spec);
}
