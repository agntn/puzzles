/**
 * The story file of one puzzle, `stories/<collection>/<name>.md`, or `null` when it has none.
 *
 * @param {() => string} id - Reads the puzzle identifier, again whenever the key changes.
 * @returns {ReturnType<typeof useAsyncData>} The parsed story page.
 */
export function usePuzzleStory(id: () => string) {
  return useAsyncData(
    () => `puzzle-story-${id()}`,
    () => queryCollection("stories").path(`/${id()}`).first(),
  );
}
