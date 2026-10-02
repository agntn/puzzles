import { diffArchivedContent, WaybackProvider, type ArchivedContent } from "@agntn/archives";
import { SourceLookupError } from "./errors.ts";

/**
 * Wayback reads for `watch()`. The module loads only when a caller asks about source pages, so
 * `@agntn/archives` stays out of the package's load path like the explorers do.
 */

/** One archive capture of a source page. */
export interface Capture {
  /** Playback URL of the capture. */
  readonly snapshot: string;

  /** When the archive took it, as ISO 8601. */
  readonly timestamp: string;
}

/** A source page whose newest capture reads differently from the last one before the cutoff. */
export interface SourceChange {
  /** Lines the newer capture adds, in the text rendering. */
  readonly additions: number;

  /** The newest capture. */
  readonly after: Capture;

  /** The last capture at or before the cutoff. */
  readonly before: Capture;

  /** Lines the newer capture drops. */
  readonly deletions: number;

  /** Whether either body was cut off before the comparison. */
  readonly partial: boolean;

  /** The source page. */
  readonly url: string;
}

/**
 * Reads one capture, the newest at or before `timestamp`, or the newest of all without it.
 *
 * @param {Readonly<WaybackProvider>} wayback - The archive.
 * @param {string} url - The source page.
 * @param {number | undefined} timeout - Request timeout in milliseconds.
 * @param {string} [timestamp] - The newest moment the capture may come from.
 * @returns {Promise<ArchivedContent>} The capture and its body.
 */
async function capture(
  wayback: Readonly<WaybackProvider>,
  url: string,
  timeout: number | undefined,
  timestamp?: string,
): Promise<ArchivedContent> {
  const response = await wayback.content(url, {
    ...(timestamp === undefined ? {} : { timestamp }),
    ...(timeout === undefined ? {} : { timeout }),
  });
  if (!response.success || response.content === undefined) {
    throw new SourceLookupError(`Source lookup failed: ${response.error ?? "no capture"}`);
  }
  return response.content;
}

/**
 * Compares the newest Wayback capture of a source page with the last one at or before `since`.
 * A page with no capture after `since`, or none before it, has nothing to compare.
 *
 * @param {string} url - The source page.
 * @param {Readonly<Date>} since - The cutoff.
 * @param {number} [timeout] - Request timeout in milliseconds; Wayback waits 60 seconds by default.
 * @returns {Promise<SourceChange | undefined>} The change, or nothing when the page reads the same.
 */
export async function sourceChange(
  url: string,
  since: Readonly<Date>,
  timeout?: number,
): Promise<SourceChange | undefined> {
  const wayback = new WaybackProvider();
  const after = await capture(wayback, url, timeout);
  if (Date.parse(after.timestamp) <= since.getTime()) {
    return undefined;
  }
  const before = await capture(wayback, url, timeout, since.toISOString());
  if (Date.parse(before.timestamp) >= Date.parse(after.timestamp)) {
    return undefined;
  }
  let diff: ReturnType<typeof diffArchivedContent>;
  try {
    diff = diffArchivedContent(before, after);
  } catch (error) {
    throw new SourceLookupError(
      `Source comparison failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (diff.identical) {
    return undefined;
  }
  return {
    url,
    before: { timestamp: before.timestamp, snapshot: before.snapshot },
    after: { timestamp: after.timestamp, snapshot: after.snapshot },
    additions: diff.additions,
    deletions: diff.deletions,
    partial: diff.partial,
  };
}
