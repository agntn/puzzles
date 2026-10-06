/** The files a puzzle hands out and the one read that fetches them, checked against the record. */

import { base64, hex } from "@scure/base";
import { archivedSourceCapture, archivedSourceUrl, type CitedSource } from "./archived-sources.ts";
import { FileUnavailableError, InvalidArgumentError } from "./errors.ts";
import { type AssetLink, assetUrlOf } from "./puzzle.ts";
import { countOf } from "./utils.ts";

/** One file a puzzle can hand out: one its record ships, or a reading copy of a page it cites. */
export interface PuzzleFile {
  readonly archive?: string;
  readonly bytes?: number;
  readonly citedBy?: CitedSource["citedBy"];
  readonly date?: string;
  readonly kind: AssetLink["kind"] | "source" | "screenshot";
  readonly origin?: string;
  readonly path: string;
  readonly sha256?: string;
  readonly url: string;
}

/** A file's bytes with their digest and the URL that served them. */
export interface FileContent {
  readonly data: Uint8Array;
  readonly file: PuzzleFile;
  readonly servedBy: string;
  readonly sha256: string;
}

/** A file's content as a model takes it, the shapes `ToolResult` carries. */
type FileBlock = { type: "image"; data: string; mimeType: string } | { type: "text"; text: string };

/** The largest file a read returns: 5 MiB after base64, the cap Anthropic sets on an image. */
export const MAX_FILE_BYTES = 3_932_160;

/** How long a read waits for one URL. */
const FETCH_TIMEOUT_MS = 30_000;

/** The image types every model host takes, by the bytes they start with. */
const IMAGE_SIGNATURES = [
  ["image/png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  ["image/jpeg", [0xff, 0xd8, 0xff]],
  ["image/gif", [0x47, 0x49, 0x46, 0x38]],
] as const;

/**
 * The record's files, then each cited page's reading copy with its screenshot.
 *
 * @param {readonly AssetLink[]} links - The files the record ships.
 * @param {readonly CitedSource[]} sources - The copies the puzzle cites.
 * @returns {PuzzleFile[]} Every file a read takes.
 */
export function puzzleFiles(
  links: readonly AssetLink[],
  sources: readonly CitedSource[],
): PuzzleFile[] {
  return [
    ...links.map(({ file: _file, ...link }) => link),
    ...sources.flatMap(({ citedBy, source }) => {
      const base = `assets/sources/${source.file}`;
      const capture = archivedSourceCapture(source);
      return [
        {
          kind: "source",
          path: `${base}.md`,
          url: assetUrlOf(`${base}.md`),
          citedBy,
          date: source.date,
          origin: archivedSourceUrl(source),
          ...(capture === undefined ? {} : { archive: capture }),
        },
        { kind: "screenshot", path: `${base}.png`, url: assetUrlOf(`${base}.png`), citedBy },
      ] as const;
    }),
  ];
}

/**
 * Why a fetch failed, with the system code under it when there is one: `fetch failed (ENOTFOUND)`.
 *
 * @param {unknown} error - What `fetch` threw.
 * @returns {string} The reason.
 */
export function fetchFailure(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }
  const code = (error.cause as { readonly code?: unknown } | undefined)?.code;
  return typeof code === "string" ? `${error.message} (${code})` : error.message;
}

/**
 * Reads a body up to `cap` bytes and cancels it past that, so a hostile host can't stream forever.
 *
 * @param {ReadableStream<Uint8Array<ArrayBuffer>>} body - The response body.
 * @param {number} cap - The most bytes to keep.
 * @returns {Promise<Uint8Array<ArrayBuffer> | undefined>} The bytes, or nothing past the cap.
 */
