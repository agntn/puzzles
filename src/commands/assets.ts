import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { sha256 } from "@agntn/hashes";
import { defineCommand } from "citty";
import { jsonArg, oneLine, printLine } from "./output.ts";
import { requirePuzzle } from "../core/dataset.ts";
import { InvalidArgumentError } from "../core/errors.ts";
import type { AssetLink } from "../core/puzzle.ts";
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
 * Why a fetch failed, with the system code under it when there is one: `fetch failed (ENOTFOUND)`.
 *
 * @param {unknown} error - What `fetch` threw.
 * @returns {string} The reason on one line.
 */
function fetchFailure(error: unknown): string {
  if (!(error instanceof Error)) {
    return oneLine(String(error));
  }
  const code = (error.cause as NodeJS.ErrnoException | undefined)?.code;
  return oneLine(code === undefined ? error.message : `${error.message} (${code})`);
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
    return { ...link, status: "UNREACHABLE", error: fetchFailure(error) };
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

export default defineCommand({
  meta: {
    name: "assets",
    description:
      "List the files a puzzle ships with their SHA-256 and size, or check copies against them",
  },
  args: {
    id: { type: "positional", description: "Puzzle identifier, for example gsmg" },
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
    if (args.check !== undefined && args.live === true) {
      throw new InvalidArgumentError("check", "pass either --check or --live, not both");
    }
    const puzzle = await requirePuzzle(args.id ?? "");
    const files = await checkAll(puzzle.assetLinks(), args.check, args.live === true);
    if (files.some((file) => "status" in file && FAILED.has(file.status))) {
      process.exitCode = 1;
    }
    if (args.json) {
      printLine(toJson({ id: puzzle.id(), assets: files }));
      return;
    }
    if (files.length === 0) {
      printLine(`${puzzle.id()}: no assets recorded`);
      return;
    }
    for (const file of files) {
      printLine(formatLink(file, args.live === true));
    }
  },
});
