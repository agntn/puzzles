import { sanitizeText, type ToolResult } from "@agntn/tools";
import type { CliHost } from "@agntn/tools/cli";
import { oneLine } from "../core/text.ts";

export { oneLine };

/**
 * Writes one line of command output to standard output, cleaned the way `runCli` cleans the rest.
 *
 * @param {string} value - Line to print.
 */
export function printLine(value: string): void {
  process.stdout.write(`${sanitizeText(value)}\n`);
}

/**
 * Writes one line to standard error, so a script keeps stdout for the data. The line echoes an
 * identifier a script may have read from a file, so it goes through `oneLine()` first.
 *
 * @param {string} value - Line to print.
 */
export function printError(value: string): void {
  process.stderr.write(`${oneLine(value)}\n`);
}

/**
 * Lines as the text, data as the details; no lines, no text block, so an empty list prints nothing.
 *
 * @param {readonly string[]} rows - The lines to print.
 * @param {unknown} details - The data behind them.
 * @returns {ToolResult} The answer `runCli` prints.
 */
export function lines(rows: readonly string[], details: unknown): ToolResult {
  return {
    content: rows.length === 0 ? [] : [{ type: "text", text: rows.join("\n") }],
    details,
  };
}

/**
 * Whether the command line asked for text, so rows go out as they land instead of after the pass.
 *
 * @param {unknown} host - The host `runCli` hands to `execute`.
 * @returns {boolean} Whether to print each row at once.
 */
export function streams(host: unknown): boolean {
  const cli = host as CliHost | undefined;
  return cli?.cli === true && !cli.json;
}
