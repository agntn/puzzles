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
