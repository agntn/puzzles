import { fileURLToPath } from "node:url";
import { ToolInputError } from "@agntn/tools";
import { createJiti } from "jiti/static";
import { describe, expect, it } from "vite-plus/test";
import { facts } from "../../src/tool-operations.ts";
import { puzzlesTools } from "../../src/tools.ts";

/** The OMP package root is TypeScript for Bun; the extension takes only `Text` from it. */
const puzzlesExtension = await createJiti(import.meta.url, {
  alias: {
    "@oh-my-pi/pi-coding-agent": fileURLToPath(new URL("../support/omp-host.ts", import.meta.url)),
  },
}).import<(pi: never) => Promise<void>>(
  fileURLToPath(new URL("../../packages/omp/extensions/puzzles.ts", import.meta.url)),
  { default: true },
);

interface RegisteredTool {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly approval: string;
  readonly loadMode?: string;
  readonly parameters: unknown;
  readonly renderCall?: (
    args: Readonly<Record<string, unknown>>,
    options: unknown,
    theme: unknown,
  ) => { readonly text: string };
  readonly execute: (
    toolCallId: string,
    params: Readonly<Record<string, unknown>>,
  ) => Promise<{
    readonly content: readonly { readonly type: string; readonly text: string }[];
    readonly details: Readonly<Record<string, unknown>>;
  }>;
}

/** A theme that writes its styling calls into the output. */
const theme = {
  fg: (color: string, text: string) => `${color}(${text})`,
  styledSymbol: (symbol: string, color: string) => `${color}:${symbol}`,
};

/* Registers the extension on a host whose `Type.Unsafe` returns the JSON Schema unchanged. */
async function registerTools(): Promise<{
  label: string | undefined;
  tools: Map<string, RegisteredTool>;
}> {
  const tools = new Map<string, RegisteredTool>();
  let label: string | undefined;
  await puzzlesExtension({
    typebox: { Type: { Unsafe: (schema: unknown) => schema } },
    setLabel(value: string) {
      label = value;
    },
    registerTool(tool: RegisteredTool) {
      tools.set(tool.name, tool);
    },
  } as unknown as never);
  return { label, tools };
}

const toolNames = Object.values(facts.tools)
  .map((tool) => tool.name)
  .sort();

describe("OMP extension", () => {
  it("registers every puzzle tool as read-only and essential under one label", async () => {
    const { label, tools } = await registerTools();

    expect([...tools.keys()].sort()).toEqual(toolNames);
    expect([...tools.values()].every((tool) => tool.approval === "read")).toBe(true);
    expect([...tools.values()].every((tool) => tool.loadMode === "essential")).toBe(true);
    expect(label).toBe("Puzzles");
  });

  it("hands OMP the schema every other surface gets", async () => {
    const { tools } = await registerTools();

    for (const definition of puzzlesTools) {
      const tool = tools.get(definition.name);
      expect(tool?.parameters, definition.name).toEqual(definition.input);
      expect(tool?.label, definition.name).toBe(definition.title);
      expect(tool?.description, definition.name).toBe(definition.description);
    }
  });

  it("checks the limits of the facts itself, since the host may not", async () => {
    const { tools } = await registerTools();
    const call = (name: string, params: Readonly<Record<string, unknown>>) =>
      tools.get(name)?.execute("call-limits", params);

    await expect(
      call("puzzles_list", { limit: facts.parameters.limit.maximum }),
    ).resolves.toBeDefined();
    for (const limit of [0, 1.5, facts.parameters.limit.maximum + 1]) {
      await expect(call("puzzles_list", { limit }), String(limit)).rejects.toThrow(ToolInputError);
    }
    for (const offset of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1, "50", null]) {
      await expect(call("puzzles_list", { offset }), String(offset)).rejects.toThrow(
        ToolInputError,
      );
    }
    await expect(call("puzzles_list", { status: "bogus" })).rejects.toThrow(
      `must be one of ${facts.statuses.join(", ")}`,
    );
    await expect(call("puzzles_show", { id: "" })).rejects.toThrow(ToolInputError);
    await expect(
      call("puzzles_show", { id: "x".repeat(facts.parameters.id.maxLength + 1) }),
    ).rejects.toThrow(ToolInputError);
    await expect(call("puzzles_solver", { key: "" })).rejects.toThrow(ToolInputError);
  });

  it("executes list pagination through the shared executor", async () => {
    const { tools } = await registerTools();
    const tool = tools.get("puzzles_list");
    const result = await tool?.execute("call-page", { collection: "b1000", offset: 1, limit: 1 });

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

  it("renders a call line without terminal control bytes", async () => {
    const { tools } = await registerTools();
    const hostile = [
      "b1000/1",
      String.fromCodePoint(0x1b),
      "[31m\nforged",
      String.fromCodePoint(0x85),
      "1m",
      String.fromCodePoint(0x2028),
      "line",
      String.fromCodePoint(0x202e),
    ].join("");
    const rendered = tools
      .get("puzzles_show")
      ?.renderCall?.({ id: hostile }, { isPartial: false }, theme);

    expect(rendered?.text).toBe(
      "success:status.done accent(Show Puzzle): muted(b1000/1 forged 1m line)",
    );
  });

  it("renders the list filters it was called with", async () => {
    const { tools } = await registerTools();
    const render = (args: Readonly<Record<string, unknown>>) =>
      tools.get("puzzles_list")?.renderCall?.(args, { isPartial: false }, theme)?.text;

    expect(render({})).toBe("success:status.done accent(List Puzzles): muted(all)");
    expect(render({ collection: "b1000", status: "unsolved" })).toBe(
      "success:status.done accent(List Puzzles): muted(b1000 unsolved)",
    );
  });

  it("renders the solver call and executes it against the library", async () => {
    const { tools } = await registerTools();
    const tool = tools.get("puzzles_solver");

    expect(tool?.renderCall?.({ key: "lia" }, { isPartial: false }, theme)?.text).toBe(
      "success:status.done accent(Show Solver): muted(lia)",
    );
    const result = await tool?.execute("call-solver", { key: "lia" });
    expect(result?.content[0]?.text).toContain("\tweave/8\tclaimed\t");
  });

  it("refuses a stray argument on every tool that takes some, whatever the host checks", async () => {
    const { tools } = await registerTools();
    const calls: Readonly<Record<string, Readonly<Record<string, unknown>>>> = {
      puzzles_author: { key: "dug", name: "Dug" },
      puzzles_solver: { key: "lia", name: "Lia" },
      puzzles_show: { id: "b1000/71", name: "71" },
      puzzles_hints: { id: "gsmg", name: "gsmg" },
      puzzles_stages: { id: "gsmg", name: "gsmg" },
      puzzles_list: { collection: "b1000", with_pubkey: true },
      puzzles_verify: { id: "b1000/1", name: "1" },
      puzzles_balance: { id: "b1000/71", api_key: "secret" },
    };

    for (const [name, params] of Object.entries(calls)) {
      await expect(tools.get(name)?.execute("call-stray", params), name).rejects.toThrow(
        ToolInputError,
      );
    }
    await expect(
      tools.get("puzzles_stats")?.execute("call-open", { _: "" }),
    ).resolves.toBeDefined();
  });

  it("executes the verify tool against the library", async () => {
    const { tools } = await registerTools();
    const result = await tools.get("puzzles_verify")?.execute("call-1", { id: "b1000/1" });

    expect(result?.content[0]?.text).toContain("verified");
  });
});
