import type { Puzzle } from "./puzzle.ts";

/**
 * Folds case and word separators, so `Level-5`, `level5` and `level_5` compare equal.
 *
 * @param {string} text - A key or puzzle name as a caller typed it.
 * @returns {string} The folded spelling.
 */
function fold(text: string): string {
  return text.toLowerCase().replaceAll(/[\s_-]+/gu, "");
}

/**
 * Whether two strings differ by at most one insertion, deletion or substitution.
 *
 * @param {string} a - One spelling.
 * @param {string} b - The other.
 * @returns {boolean} `true` when one edit or none turns `a` into `b`.
 */
function oneEditApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) {
    return false;
  }
  let i = 0;
  while (i < a.length && a[i] === b[i]) {
    i += 1;
  }
  return (
    a.slice(i + 1) === b.slice(i + 1) ||
    a.slice(i) === b.slice(i + 1) ||
    a.slice(i + 1) === b.slice(i)
  );
}

/**
 * The one entry a miss most likely meant, or `undefined` when none qualifies or several tie, so a
 * suggestion is never a coin flip.
 *
 * @param {string[]} matches - The entries that qualified.
 * @returns {string | undefined} The single match.
 */
function only(matches: readonly string[]): string | undefined {
  return matches.length === 1 ? matches[0] : undefined;
}

/**
 * The key a mistyped collection or author key most likely meant: the same key in another case or
 * with other separators, or failing that the one key a single typo away.
 *
 * @param {string} query - The key that missed.
 * @param {readonly string[]} keys - The keys that resolve.
 * @returns {string | undefined} The key to suggest, when exactly one fits.
 */
export function closestKey(query: string, keys: readonly string[]): string | undefined {
  const wanted = fold(query);
  if (wanted === "") {
    return undefined;
  }
  return (
    only(keys.filter((key) => fold(key) === wanted)) ??
    only(keys.filter((key) => oneEditApart(fold(key), wanted)))
  );
}

/**
 * The puzzle a mistyped name most likely meant, among puzzles of one or more collections. Only case
 * and separators fold here: names such as `71` and `72` sit one edit apart and are different
 * puzzles, so a typo in a number never becomes a suggestion.
 *
 * @param {string} name - The name segment that missed, `level5` in `zden/level5`.
 * @param {readonly Puzzle[]} puzzles - The puzzles the name could belong to.
 * @returns {string | undefined} The identifier to suggest, when exactly one puzzle fits.
 */
export function closestPuzzle(name: string, puzzles: readonly Puzzle[]): string | undefined {
  const wanted = fold(name);
  if (wanted === "") {
    return undefined;
  }
  return only(
    puzzles
      .map((puzzle) => puzzle.id())
      .filter((id) => {
        const slash = id.indexOf("/");
        return slash !== -1 && fold(id.slice(slash + 1)) === wanted;
      }),
  );
}
