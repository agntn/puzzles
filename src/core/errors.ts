/** Base error for puzzle data access. */
export class PuzzlesError extends Error {
  override readonly name: string = "PuzzlesError";
}

/**
 * Appends what a lookup knows about the miss, so the message ends in a full stop either way.
 *
 * @param {string} message - The miss itself.
 * @param {string | undefined} detail - What does exist, when the caller knows.
 * @returns {string} The message, with the detail behind it.
 */
function withDetail(message: string, detail: string | undefined): string {
  return detail === undefined ? message : `${message}. ${detail}`;
}

/**
 * Echoes the key a lookup missed. A plain key reads as is; an empty one, or one with whitespace at
 * either end, is quoted, because otherwise it vanishes into the sentence and `Unknown collection: .`
 * reads as a collection named `.`.
 *
 * @param {string} key - The key the caller passed.
 * @returns {string} The key, quoted when bare text would hide it.
 */
function echo(key: string): string {
  return key === "" || key.trim() !== key ? JSON.stringify(key) : key;
}

/** Raised when a puzzle identifier can't be resolved. */
export class PuzzleNotFoundError extends PuzzlesError {
  override readonly name = "PuzzleNotFoundError";

  /** The unresolved puzzle identifier. */
  readonly puzzleId: string;

  /**
   * Constructs a not found error for a puzzle identifier. The optional detail says what the
   * caller could have asked for instead, so a miss does not cost a second lookup.
   */
  constructor(puzzleId: string, detail?: string) {
    super(withDetail(`Puzzle not found: ${echo(puzzleId)}`, detail));
    this.puzzleId = puzzleId;
  }
}

/** Raised when a caller supplied argument breaks the contract every surface shares. */
export class InvalidArgumentError extends PuzzlesError {
  override readonly name = "InvalidArgumentError";

  /** The argument that failed. */
  readonly argument: string;

  /** Constructs an invalid argument error. */
  constructor(argument: string, reason: string) {
    super(`Invalid ${argument}: ${reason}`);
    this.argument = argument;
  }
}

/** Raised when an author key can't be resolved. */
export class UnknownAuthorError extends PuzzlesError {
  override readonly name = "UnknownAuthorError";

  /** The unresolved author key. */
  readonly author: string;

  /** Constructs an unknown author error, with the keys that do resolve when known. */
  constructor(author: string, detail?: string) {
    super(withDetail(`Unknown author: ${echo(author)}`, detail));
    this.author = author;
  }
}

/** Raised when a solver key can't be resolved. */
export class UnknownSolverError extends PuzzlesError {
  override readonly name = "UnknownSolverError";

  /** The unresolved solver key. */
  readonly solver: string;

  /** Constructs an unknown solver error, with the keys that do resolve when known. */
  constructor(solver: string, detail?: string) {
    super(withDetail(`Unknown solver: ${echo(solver)}`, detail));
    this.solver = solver;
  }
}

/** Raised when a collection name can't be resolved. */
export class UnknownCollectionError extends PuzzlesError {
  override readonly name = "UnknownCollectionError";

  /** The unresolved collection name. */
  readonly collection: string;

  /** Constructs an unknown collection error, with the keys that do resolve when known. */
  constructor(collection: string, detail?: string) {
    super(withDetail(`Unknown collection: ${echo(collection)}`, detail));
    this.collection = collection;
  }
}
