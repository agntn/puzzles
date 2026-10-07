import * as library from "@agntn/puzzles";
import { showTool } from "@agntn/puzzles/tools";
import { toFileRows, toPuzzleView, type FileRow, type PuzzleView } from "../utils/puzzle-view";

export interface PuzzlePageData {
  readonly view: PuzzleView;
  /** Every file `puzzles_assets` would hand a model, so a reader gets the same shelf. */
  readonly files: readonly FileRow[];
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
      const collection = await library.requireCollection(puzzle.collection());
      const [{ citedArchivedSources }, { puzzleFiles }] = await Promise.all([
        import("../../../src/core/archived-sources.ts"),
        import("../../../src/core/files.ts"),
      ]);
      const files = puzzleFiles(puzzle.assetLinks(), citedArchivedSources(puzzle, collection));
      const siblings = collection.all().map((row) => row.id());
      const position = siblings.indexOf(current);
      return {
        view: await toPuzzleView(library, puzzle, tool, collection.hints, collection.techniques),
        files: toFileRows(puzzle, files),
        previous: siblings[position - 1],
        next: siblings[position + 1],
        position: position + 1,
        total: siblings.length,
      };
    },
  );
}
