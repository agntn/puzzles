import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { registerPiTools } from "@agntn/tools/pi";

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
 * Registers crypto puzzle and bounty data tools in Pi.
 *
 * @param {ExtensionAPI} pi - The host extension API.
 */
export default async function puzzlesExtension(pi: ExtensionAPI): Promise<void> {
  registerPiTools(pi, (await loadTools()).puzzlesTools);
}
