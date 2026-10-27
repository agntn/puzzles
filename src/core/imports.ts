/**
 * Lazy imports that never overlap. Pi runs the extension under jiti with the module cache off, so
 * each importer evaluates a module again, and two imports in flight at once re-enter what they
 * share: the later one reads a half-built namespace. One queue and one load per module rule it out.
 */

/** The import in front of the next one; a failed import doesn't hold up the line. */
let last: Promise<unknown> = Promise.resolve();

/**
 * Starts an import only after every import queued before it has settled.
 *
 * @param {() => Promise<T>} load - The import.
 * @returns {Promise<T>} What the import resolves to.
 */
export function inLine<T>(load: () => Promise<T>): Promise<T> {
  const next = last.then(load);
  last = next.catch(() => undefined);
  return next;
}

/**
 * One queued load of a module shared by every caller, forgotten on failure so a later call retries.
 *
 * @param {() => Promise<T>} load - The import.
 * @returns {() => Promise<T>} The shared load.
 */
export function once<T>(load: () => Promise<T>): () => Promise<T> {
  let module: Promise<T> | undefined;
  return () => {
    if (module === undefined) {
      const loading = inLine(load);
      module = loading;
      loading.catch(() => {
        if (module === loading) {
          module = undefined;
        }
      });
    }
    return module;
  };
}
