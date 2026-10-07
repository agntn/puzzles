import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { Text, type ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import { registerOmpTools, type OmpRenderers } from "@agntn/tools/omp";

import type * as PuzzlesTools from "../../../src/tools.ts";

const sourceModulePath = fileURLToPath(new URL("../../../src/tools.ts", import.meta.url));

/**
 * Loads the tools: `src/` and its commit in a checkout, `dist/` once installed.
 *
 * @returns {Promise<typeof PuzzlesTools>} The tool definitions.
 */
async function loadTools(): Promise<typeof PuzzlesTools> {
  if (!existsSync(sourceModulePath)) {
    return import("../../../dist/tools.mjs") as Promise<typeof PuzzlesTools>;
  }
  const { useCheckoutAssets } = await import("../../../src/checkout.ts");
  useCheckoutAssets(fileURLToPath(new URL("../../../", import.meta.url)));
  return import("../../../src/tools.ts");
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
  registerOmpTools(pi, puzzlesTools, { Text, renderers, loadMode: "essential" });
}
