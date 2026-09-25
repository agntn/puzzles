#!/usr/bin/env node
/*
 * Packed-package gate for everything `files` publishes. Unit tests import the library from src/,
 * so none of them touch the tarball npm installs. This script packs the package the way
 * `pnpm publish` does, unpacks it inside the checkout so the packed files resolve their
 * dependencies from the repository's node_modules, and exercises every published entry from
 * there: the library and its lazy collections, the MCP server over an in-memory transport, the
 * Pi and OMP extensions without any src/ next to them, and the CLI bin run as a command. It also
 * runs `mcp` from the checkout's own `dist/cli.mjs`, which serves src/ there and the bundle
 * everywhere else. The load hook in record-loads.ts records which packed modules each step pulled
 * in, so the lazy manifest is checked on the published layout, not only on the sources.
 * Run: pnpm test:packed
 */

import { loaded, recordSourcesUnder, type LoadedModule } from "./record-loads.ts";
import assert from "node:assert/strict";
import { execFile, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import type { ExtensionAPI as PiExtensionApi } from "@earendil-works/pi-coding-agent";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { ExtensionAPI as OmpExtensionApi } from "@oh-my-pi/pi-coding-agent";
import * as OmpTypeBox from "@oh-my-pi/omptype/typebox";

type Library = typeof import("../src/index.ts");
type McpEntry = typeof import("../src/mcp.ts");
type PiExtension = typeof import("../packages/pi/extensions/puzzles.ts");
type OmpExtension = typeof import("../packages/omp/extensions/puzzles.ts");

interface Manifest {
  readonly bin: Readonly<Record<string, string>>;
  readonly exports: Readonly<Record<string, { readonly import: string }>>;
  readonly name: string;
  readonly omp: { readonly skills?: readonly string[] };
  readonly pi: { readonly skills?: readonly string[] };
  readonly version: string;
}

/** The slice of a registered tool the gate exercises; Pi and OMP differ beyond it. */
interface RegisteredTool {
  readonly execute: (
    toolCallId: string,
    params: Readonly<Record<string, unknown>>,
  ) => Promise<unknown>;
  readonly name: string;
  readonly parameters?: { readonly safeParse?: (input: unknown) => { readonly success: boolean } };
  readonly renderCall?: (
    args: Readonly<Record<string, unknown>>,
    options: unknown,
    theme: unknown,
  ) => { readonly text: string };
}

type ModuleMatcher = (module: LoadedModule) => boolean;

const root = path.resolve(import.meta.dirname, "..");
const execFileAsync = promisify(execFile);

const expectedCollections = [
  "arweave",
  "b1000",
  "ballet",
  "bitaps",
  "bitimage",
  "book_quiz",
  "coin_artist",
  "dug",
  "genesis",
  "gsmg",
  "hash_collision",
  "iamabananaamaa",
  "ktimesg",
  "ledger_donjon",
  "luckylurker",
  "mineshop",
  "movie_enigma",
  "picture_puzzle",
  "quizchain",
  "rushwallet",
  "satoshi_birthday_quiz",
  "warp",
  "wickex",
  "zden",
];

const expectedToolNames = [
  "puzzles_author",
  "puzzles_authors",
  "puzzles_balance",
  "puzzles_collections",
  "puzzles_hints",
  "puzzles_list",
  "puzzles_show",
  "puzzles_solver",
  "puzzles_solvers",
  "puzzles_stages",
  "puzzles_stats",
  "puzzles_verify",
];

function run(command: string, args: readonly string[]): string {
  return execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, CI: "true" },
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120_000,
  });
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(directory, path.join(entry.parentPath, entry.name)));
}

function firstText(result: unknown): string {
  if (typeof result !== "object" || result === null || !("content" in result)) {
    return "";
  }
  const { content } = result;
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .map((part: unknown) =>
      typeof part === "object" && part !== null && "text" in part ? String(part.text) : "",
    )
    .join("");
}

function isError(result: unknown): boolean {
  return typeof result === "object" && result !== null && "isError" in result
    ? result.isError === true
    : false;
}

const temporaryRoot = await mkdtemp(path.join(root, ".puzzles-packed-test-"));
const packageRoot = path.join(temporaryRoot, "package");
const packageRootUrl = pathToFileURL(`${packageRoot}/`).href;
recordSourcesUnder(packageRootUrl);

function loadedPackageModules(): LoadedModule[] {
  return loaded.filter((module) => module.url.startsWith(packageRootUrl));
}

function assertNotLoaded(matches: ModuleMatcher, reason: string): void {
  const offending = loadedPackageModules()
    .filter(matches)
    .map((module) => module.url.slice(packageRootUrl.length));
  assert.deepEqual(offending, [], reason);
}

