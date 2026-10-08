import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defineTool, Type, type ToolResult } from "@agntn/tools";
import { closed, plainWord } from "./filters.ts";
import { lines, oneLine, printError, streams } from "./output.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { AssetLink, Puzzle } from "../core/puzzle.ts";

/** How long `--live` waits for one author URL. */
const LIVE_TIMEOUT_MS = 30_000;

/** How a copy, local or at the author's URL, compares with the bytes the record pins. */
type CheckStatus = "MATCH" | "MISMATCH" | "MISSING" | "NO_ORIGIN" | "UNPINNED" | "UNREACHABLE";

/** The statuses that fail the command: a copy is missing or holds other bytes. */
const FAILED: ReadonlySet<CheckStatus> = new Set(["MISMATCH", "MISSING"]);

/** One file with the result of a check, the copy's digest when it differs, and why a fetch failed. */
interface CheckedAsset extends AssetLink {
  readonly actual?: { readonly bytes: number; readonly sha256: string };
  readonly error?: string;
  readonly status: CheckStatus;
}

/**
 * Compares bytes with what the record pins for the file.
 *
 * @param {AssetLink} link - The file as the record ships it.
 * @param {Uint8Array} data - The bytes of the copy.
 * @returns {Promise<CheckedAsset>} The file with its status.
 */
async function compare(link: AssetLink, data: Uint8Array): Promise<CheckedAsset> {
  const { sha256 } = await import("@agntn/hashes");
  const actual = { sha256: sha256(data).toHex(), bytes: data.length };
  if (link.sha256 === undefined) {
    return { ...link, actual, status: "UNPINNED" };
  }
  return actual.sha256 === link.sha256 && actual.bytes === link.bytes
    ? { ...link, status: "MATCH" }
    : { ...link, actual, status: "MISMATCH" };
}

/**
 * Hashes the local copy of one file and compares it with the record.
 *
 * @param {AssetLink} link - The file as the record ships it.
 * @param {string} directory - The directory that holds the local copies.
 * @returns {Promise<CheckedAsset>} The file with its status.
 */
async function checkLocal(link: AssetLink, directory: string): Promise<CheckedAsset> {
  try {
    return await compare(link, new Uint8Array(await readFile(join(directory, link.file))));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "ENOTDIR") {
      return { ...link, status: "MISSING" };
    }
    throw error;
  }
}

/**
 * Fetches the file from the author's URL. A failed request is UNREACHABLE, not a change.
 *
 * @param {AssetLink} link - The file as the record ships it.
 * @returns {Promise<CheckedAsset>} The file with its status.
 */
async function checkLive(link: AssetLink): Promise<CheckedAsset> {
  if (link.origin === undefined) {
    return { ...link, status: "NO_ORIGIN" };
  }
  try {
    const response = await fetch(link.origin, { signal: AbortSignal.timeout(LIVE_TIMEOUT_MS) });
    if (!response.ok) {
      return { ...link, status: "UNREACHABLE", error: `HTTP ${response.status}` };
    }
    return await compare(link, new Uint8Array(await response.arrayBuffer()));
  } catch (error) {
    const { fetchFailure } = await import("../core/files.ts");
    return { ...link, status: "UNREACHABLE", error: oneLine(fetchFailure(error)) };
  }
}

/**
 * One file as a tab-separated line, with the author's URL under `--live`.
 *
 * @param {AssetLink | CheckedAsset} link - The file.
 * @param {boolean} live - Whether the command fetched the author's URLs.
 * @returns {string} The line.
 */
function formatLink(link: AssetLink | CheckedAsset, live: boolean): string {
  const url = live ? (link.origin ?? "-") : link.url;
  const columns = [link.kind, link.file, link.bytes ?? "-", link.sha256 ?? "-", url];
  if (!("status" in link)) {
    return columns.join("\t");
  }
  return [link.status, ...columns, ...(link.error === undefined ? [] : [link.error])].join("\t");
}

/**
 * Every file, checked against local copies, against the author's URLs, or not at all.
 *
 * @param {readonly AssetLink[]} links - The files as the record ships them.
 * @param {string | undefined} directory - The directory of `--check`, if given.
 * @param {boolean} live - Whether `--live` was given.
 * @returns {Promise<readonly (AssetLink | CheckedAsset)[]>} The files, with a status when checked.
 */
async function checkAll(
  links: readonly AssetLink[],
  directory: string | undefined,
  live: boolean,
): Promise<readonly (AssetLink | CheckedAsset)[]> {
  if (directory !== undefined) {
    return Promise.all(links.map((link) => checkLocal(link, directory)));
  }
  return live ? Promise.all(links.map((link) => checkLive(link))) : links;
}

