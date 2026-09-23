/**
 * Cuts a text at `max` code points with an ellipsis.
 *
 * @param {string} value - The text.
 * @param {number} max - The most code points to keep, ellipsis included.
 * @returns {string} The text, cut when it was longer.
 */
export function clip(value: string, max: number): string {
  const points = Array.from(value);
  return points.length > max
    ? `${points
        .slice(0, max - 1)
        .join("")
        .trimEnd()}…`
    : value;
}

/**
 * Keeps the head and the tail of a long value: `1BgGZ9tcN4rm…SZ26SAMH`.
 *
 * @param {string} value - The address, key or hash.
 * @param {number} [head] - Characters to keep at the start.
 * @param {number} [tail] - Characters to keep at the end.
 * @returns {string} The value, shortened when it was longer than both parts plus one.
 */
export function shorten(value: string, head = 12, tail = 10): string {
  return value.length > head + tail + 1 ? `${value.slice(0, head)}…${value.slice(-tail)}` : value;
}

/**
 * A shell argument: single quotes unless the value is a plain word.
 *
 * @param {string} value - The argument.
 * @returns {string} The argument as typed on a POSIX shell line.
 */
export function shellArg(value: string): string {
  return /^[\w./:@-]+$/u.test(value) ? value : `'${value.replaceAll("'", `'\\''`)}'`;
}

/**
 * The hostname of a URL for display, `www.` dropped: `bitcointalk.org`.
 *
 * @param {string} url - The URL.
 * @returns {string} The hostname, or the input when it isn't a URL.
 */
export function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./u, "");
  } catch {
    return url;
  }
}

/**
 * The host and path of a URL without scheme, `www.` or a trailing slash: enough to name a link.
 *
 * @param {string} url - The URL to shorten.
 * @returns {string} The host and path, or the input when it doesn't parse.
 */
export function hostPath(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname.replace(/^www\./u, "")}${parsed.pathname.replace(/\/$/u, "")}`;
  } catch {
    return url;
  }
}

/**
 * Host, path and query of a link, the query kept because forum threads live in it.
 *
 * @param {string} url - The link.
 * @returns {string} The link without its scheme, or the input when it doesn't parse.
 */
export function linkText(url: string): string {
  try {
    return `${hostPath(url)}${new URL(url).search}`;
  } catch {
    return url;
  }
}

export { formatPrize, formatPrizeTotals } from "../../../src/core/utils.ts";

/**
 * What the worker put in a 4xx or 5xx: the `data` of a failed `$fetch`, or nothing.
 *
 * @param {unknown} error - Whatever `$fetch` rejected with.
 * @returns {{ statusMessage?: string; message?: string }} The worker's status text and message.
 */
export function fetchErrorData(error: unknown): { statusMessage?: string; message?: string } {
  if (typeof error === "object" && error !== null && "data" in error) {
    return (error.data as { statusMessage?: string; message?: string } | undefined) ?? {};
  }
  return {};
}

/**
 * The three words every panel uses for a verification outcome.
 *
 * @param {boolean} verified - Whether the key derived the address.
 * @param {boolean} unavailable - Whether there was nothing to derive.
 * @returns {string} `verified`, `unverifiable` or `not verified`.
 */
export function verdictLabel(verified: boolean, unavailable: boolean): string {
  if (verified) return "verified";
  return unavailable ? "unverifiable" : "not verified";
}

/**
 * The playground's list form as one CLI line, carrying every argument its tool call carries.
 *
 * @param {{ readonly collection: string; readonly status: string; readonly withPubkey: boolean; readonly limit: string }} form - The form's list fields.
 * @returns {string} The `puzzles list` line to copy.
 */
export function listCommandLine(form: {
  readonly collection: string;
  readonly status: string;
  readonly withPubkey: boolean;
  readonly limit: string;
}): string {
  const parts = ["puzzles list"];
  if (form.collection) parts.push(shellArg(form.collection));
  if (form.status) parts.push(`--status ${form.status}`);
  if (form.withPubkey) parts.push("--with-pubkey");
  if (form.limit.trim() !== "") parts.push(`--limit ${form.limit.trim()}`);
  return parts.join(" ");
}
