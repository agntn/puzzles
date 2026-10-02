import { oneLine } from "../core/text.ts";

export { oneLine };

/**
 * Writes one line of command output to standard output.
 *
 * @param {string} value - Line to print.
 */
export function printLine(value: string): void {
  process.stdout.write(`${value}\n`);
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

/** The `--json` flag shared by every command that can print machine-readable output. */
export const jsonArg = {
  json: { type: "boolean", description: "Print machine-readable JSON" },
} as const;
