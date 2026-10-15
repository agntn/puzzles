import { InvalidArgumentError } from "./errors.ts";

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

/**
 * Parses a puzzle status filter, throwing on an unknown value.
 *
 * @param {string | undefined} value - Status text from the command line, when given.
 * @returns {Status | undefined} The puzzle status filter, or `undefined` when none was given.
 */
export function parseStatus(value: string | undefined): Status | undefined {
  const status = Object.values(Status).find((item) => item === value);
  if (status === undefined && value !== undefined) {
    throw new InvalidArgumentError("status", `expected one of ${Object.values(Status).join(", ")}`);
  }
  return status;
}