/**
 * Writes one file's bytes to stdout untouched and its digest to stderr. Bytes with JSON glued on
 * are neither, so `--json` is refused before the first byte.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {string} path - The file's path as the listing prints it.
 * @param {unknown} host - The host `runCli` hands over.
 * @returns {Promise<ToolResult>} No text, since the bytes are the answer.
 */
async function read(puzzle: Puzzle, path: string, host: unknown): Promise<ToolResult> {
  if (!streams(host)) {
    throw new InvalidArgumentError(
      "read",
      "writes the file's bytes to stdout, so it takes no --json",
    );
  }
  const { requireCollection } = await import("../core/registry.ts");
  const { citedArchivedSources } = await import("../core/archived-sources.ts");
  const { formatFileRead, puzzleFiles, readPuzzleFile } = await import("../core/files.ts");
  const collection = await requireCollection(puzzle.collection());
  const files = puzzleFiles(puzzle.assetLinks(), citedArchivedSources(puzzle, collection));
  const target = files.find((file) => file.path === path);
  if (target === undefined) {
    throw new InvalidArgumentError(
      "read",
      `${oneLine(JSON.stringify(path))} is not a file of ${puzzle.id()}; run puzzles assets ${puzzle.id()} for the list`,
    );
  }
  const content = await readPuzzleFile(target, Number.POSITIVE_INFINITY);
  printError(formatFileRead(content));
  process.stdout.write(content.data);
  return { content: [], details: null };
}

/**
 * The listing without a check: every file and every archived source, as `puzzles_assets` prints it.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {Promise<ToolResult>} The listing, with the files and sources as details.
 */
async function list(puzzle: Puzzle): Promise<ToolResult> {
  const { requireCollection } = await import("../core/registry.ts");
  const { citedArchivedSources } = await import("../core/archived-sources.ts");
  const { formatFileReport, puzzleFiles } = await import("../core/files.ts");
  const collection = await requireCollection(puzzle.collection());
  const files = puzzleFiles(puzzle.assetLinks(), citedArchivedSources(puzzle, collection));
  const sources = files.filter((file) => file.kind === "source" || file.kind === "screenshot");
  return lines(formatFileReport(puzzle.id(), files), {
    id: puzzle.id(),
    assets: puzzle.assetLinks(),
    sources,
  });
}

/**
 * Checks every file against local copies or author URLs; exit 1 on a missing or changed copy.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {string | undefined} directory - The directory of `--check`, if given.
 * @param {boolean} live - Whether `--live` was given.
 * @returns {Promise<ToolResult>} One line per file, with the checked files as details.
 */
async function check(
  puzzle: Puzzle,
  directory: string | undefined,
  live: boolean,
): Promise<ToolResult> {
  const files = await checkAll(puzzle.assetLinks(), directory, live);
  if (files.some((file) => "status" in file && FAILED.has(file.status))) {
    process.exitCode = 1;
  }
  const rows =
    files.length === 0
      ? [`${puzzle.id()}: no assets recorded`]
      : files.map((file) => formatLink(file, live));
  return lines(rows, { id: puzzle.id(), assets: files });
}

export default defineTool({
  name: "puzzles_assets",
  title: "Puzzle files",
  description:
    "List the files a puzzle ships and the archived copies of the pages it cites, read one, or check copies against the pinned SHA-256",
  effect: "read",
  openWorld: true,
  input: closed({
    id: Type.String({ description: "Puzzle identifier, for example gsmg" }),
    read: Type.Optional(
      Type.String({
        description:
          "Write one file to stdout, by the path the listing prints, once its bytes match the record",
      }),
    ),
    check: Type.Optional(
      Type.String({
        description:
          "Directory with local copies, named as the record names them, to hash and compare",
      }),
    ),
    live: Type.Optional(
      Type.Boolean({
        description: "Fetch each file from the author's URL the record pins and compare it",
      }),
    ),
  }),
  cli: { command: "assets", positional: ["id"] },
  async execute(args, { host }) {
    plainWord(args.id);
    const modes = [args.read !== undefined, args.check !== undefined, args.live === true];
    if (modes.filter(Boolean).length > 1) {
      throw new InvalidArgumentError("read", "pass one of --read, --check and --live");
    }
    const { requirePuzzle } = await import("../core/dataset.ts");
    const puzzle = await requirePuzzle(args.id);
    if (args.read !== undefined) {
      return read(puzzle, args.read, host);
    }
    if (args.check === undefined && args.live !== true) {
      return list(puzzle);
    }
    return check(puzzle, args.check, args.live === true);
  },
});
