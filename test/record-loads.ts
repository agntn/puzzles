import { writeFileSync } from "node:fs";
import { registerHooks } from "node:module";

/** One module Node loaded, with its source when it sits under the recorded root. */
export interface LoadedModule {
  readonly source: string | undefined;
  readonly url: string;
}

/**
 * Every module Node loads after this file evaluates. `source` is kept only under the prefix given
 * to `recordSourcesUnder`, so a test can match a module by what it declares, not by a chunk name.
 */
export const loaded: LoadedModule[] = [];
let sourceRoot: string | undefined;

/**
 * Keeps module sources for URLs under `urlPrefix`.
 *
 * @param {string} urlPrefix - `file://` URL of the directory whose modules matter.
 */
export function recordSourcesUnder(urlPrefix: string): void {
  sourceRoot = urlPrefix;
}

function text(source: unknown): string | undefined {
  if (typeof source === "string") {
    return source;
  }
  if (source instanceof ArrayBuffer || ArrayBuffer.isView(source)) {
    return new TextDecoder().decode(source);
  }
  return undefined;
}

registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    const source =
      sourceRoot !== undefined && url.startsWith(sourceRoot) ? text(result.source) : undefined;
    loaded.push({ url, source });
    return result;
  },
});

/*
 * `PUZZLES_REPORT_LOADS` names the file that receives every loaded URL as a JSON array on exit.
 * A file, not stderr: a write in an `exit` handler keeps only what fits the pipe's buffer, and the
 * list grows with the checkout path and the dependency count.
 */
const report = process.env["PUZZLES_REPORT_LOADS"];
if (report !== undefined) {
  process.on("exit", () => {
    writeFileSync(report, JSON.stringify(loaded.map((module) => module.url)));
  });
}
