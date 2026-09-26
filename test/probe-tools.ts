/** Run with <package-root> <pi|omp|mcp> <src|dist>; --benchmark also accepts eager baselines. */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ExtensionAPI as PiApi } from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI as OmpApi } from "@oh-my-pi/pi-coding-agent";

const root = path.resolve(process.argv[2] ?? ".");
const surface = process.argv[3] ?? "pi";
const layout = process.argv[4] ?? "src";
const loaded: string[] = [];
registerHooks({
  load(url, context, nextLoad) {
    loaded.push(url);
    return nextLoad(url, context);
  },
});
/* The packed build puts `Puzzle` in the collection chunk, so both names count as the dataset. */
const datasetModule =
  /\/(?:core|_chunks)\/(?:dataset|registry|puzzle|collection)\d*\.(?:ts|mjs)(?:[?#]|$)/u;
const entry = (relative: string): string => pathToFileURL(path.join(root, relative)).href;
const started = performance.now();
let call: (name: string, args: Readonly<Record<string, unknown>>) => Promise<unknown>;
let close = async (): Promise<void> => {};

if (surface === "mcp") {
  const { createMcpServer } = (await import(
    entry(layout === "src" ? "src/mcp.ts" : "dist/mcp.mjs")
  )) as typeof import("../src/mcp.ts");
  const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
  const { InMemoryTransport } = await import("@modelcontextprotocol/sdk/inMemory.js");
  const [a, b] = InMemoryTransport.createLinkedPair();
  const server = createMcpServer();
  const client = new Client({ name: "probe", version: "1" });
  await Promise.all([server.connect(a), client.connect(b)]);
  assert.equal((await client.listTools()).tools.length, 12);
  call = (name, args) => client.callTool({ name, arguments: args });
  close = async () => {
    await Promise.all([client.close(), server.close()]);
  };
} else {
  assert.ok(surface === "pi" || surface === "omp");
  const tools = new Map<
    string,
    { execute: (id: string, args: Readonly<Record<string, unknown>>) => Promise<unknown> }
  >();
  const extra =
    surface === "omp"
      ? {
          typebox: await import("@oh-my-pi/omptype/typebox"),
          pi: { Text: class {} },
          setLabel() {},
        }
      : {};
  const extension = (await import(entry(`packages/${surface}/extensions/puzzles.ts`))) as {
    default: (api: PiApi & OmpApi) => Promise<void>;
  };
  await extension.default({
    ...extra,
    registerTool(tool: {
      readonly name: string;
      readonly execute: (id: string, args: Readonly<Record<string, unknown>>) => Promise<unknown>;
    }) {
      tools.set(tool.name, tool);
    },
  } as unknown as PiApi & OmpApi);
  assert.equal(tools.size, 12);
  call = (name, args) => {
    const tool = tools.get(name);
    assert.ok(tool);
    return tool.execute("probe", args);
  };
}

try {
  const ready = performance.now() - started;
  const modules = loaded.length;
  if (!process.argv.includes("--benchmark")) {
    assert.deepEqual(
      loaded.filter(
        (url) =>
          /\/node_modules\/@agntn\/chains\//u.test(url) ||
          (url.startsWith(`${entry(".")}/`) && datasetModule.test(url)),
      ),
      [],
      "tool discovery must not load the dataset or chain implementations",
    );
  }
  const firstStart = performance.now();
  const shown = await call("puzzles_show", { id: "b1000/1" });
  assert.match(JSON.stringify(shown), /1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH/u);
  const firstShow = performance.now() - firstStart;
  const stats = await call("puzzles_stats", {});
  assert.match(JSON.stringify(stats), /Total: [1-9]\d* puzzles? in [1-9]\d* collections?/u);
  const repeatStart = performance.now();
  let last: unknown;
  for (let i = 0; i < 1000; i++) {
    last = await call("puzzles_stats", {});
  }
  const repeat1000 = performance.now() - repeatStart;
  assert.deepEqual(last, stats);
  console.log(
    JSON.stringify({
      surface,
      layout,
      ready,
      modules,
      firstShow,
      repeat1000,
    }),
  );
} finally {
  await close();
}
