import { generateText, isStepCount } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vite-plus/test";
import { publicPuzzlesAiTools, puzzlesAiTools } from "../../src/ai.ts";
import { callTool } from "../../src/mcp.ts";
import { publicPuzzlesTools, puzzlesTools } from "../../src/tools.ts";
import { firstText } from "../support/mcp.ts";

const usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 1, text: 1, reasoning: undefined },
};

/* A model that calls one tool, then reads its answer and stops. */
function scriptedModel(toolName: string, input: Readonly<Record<string, unknown>>) {
  return new MockLanguageModelV4({
    doGenerate: [
      {
        content: [
          { type: "tool-call", toolCallId: "call-0", toolName, input: JSON.stringify(input) },
        ],
        finishReason: { unified: "tool-calls", raw: undefined },
        usage,
        warnings: [],
      },
      {
        content: [{ type: "text", text: "done" }],
        finishReason: { unified: "stop", raw: undefined },
        usage,
        warnings: [],
      },
    ],
  });
}

/* One call through `generateText`: the tool's step part and what the model read back. */
async function callThroughModel(
  set: "local" | "public",
  toolName: string,
  input: Readonly<Record<string, unknown>>,
): Promise<{ part: unknown; reply: unknown }> {
  const model = scriptedModel(toolName, input);
  const result = await generateText({
    model,
    tools: set === "public" ? publicPuzzlesAiTools : puzzlesAiTools,
    stopWhen: isStepCount(2),
    prompt: "what is in gsmg?",
  });
  const reply = (model.doGenerateCalls[1]?.prompt ?? [])
    .flatMap((message) => (message.role === "tool" ? message.content : []))
    .find((part) => part.type === "tool-result")?.output;
  return { part: result.steps[0]?.content[1], reply };
}

describe("@agntn/puzzles/ai", () => {
  it("keys every tool by the name MCP, Pi and OMP use", () => {
    expect(Object.keys(puzzlesAiTools)).toEqual(puzzlesTools.map((tool) => tool.name));
    expect(Object.keys(publicPuzzlesAiTools)).toEqual(publicPuzzlesTools.map((tool) => tool.name));
    expect(Object.keys(publicPuzzlesAiTools)).toContain("puzzles_mentions");
    expect(Object.keys(puzzlesAiTools)).not.toContain("puzzles_mentions");
  });

  it("gives the model the text the MCP server answers with", async () => {
    const { part, reply } = await callThroughModel("local", "puzzles_show", {
      id: "gsmg",
    });
    const mcp = firstText(await callTool("puzzles_show", { id: "gsmg" }));

    expect(part).toMatchObject({ type: "tool-result", output: { text: mcp } });
    expect(reply).toEqual({ type: "text", value: mcp });
  });

  it("hands the model an image from puzzles_assets as a file, not as base64 text", async () => {
    const png = readFileSync("assets/gsmg/puzzle.png");
    vi.stubGlobal("fetch", async (input: unknown) =>
      String(input) === "https://gsmg.io/puzzle"
        ? new Response(png)
        : new Response(null, { status: 404 }),
    );

    const { reply } = await callThroughModel("local", "puzzles_assets", {
      id: "gsmg",
      file: "assets/gsmg/puzzle.png",
    });

    expect(reply).toMatchObject({
      type: "content",
      value: [
        { type: "text", text: expect.stringMatching(/^assets\/gsmg\/puzzle\.png\t/u) as unknown },
        {
          type: "file",
          mediaType: "image/png",
          data: { type: "data", data: png.toString("base64") },
        },
      ],
    });
  });

  it("holds the public puzzles_verify to one id", async () => {
    const { part } = await callThroughModel("public", "puzzles_verify", {
      collection: "bits",
    });

    expect(part).toMatchObject({ type: "tool-error" });
    expect(String((part as { error: unknown }).error)).toContain(
      'unknown property "collection"; takes id',
    );
  });
});