async function readCapped(
  body: ReadableStream<Uint8Array<ArrayBuffer>>,
  cap: number,
): Promise<Uint8Array<ArrayBuffer> | undefined> {
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  for await (const chunk of body) {
    size += chunk.length;
    if (size > cap) {
      return undefined;
    }
    chunks.push(chunk);
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  return data;
}

/**
 * Fetches one copy of at most `cap` bytes.
 *
 * @param {string} url - Where the copy lives.
 * @param {number} cap - The most bytes the caller takes.
 * @returns {Promise<Uint8Array<ArrayBuffer> | string>} The bytes, or why there are none.
 */
async function fetchCopy(url: string, cap: number): Promise<Uint8Array<ArrayBuffer> | string> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!response.ok) {
      return `HTTP ${response.status}`;
    }
    const data = response.body === null ? new Uint8Array(0) : await readCapped(response.body, cap);
    return data ?? `more than ${cap} bytes`;
  } catch (error) {
    return fetchFailure(error);
  }
}

/**
 * Reads a file from the first copy that answers with the bytes the record pins.
 *
 * @param {PuzzleFile} file - The file.
 * @param {number} [limit] - The most bytes to return; the CLI writes to a file and takes any.
 * @returns {Promise<FileContent>} The bytes, their digest and the URL that served them.
 * @throws {FileUnavailableError} When the file is too large, or no copy holds its bytes.
 */
export async function readPuzzleFile(
  file: PuzzleFile,
  limit = MAX_FILE_BYTES,
): Promise<FileContent> {
  if (file.bytes !== undefined && file.bytes > limit) {
    throw new FileUnavailableError(file.path, [
      `${file.bytes} bytes is more than the ${limit} a read returns, so download it from ${file.url}`,
    ]);
  }
  const cap = Math.min(limit, file.bytes ?? limit);
  const linked = await readCopy(file, file.url, cap);
  if (typeof linked !== "string") {
    return linked;
  }
  const reasons = [linked];
  for (const url of laterCopies(file, linked === `${file.url} answered HTTP 404`)) {
    const content = await readCopy(file, url, cap);
    if (typeof content !== "string") {
      return content;
    }
    reasons.push(content);
  }
  throw new FileUnavailableError(file.path, reasons);
}

/**
 * Whether a copy's size and digest are what the record pins; an unpinned file takes any.
 *
 * @param {PuzzleFile} file - The file.
 * @param {number} bytes - The copy's size.
 * @param {string} digest - The copy's SHA-256 in hex.
 * @returns {boolean} Whether the copy is the file.
 */
function holdsPin(file: PuzzleFile, bytes: number, digest: string): boolean {
  return file.sha256 === undefined || (digest === file.sha256 && bytes === file.bytes);
}

/**
 * One copy's bytes when they are the file, or why they are not.
 *
 * @param {PuzzleFile} file - The file.
 * @param {string} url - Where the copy lives.
 * @param {number} cap - The most bytes to take.
 * @returns {Promise<FileContent | string>} The content, or the reason with the URL in front.
 */
async function readCopy(file: PuzzleFile, url: string, cap: number): Promise<FileContent | string> {
  const data = await fetchCopy(url, cap);
  if (typeof data === "string") {
    return `${url} answered ${data}`;
  }
  const digest = hex.encode(new Uint8Array(await crypto.subtle.digest("SHA-256", data)));
  if (holdsPin(file, data.length, digest)) {
    return { data, file, servedBy: url, sha256: digest };
  }
  return `${url} holds other bytes, ${data.length} with SHA-256 ${digest}`;
}

/**
 * The copies after the one the link names: `main` only when that ref has no such file, since a
 * timeout or a 5xx says nothing about it, then for a pinned file the author's URL and the archive.
 *
 * @param {PuzzleFile} file - The file.
 * @param {boolean} unreleased - Whether the linked ref answered 404.
 * @returns {string[]} The URLs.
 */
function laterCopies(file: PuzzleFile, unreleased: boolean): string[] {
  const main = unreleased ? [assetUrlOf(file.path, "main")] : [];
  const author = file.sha256 === undefined ? [] : [file.origin, file.archive];
  return [...main, ...author].filter((url) => url !== undefined);
}

/**
 * The image type the bytes start with, among the ones a model takes.
 *
 * @param {Uint8Array} data - The file's bytes.
 * @returns {string | undefined} The MIME type, or nothing for anything else.
 */
