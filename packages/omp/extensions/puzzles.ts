import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { Text, type ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import { registerOmpTools, type OmpRenderers } from "@agntn/tools/omp";

import type * as PuzzlesTools from "../../../src/tools.ts";

const sourceModulePath = fileURLToPath(new URL("../../../src/tools.ts", import.meta.url));

/**
 * Loads the tool definitions, from `src/` in a checkout and `dist/` once installed.
 *
 * @returns {Promise<typeof PuzzlesTools>} The tool definitions.
 */
function loadTools(): Promise<typeof PuzzlesTools> {
  return (
    existsSync(sourceModulePath)
      ? import("../../../src/tools.ts")
      : import("../../../dist/tools.mjs")
  ) as Promise<typeof PuzzlesTools>;
}

/**
 * Registers crypto puzzle and bounty data tools in OMP.
 *
 * @param {ExtensionAPI} pi - The host extension API.
 */
export default async function puzzlesExtension(pi: ExtensionAPI): Promise<void> {
  pi.setLabel("Puzzles");
  const { puzzlesTools, callSummaries } = await loadTools();
  const renderers = Object.fromEntries(
    Object.entries(callSummaries).map(([name, describeCall]): [string, OmpRenderers] => [
      name,
      { describeCall },
    ]),
  );
  /** The adapter takes no `loadMode`, and OMP would make the tools discoverable without one. */
  const host = Object.create(pi, {
    registerTool: {
      value: (tool: Parameters<ExtensionAPI["registerTool"]>[0]) =>
        pi.registerTool({ ...tool, loadMode: "essential" }),
    },
  }) as ExtensionAPI;
  registerOmpTools(host, puzzlesTools, { Text, renderers });
}
