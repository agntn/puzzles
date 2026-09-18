import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import * as OmpTypeBox from "@oh-my-pi/omptype/typebox";
import { describe, expect, it } from "vitest";
import puzzlesExtension from "../../packages/omp/extensions/puzzles.ts";
import { facts } from "../../src/tool-operations.ts";

interface RegisteredTool {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly approval: string;
  readonly parameters: {
    readonly safeParse: (input: unknown) => { readonly success: boolean };
  };
  readonly renderCall?: (
    args: Readonly<Record<string, unknown>>,
    options: unknown,
    theme: unknown,
  ) => { readonly text: string };
  readonly execute: (
    toolCallId: string,
    params: Readonly<Record<string, unknown>>,
  ) => Promise<{ readonly content: readonly { readonly type: string; readonly text: string }[] }>;
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
    expect(list.parameters.safeParse({ status: "bogus" }).success).toBe(false);
    for (const status of facts.statuses) {
      expect(list.parameters.safeParse({ status }).success).toBe(true);
    }
    expect(show.parameters.safeParse({ id: "" }).success).toBe(false);
    expect(
      show.parameters.safeParse({ id: "x".repeat(facts.parameters.id.maxLength + 1) }).success,
    ).toBe(false);
    expect(show.parameters.safeParse({ id: "b1000/1" }).success).toBe(true);
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