export function imageType(data: Uint8Array): string | undefined {
  const riff = String.fromCodePoint(...data.subarray(0, 4), ...data.subarray(8, 12));
  if (riff === "RIFFWEBP") {
    return "image/webp";
  }
  return IMAGE_SIGNATURES.find(([, signature]) =>
    signature.every((byte, index) => data[index] === byte),
  )?.[0];
}

/**
 * The bytes as text, when they are valid UTF-8.
 *
 * @param {Uint8Array} data - The file's bytes.
 * @returns {string | undefined} The text, or nothing for a binary file.
 */
export function utf8Text(data: Uint8Array): string | undefined {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(data);
  } catch {
    return undefined;
  }
}

/**
 * The size and digest a record pins, or `unpinned` for a record file without them.
 *
 * @param {PuzzleFile} file - The file.
 * @returns {string[]} The columns; none for a reading copy, which is never pinned.
 */
function pinColumns(file: PuzzleFile): string[] {
  if (file.sha256 !== undefined) {
    return [`${file.bytes ?? "-"} bytes`, `sha256 ${file.sha256}`];
  }
  return file.kind === "source" || file.kind === "screenshot" ? [] : ["unpinned"];
}

/**
 * One file as a listing row, marked `(author)` when only the author's record cites it.
 *
 * @param {PuzzleFile} file - The file.
 * @returns {string} The tab-separated row.
 */
function formatFileRow(file: PuzzleFile): string {
  const columns = [
    file.citedBy === "author" ? `${file.kind} (author)` : file.kind,
    file.path,
    ...(file.date === undefined ? [] : [`published ${file.date}`]),
    ...pinColumns(file),
    ...(file.origin === undefined
      ? []
      : [`${file.kind === "source" ? "cites" : "origin"} ${file.origin}`]),
    ...(file.archive === undefined ? [] : [`archive ${file.archive}`]),
  ];
  return columns.join("\t");
}

/**
 * The listing `puzzles assets` and `puzzles_assets` print: a count line, then one row per file.
 *
 * @param {string} id - The puzzle's identifier.
 * @param {readonly PuzzleFile[]} files - What `puzzleFiles()` returned.
 * @returns {string[]} The lines.
 */
export function formatFileReport(id: string, files: readonly PuzzleFile[]): string[] {
  const shipped = files.filter((file) => file.kind !== "source" && file.kind !== "screenshot");
  const copies = files.filter((file) => file.kind === "source");
  if (files.length === 0) {
    return [`${id}: no files and no archived sources`];
  }
  return [
    `${id}: ${countOf(shipped.length, "file")}, ${countOf(copies.length, "archived source")}`,
    ...files.map(formatFileRow),
  ];
}

/**
 * The line above a file's content: size, digest, whether the record pins it, and who served it.
 *
 * @param {FileContent} content - What `readPuzzleFile()` returned.
 * @returns {string} The tab-separated line.
 */
export function formatFileRead(content: FileContent): string {
  const { data, file, servedBy } = content;
  const check = file.sha256 === undefined ? "unpinned" : "the bytes the record pins";
  return [
    file.path,
    `${data.length} bytes`,
    `sha256 ${content.sha256}`,
    check,
    `from ${servedBy}`,
  ].join("\t");
}

/**
 * The file's content as a model takes it: an image block for an image, a text block for UTF-8.
 *
 * @param {FileContent} content - What `readPuzzleFile()` returned.
 * @returns {FileBlock} The block.
 * @throws {InvalidArgumentError} When the bytes are neither, which no model reads.
 */
export function fileBlock(content: FileContent): FileBlock {
  const mimeType = imageType(content.data);
  if (mimeType !== undefined) {
    return { type: "image", data: base64.encode(content.data), mimeType };
  }
  const text = utf8Text(content.data);
  if (text === undefined) {
    throw new InvalidArgumentError(
      "file",
      `${content.file.path} is neither an image a model reads nor UTF-8 text, so download it from ${content.servedBy}`,
    );
  }
  return { type: "text", text };
}
