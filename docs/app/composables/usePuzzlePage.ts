import * as library from "@agntn/puzzles";
import { showTool } from "@agntn/puzzles/tools";
import { toPuzzleView, type PuzzleView } from "../utils/puzzle-view";

export interface PuzzlePageData {
  readonly view: PuzzleView;
  readonly previous: string | undefined;
  readonly next: string | undefined;
  readonly position: number;
  readonly total: number;
}

/**
 * The record behind one puzzle page. The page head and the `PuzzlePage` body share this key, so
 * Nuxt resolves the record once and stores one payload entry.
 *
 * @param {() => string} id - Reads the puzzle identifier, again whenever the key changes.
 * @returns {ReturnType<typeof useAsyncData<PuzzlePageData | null>>} The view with its neighbours, or `null` for an unknown identifier.
 */
export function usePuzzlePage(id: () => string) {
  return useAsyncData<PuzzlePageData | null>(
    () => `puzzle-page-${id()}`,
    async () => {
      const current = id();
      const puzzle = await library.get(current);
      if (puzzle === undefined) return null;
      const tool = (await showTool(current)).content[0]?.text ?? "";
      const siblings = (await library.requireCollection(puzzle.collection()))
        .all()
        .map((row) => row.id());
      const position = siblings.indexOf(current);
      return {
        view: toPuzzleView(library, puzzle, tool),
        previous: siblings[position - 1],
        next: siblings[position + 1],
        position: position + 1,
        total: siblings.length,
      };
    },
  );
}
