/** Base error for puzzle data access. */
export class PuzzlesError extends Error {
  override readonly name: string = "PuzzlesError";
}

/** Raised when a puzzle identifier can't be resolved. */
export class PuzzleNotFoundError extends PuzzlesError {
  override readonly name = "PuzzleNotFoundError";

  /** The unresolved puzzle identifier. */
  readonly puzzleId: string;

  /** Constructs a not found error for a puzzle identifier. */
  constructor(puzzleId: string) {
    super(`Puzzle not found: ${puzzleId}`);
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

/** Raised when a collection name can't be resolved. */
export class UnknownCollectionError extends PuzzlesError {
  override readonly name = "UnknownCollectionError";

  /** The unresolved collection name. */
  readonly collection: string;

  /** Constructs an unknown collection error. */
  constructor(collection: string) {
    super(`Unknown collection: ${collection}`);
    this.collection = collection;
  }
}
