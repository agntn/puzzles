import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { sha256 } from "@agntn/hashes";
import { defineCommand } from "citty";
import { jsonArg, oneLine, printError, printLine } from "./output.ts";
import { citedArchivedSources } from "../core/archived-sources.ts";
import { requirePuzzle } from "../core/dataset.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import {
  fetchFailure,
  formatFileRead,
  formatFileReport,
  puzzleFiles,
  readPuzzleFile,
} from "../core/files.ts";
import type { AssetLink, Puzzle } from "../core/puzzle.ts";
import { requireCollection } from "../core/registry.ts";
import { toJson } from "../core/utils.ts";

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
 * @returns {CheckedAsset} The file with its status.
 */
function compare(link: AssetLink, data: Uint8Array): CheckedAsset {
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
    return compare(link, new Uint8Array(await readFile(join(directory, link.file))));
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
    return compare(link, new Uint8Array(await response.arrayBuffer()));
  } catch (error) {
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
 * Writes one file's bytes to standard output untouched, so `> puzzle.png` keeps the image, and its
 * size, digest and source to standard error.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {string} path - The file's path as the listing prints it.
 * @returns {Promise<void>} Resolves once the bytes are written.
 */
async function read(puzzle: Puzzle, path: string): Promise<void> {
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
}

/**
 * The listing without a check: every file and every archived source, as `puzzles_assets` prints it.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {boolean} json - Whether to print JSON.
 * @returns {Promise<void>} Resolves once the listing is printed.
 */
async function list(puzzle: Puzzle, json: boolean): Promise<void> {
  const collection = await requireCollection(puzzle.collection());
  const files = puzzleFiles(puzzle.assetLinks(), citedArchivedSources(puzzle, collection));
  if (json) {
    const sources = files.filter((file) => file.kind === "source" || file.kind === "screenshot");
    printLine(toJson({ id: puzzle.id(), assets: puzzle.assetLinks(), sources }));
    return;
  }
  for (const line of formatFileReport(puzzle.id(), files)) {
    printLine(line);
  }
}

/**
 * Checks every file against local copies or author URLs; exit 1 on a missing or changed copy.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {string | undefined} directory - The directory of `--check`, if given.
 * @param {boolean} live - Whether `--live` was given.
 * @param {boolean} json - Whether to print JSON.
 * @returns {Promise<void>} Resolves once the result is printed.
 */
async function check(
  puzzle: Puzzle,
  directory: string | undefined,
  live: boolean,
  json: boolean,
): Promise<void> {
  const files = await checkAll(puzzle.assetLinks(), directory, live);
  if (files.some((file) => "status" in file && FAILED.has(file.status))) {
    process.exitCode = 1;
  }
  if (json) {
    printLine(toJson({ id: puzzle.id(), assets: files }));
    return;
  }
  if (files.length === 0) {
    printLine(`${puzzle.id()}: no assets recorded`);
    return;
  }
  for (const file of files) {
    printLine(formatLink(file, live));
  }
}

export default defineCommand({
  meta: {
    name: "assets",
    description:
      "List the files a puzzle ships and the archived copies of the pages it cites, read one, or check copies against the pinned SHA-256",
  },
  args: {
    id: { type: "positional", description: "Puzzle identifier, for example gsmg" },
    read: {
      type: "string",
      description:
        "Write one file to stdout, by the path the listing prints, once its bytes match the record",
    },
    check: {
      type: "string",
      description:
        "Directory with local copies, named as the record names them, to hash and compare",
    },
    live: {
      type: "boolean",
      description: "Fetch each file from the author's URL the record pins and compare it",
    },
    ...jsonArg,
  },
  async run({ args }) {
    const modes = [args.read !== undefined, args.check !== undefined, args.live === true];
    if (modes.filter(Boolean).length > 1) {
      throw new InvalidArgumentError("read", "pass one of --read, --check and --live");
    }
    const puzzle = await requirePuzzle(args.id ?? "");
    if (args.read !== undefined) {
      await read(puzzle, args.read);
      return;
    }
    if (args.check === undefined && args.live !== true) {
      await list(puzzle, args.json === true);
      return;
    }
    await check(puzzle, args.check, args.live === true, args.json === true);
  },
});
