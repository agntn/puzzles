import type { BalanceOptions } from "./balance.ts";
import { PuzzleNotFoundError } from "./errors.ts";
import { type Party } from "./parts.ts";
import { Puzzle, Status } from "./puzzle.ts";
import { type Balance } from "./types.ts";
import { filterPuzzles } from "./utils.ts";
/** A type-only import keeps the verification crypto out of the collection load path. */
import type { VerifyResult } from "./verify.ts";

/**
 * A named set of puzzles. The subclass supplies identity, author and the list. Everything a caller
 * does with them is implemented once, here.
 */
export abstract class Collection<Query> {
  /** Collection author. */
  readonly author: Party;

  /** Stable collection key used in puzzle identifiers. */
  readonly key: string;

  readonly #byId: ReadonlyMap<string, Puzzle>;
  readonly #puzzles: readonly Puzzle[];

  /** Freezes the puzzle list and indexes it by identifier. */
  constructor(key: string, author: Party, puzzles: readonly Puzzle[]) {
    this.key = key;
    this.author = author;
    this.#puzzles = Object.freeze([...puzzles]);
    this.#byId = new Map(this.#puzzles.map((puzzle) => [puzzle.id(), puzzle]));
  }

  /** Turns a collection-specific query into a universal puzzle identifier. */
  protected abstract idFor(query: Query): string | undefined;

  /**
   * Every puzzle, in list order.
   *
   * @returns {readonly Puzzle[]} Every puzzle, in list order.
   */
  all(): readonly Puzzle[] {
    return this.#puzzles;
  }

  /**
   * Looks up a puzzle, returning `undefined` when a miss is expected.
   *
   * @param {Query} query - Query in the collection's own terms.
   * @returns {Puzzle | undefined} The puzzle, or `undefined` when the collection has no such query.
   */
  get(query: Query): Puzzle | undefined {
    const id = this.idFor(query);
    return id === undefined ? undefined : this.#byId.get(id);
  }

  /**
   * Looks up a puzzle or throws.
   *
   * @param {Query} query - Query in the collection's own terms.
   * @returns {Puzzle} The matching puzzle.
   */
  require(query: Query): Puzzle {
    return this.requireId(this.idFor(query) ?? String(query));
  }

  /**
   * Looks up a puzzle by its universal identifier.
   *
   * @param {string} id - Universal puzzle identifier.
   * @returns {Puzzle} The matching puzzle.
   */
  requireId(id: string): Puzzle {
    const puzzle = this.#byId.get(id);
    if (puzzle === undefined) {
      throw new PuzzleNotFoundError(id);
    }
    return puzzle;
  }

  /**
   * Fetches the selected puzzle's current native token balance.
   *
   * @param {Query} query - Query in the collection's own terms.
   * @param {BalanceOptions} [options] - Lookup options.
   * @returns {Promise<Balance>} The selected puzzle's current native token balance.
   */
  async balance(query: Query, options: BalanceOptions = {}): Promise<Balance> {
    return this.require(query).balance(options);
  }

  /**
   * Fetches a balance through the universal identifier.
   *
   * @param {string} id - Universal puzzle identifier.
   * @param {BalanceOptions} [options] - Lookup options.
   * @returns {Promise<Balance>} The on-chain balance of the puzzle address.
   */
  async balanceById(id: string, options: BalanceOptions = {}): Promise<Balance> {
    return this.requireId(id).balance(options);
  }

  /**
   * Checks the selected puzzle's known key material against its address.
   *
   * @param {Query} query - Query in the collection's own terms.
   * @returns {Promise<VerifyResult>} The verification outcome.
   */
  async verify(query: Query): Promise<VerifyResult> {
    return this.verifyById(this.idFor(query) ?? String(query));
  }

  /**
   * Checks key material through the universal identifier, loading the crypto on first use.
   *
   * @param {string} id - Universal puzzle identifier.
   * @returns {Promise<VerifyResult>} The verification outcome.
   */
  async verifyById(id: string): Promise<VerifyResult> {
    const puzzle = this.requireId(id);
    const { verifyPuzzle } = await import("./verify.ts");
    return verifyPuzzle(puzzle);
  }

  /**
   * Solved puzzles.
   *
   * @returns {readonly Puzzle[]} Solved puzzles.
   */
  solved(): readonly Puzzle[] {
    return filterPuzzles(this.#puzzles, { status: Status.Solved });
  }

  /**
   * Puzzles still open.
   *
   * @returns {readonly Puzzle[]} Puzzles still open.
   */
  unsolved(): readonly Puzzle[] {
    return filterPuzzles(this.#puzzles, { status: Status.Unsolved });
  }

  /**
   * Puzzles whose public key is known.
   *
   * @returns {readonly Puzzle[]} Puzzles whose public key is known.
   */
  withPubkey(): readonly Puzzle[] {
    return filterPuzzles(this.#puzzles, { withPubkey: true });
  }

  /**
   * How many puzzles the collection holds.
   *
   * @returns {number} How many puzzles the collection holds.
   */
  count(): number {
    return this.#puzzles.length;
  }

  /**
   * How many are solved.
   *
   * @returns {number} How many are solved.
   */
  solvedCount(): number {
    return this.solved().length;
  }

  /**
   * How many are still open.
   *
   * @returns {number} How many are still open.
   */
  unsolvedCount(): number {
    return this.unsolved().length;
  }
}

/** A collection addressed by string names. */
export class NamedCollection extends Collection<string> {
  protected override idFor(query: string): string {
    return query.includes("/") ? query : `${this.key}/${query}`;
  }
}

/** A collection addressed by puzzle numbers. */
export class NumericCollection extends Collection<number | string> {
  protected override idFor(query: number | string): string | undefined {
    const number = typeof query === "number" ? query : Number(query.replace(`${this.key}/`, ""));
    return Number.isSafeInteger(number) && number >= 1 ? `${this.key}/${number}` : undefined;
  }
}

/** A collection holding one puzzle whose ID equals the collection key. */
export class SingletonCollection extends Collection<void | string> {
  /** Builds a singleton collection and rejects anything that isn't one. */
  constructor(key: string, author: Party, puzzles: readonly Puzzle[]) {
    super(key, author, puzzles);
    const only = this.all()[0];
    if (this.count() !== 1 || only?.id() !== key) {
      throw new TypeError(`Singleton collection ${key} must contain exactly its canonical puzzle`);
    }
  }

  protected override idFor(query: void | string): string | undefined {
    return query === undefined || query === "" || query === this.key ? this.key : undefined;
  }
}
