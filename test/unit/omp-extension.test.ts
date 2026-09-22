import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import * as OmpTypeBox from "@oh-my-pi/omptype/typebox";
import { describe, expect, it } from "vite-plus/test";
import puzzlesExtension from "../../packages/omp/extensions/puzzles.ts";
import { facts } from "../../src/tool-operations.ts";

interface RegisteredTool {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly approval: string;
  readonly parameters: {
    readonly safeParse: (input: unknown) => { readonly success: boolean };
    toJsonSchema(): {
      readonly properties?: {
        readonly status?: {
          readonly anyOf?: unknown;
          readonly description?: string;
          readonly enum?: readonly string[];
        };
      };
    };
  };
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

class FakeText {
  readonly text: string;

  constructor(text: string) {
    this.text = text;
  }
}

async function registerTools(): Promise<{
  label: string | undefined;
  tools: Map<string, RegisteredTool>;
}> {
  const tools = new Map<string, RegisteredTool>();
  let label: string | undefined;
  const omp = {
    typebox: OmpTypeBox,
    pi: { Text: FakeText },
    setLabel(value: string) {
      label = value;
    },
    registerTool(tool: RegisteredTool) {
      tools.set(tool.name, tool);
    },
  } as unknown as ExtensionAPI;
  await puzzlesExtension(omp);
  return { label, tools };
}

const toolNames = Object.values(facts.tools)
  .map((tool) => tool.name)
  .sort();

describe("OMP extension", () => {
  it("registers every puzzle tool as read-only under one label", async () => {
    const { label, tools } = await registerTools();

    expect([...tools.keys()].sort()).toEqual(toolNames);
    expect([...tools.values()].every((tool) => tool.approval === "read")).toBe(true);
    expect(label).toBe("Puzzles");
  });

  it("validates parameters with the host TypeBox build on the same limits as the facts", async () => {
    const { tools } = await registerTools();
    const list = tools.get("puzzles_list");
    const show = tools.get("puzzles_show");
    if (list === undefined || show === undefined) {
      throw new Error("puzzles_list and puzzles_show must be registered");
    }

    expect(list.parameters.safeParse({ limit: facts.parameters.limit.maximum }).success).toBe(true);
    expect(list.parameters.safeParse({ limit: facts.parameters.limit.maximum + 1 }).success).toBe(
      false,
    );
    expect(list.parameters.safeParse({ limit: 1.5 }).success).toBe(false);
    for (const offset of [0, 50, Number.MAX_SAFE_INTEGER]) {
      expect(list.parameters.safeParse({ offset }).success).toBe(true);
    }
    for (const offset of [-1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1, "50", null]) {
      expect(list.parameters.safeParse({ offset }).success).toBe(false);
    }
    expect(list.parameters.safeParse({ status: "bogus" }).success).toBe(false);
    for (const status of facts.statuses) {
      expect(list.parameters.safeParse({ status }).success).toBe(true);
    }
    expect(list.parameters.toJsonSchema().properties?.status).toMatchObject({
      enum: [...facts.statuses],
      description: facts.parameters.status.description,
    });
    expect(list.parameters.toJsonSchema().properties?.status).not.toHaveProperty("anyOf");
    expect(show.parameters.safeParse({ id: "" }).success).toBe(false);
    expect(
      show.parameters.safeParse({ id: "x".repeat(facts.parameters.id.maxLength + 1) }).success,
    ).toBe(false);
    expect(show.parameters.safeParse({ id: "b1000/1" }).success).toBe(true);
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
    const rendered = tools.get("puzzles_show")?.renderCall?.({ id: hostile }, {}, {});

    expect(rendered?.text).toBe("Show puzzle b1000/1 forged 1m line");
  });

  it("executes the verify tool against the library", async () => {
    const { tools } = await registerTools();
    const result = await tools.get("puzzles_verify")?.execute("call-1", { id: "b1000/1" });

    expect(result?.content[0]?.text).toContain("verified");
  });
});
