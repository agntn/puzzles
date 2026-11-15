/** Vercel AI SDK tools over the same definitions MCP, Pi, OMP and the CLI read. */

import { toAiTools, type AiTools } from "@agntn/tools/ai";
import { publicPuzzlesTools, puzzlesTools } from "./tools.ts";

/** Every puzzle tool under its MCP name. The dataset waits for the first call. */
export const puzzlesAiTools: AiTools<typeof puzzlesTools> = toAiTools(puzzlesTools);

/** The puzzles.agntn.dev set: `puzzles_verify` held to one id, plus `puzzles_mentions`. */
export const publicPuzzlesAiTools: AiTools<typeof publicPuzzlesTools> =
  toAiTools(publicPuzzlesTools);
