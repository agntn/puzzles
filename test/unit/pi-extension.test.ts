import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { describe, expect, it } from "vitest";
import puzzlesExtension from "../../packages/pi/extensions/puzzles.ts";
import { facts } from "../../src/tool-operations.ts";

interface RegisteredTool {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly parameters: unknown;
  readonly execute: (
    toolCallId: string,
    params: Readonly<Record<string, unknown>>,
  ) => Promise<{
    readonly content: readonly { readonly type: string; readonly text: string }[];
    readonly details: Readonly<Record<string, unknown>>;
  }>;
}

async function registerTools(): Promise<Map<string, RegisteredTool>> {
  const tools = new Map<string, RegisteredTool>();
  const pi = {
    registerTool(tool: RegisteredTool) {
      tools.set(tool.name, tool);
    },
  } as unknown as ExtensionAPI;
  await puzzlesExtension(pi);
  return tools;
}

const toolNames = Object.values(facts.tools)
  .map((tool) => tool.name)
  .sort();

describe("Pi extension", () => {
  it("registers every puzzle tool", async () => {
    expect([...(await registerTools()).keys()].sort()).toEqual(toolNames);
  });

  it("executes the show tool against the library", async () => {
    const tool = (await registerTools()).get("puzzles_show");
    const result = await tool?.execute("call-1", { id: "gsmg" });

    expect(result?.content[0]?.text).toContain("1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe");
  });

  it("hands the joined hint list and the hint files to the harness as details", async () => {
    const tool = (await registerTools()).get("puzzles_hints");
    const result = await tool?.execute("call-3", { id: "warp/warp_challenge_2" });
    const image = await tool?.execute("call-4", { id: "gsmg" });

    expect(result?.content[0]?.text).toContain("warp/warp_challenge_2: 1 hint");
    expect(result?.details).toMatchObject({ id: "warp/warp_challenge_2", hintAssets: [] });
    expect(result?.details["hints"]).toHaveLength(1);
    expect(image?.details).toMatchObject({
      hints: [],
      hintAssets: [{ kind: "hint", path: "assets/gsmg/follow_the_white_rabbit.png" }],
    });
  });

  it("executes the list tool with filters", async () => {
    const tool = (await registerTools()).get("puzzles_list");
    const result = await tool?.execute("call-2", { collection: "warp", limit: 2 });

    expect(result?.content[0]?.text).toMatch(/matching puzzles:/);
  });

  it("lists collections through the shared executor", async () => {
    const tool = (await registerTools()).get("puzzles_collections");
    const result = await tool?.execute("call-3", {});

    expect(result?.content[0]?.text).toContain("gsmg: 1 puzzles, 0 solved, 1 unsolved, by GSMG.io");
  });
});