function assertLoaded(matches: ModuleMatcher, reason: string): void {
  assert.ok(loadedPackageModules().some(matches), reason);
}

const collectionModule: ModuleMatcher = (module) =>
  module.url.startsWith(`${packageRootUrl}dist/collections/`);
const collectionNamed =
  (file: string): ModuleMatcher =>
  (module) =>
    module.url === `${packageRootUrl}dist/collections/${file}.mjs`;
const otherCollections =
  (file: string): ModuleMatcher =>
  (module) =>
    collectionModule(module) && !collectionNamed(file)(module);
const executors: ModuleMatcher = (module) =>
  module.url === `${packageRootUrl}dist/tool-operations.mjs`;
/* Dependencies resolve from the checkout's node_modules, outside the packed root. */
const verificationCryptoUrl = /\/node_modules\/(?:@agntn\/keys|@noble\/curves)\//u;
const verificationCrypto: ModuleMatcher = (module) => verificationCryptoUrl.test(module.url);

/**
 * Imports a packed entry under a unique URL, so every step evaluates its own copy
 * of the entry while the chunks behind it stay shared through Node's cache.
 *
 * @param {string} relative - Path inside the packed package.
 * @returns {Promise<T>} The entry's module namespace.
 */
function importPacked<T>(relative: string): Promise<T> {
  return import(`${packageRootUrl}${relative}?packed=${Date.now()}-${Math.random()}`) as Promise<T>;
}

class PackedText {
  readonly text: string;

  constructor(text: string) {
    this.text = text;
  }
}

async function registerPackedExtension(
  relative: string,
  api: Readonly<Record<string, unknown>>,
): Promise<Readonly<Record<string, RegisteredTool>>> {
  const extension = await importPacked<PiExtension | OmpExtension>(relative);
  const tools: Record<string, RegisteredTool> = {};
  const host = {
    ...api,
    registerTool(tool: RegisteredTool) {
      tools[tool.name] = tool;
    },
  } as unknown as PiExtensionApi & OmpExtensionApi;
  await extension.default(host);
  assert.deepEqual(
    Object.keys(tools).sort(),
    expectedToolNames,
    `${relative} registers every tool`,
  );
  return tools;
}

function requireTool(
  tools: Readonly<Record<string, RegisteredTool>>,
  name: string,
): RegisteredTool {
  const tool = tools[name];
  assert.ok(tool, `${name} was not registered`);
  return tool;
}

async function assertPackedLayout(manifest: Manifest): Promise<void> {
  assert.equal(manifest.name, "@agntn/puzzles");
  assert.match(manifest.version, /^\d+\.\d+\.\d+/u);
  assert.equal(typeof manifest.bin["puzzles"], "string", "the packed package declares no bin");
  for (const entry of [".", "./collections/*", "./tools", "./mcp", "./package.json"]) {
    assert.ok(entry in manifest.exports, `export ${entry} is missing from the packed package.json`);
  }
  const files = await walk(packageRoot);
  assert.deepEqual(
    files.filter((file) => file.startsWith("src/")),
    [],
    "the packed package must not carry src/",
  );
  assert.deepEqual(
    files.filter((file) => file.startsWith("dist/") && file.endsWith(".js")),
    [],
    "every emitted runtime file must be .mjs",
  );
  assert.deepEqual(
    files.filter((file) => file.endsWith(".map")),
    [],
    "the packed package must not carry source maps",
  );
  const collectionTarget = manifest.exports["./collections/*"]?.import ?? "";
  assert.notEqual(collectionTarget, "", "the collections export has no import target");
  for (const key of expectedCollections) {
    const file = collectionTarget.replace("*", key);
    assert.ok(
      existsSync(path.join(packageRoot, file)),
      `collection entry ${key} resolves to a missing file ${file}`,
    );
  }
  for (const file of [
    "packages/shared/puzzles-tool-schemas.ts",
    "packages/pi/extensions/puzzles.ts",
    "packages/omp/extensions/puzzles.ts",
  ]) {
    assert.ok(files.includes(file), `${file} is missing from the packed package`);
  }
  await assertPackedSkills(manifest, files);
}

/**
 * The skills ship in the tarball, and the Pi and OMP manifests point at them.
 *
 * @param {Manifest} manifest - The packed package.json.
 * @param {readonly string[]} files - Every packed file, relative to the package root.
 */
