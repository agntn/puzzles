import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { createJiti } from "jiti/static";
import { describe, expect, it } from "vite-plus/test";
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

  it("advertises and executes list pagination", async () => {
    const tool = (await registerTools()).get("puzzles_list");
    const result = await tool?.execute("call-2", { collection: "b1000", offset: 1, limit: 1 });

    expect(tool?.parameters).toMatchObject({ properties: { offset: facts.parameters.offset } });
    expect(tool?.description).toBe(facts.tools.list.description);
    expect(result?.content[0]?.text.split("\n")).toEqual([
      "1 of 256 matching puzzles (offset 1):",
      "b1000/2\tsolved\t0.002 BTC\t1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb",
      "Next page: offset=2. Keep the same filters.",
    ]);
    expect(result?.details).toEqual({
      matched: 256,
      returned: 1,
      offset: 1,
      nextOffset: 2,
      ids: ["b1000/2"],
    });
  });

  it("shows an author through the shared executor with the entry as details", async () => {
    const tool = (await registerTools()).get("puzzles_author");
    const result = await tool?.execute("call-4", { key: "dug" });

    expect(result?.content[0]?.text.split("\n")[0]).toBe("dug\tDug\tperson");
    expect(result?.details).toMatchObject({
      author: { key: "dug", collections: ["dug"], puzzles: 3 },
    });
  });

  it("lists collections through the shared executor", async () => {
    const tool = (await registerTools()).get("puzzles_collections");
    const result = await tool?.execute("call-3", {});

    expect(result?.content[0]?.text).toContain("gsmg: 1 puzzles, 0 solved, 1 unsolved, by GSMG.io");
  });
});

/**
 * Registers the tools the way the Pi host does: through jiti, with the module cache off, so every
 * module is evaluated once per importer. Two imports of a shared module that overlap re-enter it
 * there, and the second importer reads a half-initialized namespace.
 *
 * @returns {Promise<Map<string, RegisteredTool>>} The tools the extension registered.
 */
async function registerThroughHostLoader(): Promise<Map<string, RegisteredTool>> {
  const jiti = createJiti(import.meta.url, { moduleCache: false });
  const extension = (await jiti.import(
    fileURLToPath(new URL("../../packages/pi/extensions/puzzles.ts", import.meta.url)),
    { default: true },
  )) as typeof puzzlesExtension;
  const tools = new Map<string, RegisteredTool>();
  await extension({
    registerTool(tool: RegisteredTool) {
      tools.set(tool.name, tool);
    },
  } as unknown as ExtensionAPI);
  return tools;
}

describe("Pi host loader", () => {
  it("answers every tool with the dataset the in-process run sees", async () => {
    const hosted = await registerThroughHostLoader();
    const direct = await registerTools();
    expect([...hosted.keys()].sort()).toEqual(toolNames);

    for (const [name, params] of [
      ["puzzles_collections", {}],
      ["puzzles_stats", {}],
      ["puzzles_show", { id: "gsmg" }],
      ["puzzles_hints", { id: "gsmg" }],
      ["puzzles_list", { collection: "b1000", limit: 1 }],
    ] as const) {
      const result = await hosted.get(name)?.execute("call-1", params);
      expect(result?.content[0]?.text, name).toEqual(
        (await direct.get(name)?.execute("call-1", params))?.content[0]?.text,
      );
    }
  }, 30_000);
});
