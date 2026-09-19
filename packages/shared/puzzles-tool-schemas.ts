import { Type } from "typebox";

/**
 * Parameter schemas for the puzzles tools, built from the `facts` table in
 * `src/tool-operations.ts`. Pi and the MCP server share them. OMP rebuilds its own from the host
 * TypeBox build, because that's what it validates with. The facts are passed in, not imported,
 * because this file ships to npm and `src/` doesn't.
 */

interface Described {
  readonly description: string;
  /** TypeBox option types carry index signatures, so the facts have to satisfy them too. */
  readonly [option: string]: unknown;
  readonly [option: symbol]: unknown;
}

interface TextLimits extends Described {
  readonly minLength?: number;
  readonly maxLength?: number;
}

interface IntegerLimits extends Described {
  readonly minimum: number;
  readonly maximum: number;
}

/** The slice of `facts` the schemas read: parameter constraints and the status list. */
export interface PuzzleToolFacts {
  readonly parameters: {
    readonly apiKey: TextLimits;
    readonly collection: TextLimits;
    readonly id: TextLimits;
    readonly limit: IntegerLimits;
    readonly status: Described;
    readonly withPubkey: Described;
  };
  readonly statuses: readonly string[];
}

/** One parameter schema per puzzles tool, keyed by the tool's short name. */
export type PuzzleToolSchemas = ReturnType<typeof puzzleToolSchemas>;

/**
 * Builds the parameter schema of every puzzles tool.
 *
 * @param {PuzzleToolFacts} facts - The facts table every tool surface shares.
 * @returns {PuzzleToolSchemas} TypeBox schemas that mirror the executors' limits.
 */
export function puzzleToolSchemas(facts: PuzzleToolFacts) {
  const { parameters, statuses } = facts;
  const puzzleId = Type.String(parameters.id);
  return {
    stats: Type.Object({}),
    collections: Type.Object({}),
    show: Type.Object({ id: puzzleId }),
    hints: Type.Object({ id: puzzleId }),
    list: Type.Object({
      collection: Type.Optional(Type.String(parameters.collection)),
      status: Type.Optional(
        Type.Union(
          statuses.map((status) => Type.Literal(status)),
          parameters.status,
        ),
      ),
      withPubkey: Type.Optional(Type.Boolean(parameters.withPubkey)),
      limit: Type.Optional(Type.Integer(parameters.limit)),
    }),
    verify: Type.Object({ id: puzzleId }),
    balance: Type.Object({
      id: puzzleId,
      apiKey: Type.Optional(Type.String(parameters.apiKey)),
    }),
  };
}
