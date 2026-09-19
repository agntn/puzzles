import type { BalanceOptions } from "./balance.ts";
import { PuzzleNotFoundError } from "./errors.ts";
import { frozen, type Hint, type Party } from "./parts.ts";
import { Puzzle, Status } from "./puzzle.ts";
import { type Balance } from "./types.ts";
import { filterPuzzles } from "./utils.ts";
/** A type-only import keeps the verification crypto out of the collection load path. */
import type { VerifyResult } from "./verify.ts";

/**
 * A named set of puzzles. The subclass supplies identity, author, the list and the hints every
 * puzzle in it inherits. Everything a caller does with them is implemented once, here.
 */
export abstract class Collection<Query> {
  /** Collection author. */
  readonly author: Party;

  /** Hints that hold for every puzzle in the collection, ahead of a puzzle's own. */
  readonly hints: readonly Hint[];

  /** Stable collection key used in puzzle identifiers. */
  readonly key: string;

  readonly #byId: ReadonlyMap<string, Puzzle>;
  readonly #puzzles: readonly Puzzle[];

  /** Freezes the author, the hints and the puzzle list, then indexes the list by identifier. */
  constructor(key: string, author: Party, puzzles: readonly Puzzle[], hints: readonly Hint[] = []) {
    this.key = key;
    this.author = frozen(author);
    this.hints = frozen(hints);
    this.#puzzles = Object.freeze([...puzzles]);
    this.#byId = new Map(this.#puzzles.map((puzzle) => [puzzle.id(), puzzle]));
  }

  /** Turns a collection-specific query into a universal puzzle identifier. */
  protected abstract idFor(query: Query): string | undefined;

  /**
   * The identifier a query names, or the query itself for the error a miss will carry.
   *
   * @param {Query} query - Query in the collection's own terms.
   * @returns {string} The universal identifier, or the query spelled out.
   */
  #resolveId(query: Query): string {
    return this.idFor(query) ?? String(query);
  }

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
    return this.requireId(this.#resolveId(query));
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
    return this.verifyById(this.#resolveId(query));
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
   * Every hint that holds for the selected puzzle: the collection's, then the puzzle's own.
   *
   * @param {Query} query - Query in the collection's own terms.
   * @returns {readonly Hint[]} The hints, or an empty list when neither recorded any.
   */
  hintsFor(query: Query): readonly Hint[] {
    return this.hintsById(this.#resolveId(query));
  }

  /**
   * Every hint that holds for a puzzle, through the universal identifier.
   *
   * @param {string} id - Universal puzzle identifier.
   * @returns {readonly Hint[]} The collection's hints, then the puzzle's own.
   */
  hintsById(id: string): readonly Hint[] {
    return frozen([...this.hints, ...this.requireId(id).hints()]);
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

/** The digits of a puzzle number as its identifier spells them: no sign, no leading zero. */
const PUZZLE_NUMBER = /^[1-9]\d*$/;

/**
 * A collection addressed by string names, `decred_janus` or `zden/decred_janus`. A query of
 * another type is a miss, not a `TypeError`.
 */
export class NamedCollection extends Collection<string> {
  protected override idFor(query: string): string | undefined {
    if (typeof query !== "string") {
      return undefined;
    }
    return query.includes("/") ? query : `${this.key}/${query}`;
  }
}

/**
 * A collection addressed by puzzle numbers, `71`, `"71"` or `"b1000/71"`. Only that spelling
 * resolves: `Number()` would read `"0x47"`, `" 71 "` and `"71.0"` as 71 and `"7e1"` as 70.
 */
export class NumericCollection extends Collection<number | string> {
  protected override idFor(query: number | string): string | undefined {
    const number = typeof query === "string" ? this.#numberOf(query) : query;
    return typeof number === "number" && Number.isSafeInteger(number) && number >= 1
      ? `${this.key}/${number}`
      : undefined;
  }

  /**
   * Reads the number off `71` or `b1000/71`, and nothing off any other spelling.
   *
   * @param {string} query - Query in the collection's own terms.
   * @returns {number | undefined} The puzzle number, or `undefined` for any other spelling.
   */
  #numberOf(query: string): number | undefined {
    const prefix = `${this.key}/`;
    const digits = query.startsWith(prefix) ? query.slice(prefix.length) : query;
    return PUZZLE_NUMBER.test(digits) ? Number(digits) : undefined;
  }
}

/** A collection holding one puzzle whose ID equals the collection key. */
export class SingletonCollection extends Collection<void | string> {
  /** Builds a singleton collection and rejects anything that isn't one. */
  constructor(key: string, author: Party, puzzles: readonly Puzzle[], hints?: readonly Hint[]) {
    super(key, author, puzzles, hints);
    const only = this.all()[0];
    if (this.count() !== 1 || only?.id() !== key) {
      throw new TypeError(`Singleton collection ${key} must contain exactly its canonical puzzle`);
    }
  }

  protected override idFor(query: void | string): string | undefined {
    return query === undefined || query === "" || query === this.key ? this.key : undefined;
  }
}