async function assertPackedSkills(manifest: Manifest, files: readonly string[]): Promise<void> {
  const skills = (await walk(path.join(root, "skills"))).map((file) => `skills/${file}`);
  assert.deepEqual(
    files.filter((file) => file.startsWith("skills/")).sort(),
    skills.sort(),
    "the packed package carries every skill file",
  );
  for (const harness of ["pi", "omp"] as const) {
    const dirs = manifest[harness].skills ?? [];
    assert.deepEqual(dirs, ["./skills"], `the ${harness} manifest points at the skills`);
    for (const dir of dirs) {
      const names = await readdir(path.join(packageRoot, dir));
      assert.ok(names.length > 0, `${harness} skills in ${dir} are empty`);
      for (const name of names) {
        assert.ok(
          files.includes(path.posix.join(dir.replace(/^\.\//u, ""), name, "SKILL.md")),
          `${harness} skill ${name} has no SKILL.md in the packed package`,
        );
      }
    }
  }
}

async function assertPackedLibrary(): Promise<void> {
  const library = await importPacked<Library>("dist/index.mjs");
  assert.deepEqual([...library.collectionKeys()].sort(), expectedCollections);
  assert.deepEqual(
    library.p2wsh("bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj"),
    {
      value: "bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj",
      kind: "p2wsh",
    },
  );
  assertNotLoaded(collectionModule, "importing the library must not load a collection");
  const puzzle = await library.get("b1000/1");
  assert.equal(puzzle?.id(), "b1000/1");
  assertLoaded(collectionNamed("b1000"), "a lookup loads its collection");
  assertNotLoaded(otherCollections("b1000"), "a lookup must not load the other collections");
  assert.equal(library.hasCollection("peter_todd"), true, "the historical alias survives packing");
  assert.deepEqual(
    loaded.filter(verificationCrypto).map((module) => module.url),
    [],
    "importing the library and looking up a puzzle must not load the verification crypto",
  );
  assert.ok(puzzle !== undefined);
  assert.equal((await library.verify(puzzle)).verified, true, "b1000/1 verifies once packed");
  assert.ok(loaded.some(verificationCrypto), "the first verification loads the crypto");
}

/**
 * The MCP bundle is the only entry that carries the SDK and the inlined typebox,
 * so a chunk split or a missing dependency would surface here first.
 */
async function assertPackedMcpServer(): Promise<void> {
  const { createMcpServer } = await importPacked<McpEntry>("dist/mcp.mjs");
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createMcpServer();
  const client = new Client({ name: "packed-test", version: "1.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((tool) => tool.name).sort(), expectedToolNames);

    const rejected = await client.callTool({ name: "puzzles_show", arguments: { id: "" } });
    assert.equal(isError(rejected), true);
    assert.match(
      firstText(rejected),
      /^Invalid arguments at \/id/u,
      "the rejection must come from the bundled validator",
    );

    const shown = await client.callTool({ name: "puzzles_show", arguments: { id: "b1000/1" } });
    assert.equal(isError(shown), false, firstText(shown));
    assert.match(firstText(shown), /b1000\/1/u);
    assertNotLoaded(otherCollections("b1000"), "showing a puzzle must not load other collections");

    const page = await client.callTool({
      name: "puzzles_list",
      arguments: { collection: "b1000", offset: 1, limit: 1 },
    });
    assert.deepEqual(firstText(page).split("\n"), [
      "1 of 256 matching puzzles (offset 1):",
      "b1000/2\tsolved\t0.002 BTC\t1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb",
      "Next page: offset=2. Keep the same filters.",
    ]);

    const listed = await client.callTool({ name: "puzzles_collections", arguments: {} });
    assert.equal(firstText(listed).trim().split("\n").length, expectedCollections.length);
  } finally {
    await Promise.all([client.close(), server.close()]);
  }
}

async function assertPackedExtensions(): Promise<void> {
  const ompApi = { typebox: OmpTypeBox, pi: { Text: PackedText }, setLabel() {} };
  const [piTools, ompTools] = await Promise.all([
    registerPackedExtension("packages/pi/extensions/puzzles.ts", {}),
    registerPackedExtension("packages/omp/extensions/puzzles.ts", ompApi),
  ]);
  assertLoaded(executors, "the extensions read the facts from the packed executors");
  const piShow = requireTool(piTools, "puzzles_show");
  const ompShow = requireTool(ompTools, "puzzles_show");
  assert.ok(ompShow.renderCall !== undefined, "the OMP tool renders its call line");
  assert.equal(ompShow.renderCall({ id: "b1000/1" }, {}, {}).text, "Show puzzle b1000/1");
  const result = await piShow.execute("packed-test", { id: "b1000/1" });
  assert.match(firstText(result), /b1000\/1/u);
  for (const tools of [piTools, ompTools]) {
    const page = await requireTool(tools, "puzzles_list").execute("packed-page", {
      collection: "b1000",
      offset: 255,
      limit: 1,
    });
    assert.match(firstText(page), /^1 of 256 matching puzzles \(offset 255\):\nb1000\/256\t/u);
    assert.doesNotMatch(firstText(page), /Next page:/u);
  }
  assert.equal(
    ompShow.parameters?.safeParse?.({ id: "" }).success,
    false,
    "the OMP schema keeps the executors' limits",
  );
}

/** What one run of a built bin printed and how it exited. */
interface BinRun {
  readonly code: number;
  readonly stderr: string;
  readonly stdout: string;
}

/**
 * Runs a built bin under the load hook. stdin is closed at once, because `mcp` serves it until it
 * ends, and a non-zero exit comes back as a run too, because an unknown command prints the usage
 * and exits 1 on purpose. An inherited `PUZZLES_DIST` is dropped, so only `environment` sets it.
 *
 * @param {string} binPath - The bin file.
 * @param {readonly string[]} args - Arguments for the bin.
 * @param {Readonly<Record<string, string>>} environment - Extra variables for the child.
 * @returns {Promise<BinRun>} The exit code and both streams.
 */
async function runBin(
  binPath: string,
  args: readonly string[],
  environment: Readonly<Record<string, string>> = {},
): Promise<BinRun> {
  const hook = new URL("./record-loads.ts", import.meta.url).href;
  const { PUZZLES_DIST: _inherited, ...inherited } = process.env;
  const pending = execFileAsync(process.execPath, ["--import", hook, binPath, ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...inherited, ...environment, PUZZLES_REPORT_LOADS: "1" },
    timeout: 120_000,
  });
  pending.child.stdin?.end();
  try {
    const { stdout, stderr } = await pending;
    return { code: 0, stdout, stderr };
  } catch (error) {
    const failed = error as Partial<BinRun>;
    if (
      typeof failed.code !== "number" ||
      typeof failed.stdout !== "string" ||
      typeof failed.stderr !== "string"
    ) {
      throw error;
    }
    return { code: failed.code, stdout: failed.stdout, stderr: failed.stderr };
  }
}

/**
 * Reads the module URLs a run loaded from the hook's report on stderr.
 *
 * @param {BinRun} binRun - The run.
 * @param {string} label - Names the run in a failure.
 * @returns {string[]} Every module URL the run loaded.
 */
function loadedUrls(binRun: BinRun, label: string): string[] {
  const recorded = /@loaded (\[.*\])/u.exec(binRun.stderr)?.[1];
  assert.ok(recorded !== undefined, `the load hook reported nothing for ${label}`);
  const urls: unknown = JSON.parse(recorded);
  assert.ok(Array.isArray(urls), `the load hook reported something other than a list for ${label}`);
  return urls.map(String);
}

/**
 * citty resolves every subcommand to print the usage, for `--help` and `-h`, and again to look for
 * an alias when the command is unknown, so a static import inside `mcp` or `verify` would load the
 * whole MCP server or the verification crypto on each of those paths. The child runs under the
 * load hook and reports every module on exit.
 *
 * @param {string} binPath - The packed bin file.
 */
async function assertHelpStaysLight(binPath: string): Promise<void> {
  const usages = [
    { args: ["--help"], code: 0 },
    { args: ["-h"], code: 0 },
    { args: ["no-such-command"], code: 1 },
  ] as const;
  for (const usage of usages) {
    const label = `puzzles ${usage.args.join(" ")}`;
    const binRun = await runBin(binPath, usage.args);
    assert.equal(binRun.code, usage.code, `${label} exited ${binRun.code}`);
    assert.match(binRun.stdout, /mcp/u, `${label} prints the usage naming the mcp command`);
    const strings = loadedUrls(binRun, label);
    assert.deepEqual(
      /* pnpm's store paths carry peer hashes, so only the package directory itself counts as the SDK. */
      strings.filter((url) => url.includes("/node_modules/@modelcontextprotocol/")),
      [],
      `${label} must not load the MCP SDK`,
    );
    assert.deepEqual(
      strings.filter(
        (url) => url.startsWith(packageRootUrl) && /typebox|dist\/mcp\.mjs/u.test(url),
      ),
      [],
      `${label} must not load the server entry or the tool schemas`,
    );
    assert.deepEqual(
      strings.filter((url) => url.startsWith(`${packageRootUrl}dist/collections/`)),
      [],
      `${label} must not load a collection`,
    );
    assert.deepEqual(
      strings.filter((url) => verificationCryptoUrl.test(url)),
      [],
      `${label} must not load the verification crypto`,
    );
  }
}

async function assertPackedBin(manifest: Manifest): Promise<void> {
  const binEntry = manifest.bin["puzzles"];
  assert.ok(binEntry !== undefined, "the packed package declares no puzzles bin");
  const binPath = path.join(packageRoot, binEntry);
  const source = await readFile(binPath, "utf8");
  assert.match(source, /^#!\/usr\/bin\/env node\n/u, `${binEntry} lost its shebang`);
  if (process.platform !== "win32") {
    const { mode } = await stat(binPath);
    assert.ok(mode & 0o111, `${binEntry} is not executable, mode ${(mode & 0o777).toString(8)}`);
    /* Run the file itself, the way npm's bin symlink does, not through node. */
    const listed = run(binPath, ["collections"]);
    assert.equal(listed.trim().split("\n").length, expectedCollections.length);
  }
  await assertHelpStaysLight(binPath);
  /* An install has no src/ to serve, so `mcp` has to fall back to the bundle it ships. */
  const served = await runBin(binPath, ["mcp"]);
  assert.equal(served.code, 0, `the packed mcp exited ${served.code}`);
  assert.ok(
    loadedUrls(served, "the packed mcp").includes(`${packageRootUrl}dist/mcp.mjs`),
    "the packed mcp serves dist/mcp.mjs",
  );
}

/**
 * The checkout's own build serves `mcp` from src/, so a local server takes a change on restart
 * instead of `pnpm build`. `PUZZLES_DIST=1` keeps the bundle, and so does a copy under
 * `node_modules`, where Node refuses to strip types. The packed bin has no src/ at all.
 */
async function assertCheckoutBin(): Promise<void> {
  const sourceUrl = pathToFileURL(path.join(root, "src/")).href;
  const bin = path.join(root, "dist/cli.mjs");
  const live = await runBin(bin, ["mcp"]);
  assert.equal(live.code, 0, `the checkout's mcp exited ${live.code}`);
  assert.ok(
    loadedUrls(live, "the checkout's mcp").includes(`${sourceUrl}mcp.ts`),
    "the checkout's mcp serves src/mcp.ts",
  );
  const bundled = await runBin(bin, ["mcp"], { PUZZLES_DIST: "1" });
  assert.equal(bundled.code, 0, `mcp under PUZZLES_DIST=1 exited ${bundled.code}`);
  assert.deepEqual(
    loadedUrls(bundled, "mcp under PUZZLES_DIST=1").filter((url) => url.startsWith(sourceUrl)),
    [],
    "mcp under PUZZLES_DIST=1 keeps the bundle",
  );

  const cache = path.join(root, "node_modules/.cache");
  await mkdir(cache, { recursive: true });
  const copy = await mkdtemp(path.join(cache, "puzzles-bin-"));
  try {
    for (const entry of ["dist", "src", "packages", "package.json"]) {
      await cp(path.join(root, entry), path.join(copy, entry), { recursive: true });
    }
    const installed = await runBin(path.join(copy, "dist/cli.mjs"), ["mcp"]);
    const copiedSource = pathToFileURL(path.join(copy, "src/")).href;
    assert.equal(installed.code, 0, `mcp under node_modules exited ${installed.code}`);
    assert.deepEqual(
      loadedUrls(installed, "mcp under node_modules").filter((url) => url.startsWith(copiedSource)),
      [],
      "mcp under node_modules keeps the bundle",
    );
  } finally {
    await rm(copy, { recursive: true, force: true });
  }
}

try {
  /* pnpm pack runs prepack, so the tarball always carries a fresh build. */
  const tarball = path.join(temporaryRoot, "puzzles.tgz");
  run("pnpm", ["pack", "--out", tarball]);
  run("tar", ["-xzf", tarball, "-C", temporaryRoot]);
  const manifest = JSON.parse(
    await readFile(path.join(packageRoot, "package.json"), "utf8"),
  ) as Manifest;

  for (const surface of ["pi", "omp", "mcp"]) {
    run(process.execPath, ["test/probe-tools.ts", packageRoot, surface, "dist"]);
  }
  await assertPackedLayout(manifest);
  await assertPackedLibrary();
  await assertPackedMcpServer();
  await assertPackedExtensions();
  await assertPackedBin(manifest);
  await assertCheckoutBin();

  console.log(
    `Packed ${manifest.name}@${manifest.version}: ${expectedCollections.length} lazy collection entries, ${expectedToolNames.length} tools over MCP, Pi and OMP without src/, and ${manifest.bin["puzzles"]} ran as a command`,
  );
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
