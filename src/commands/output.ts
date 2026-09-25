/**
 * Writes one line of command output to standard output.
 *
 * @param {string} value - Line to print.
 */
export function printLine(value: string): void {
  process.stdout.write(`${value}\n`);
}

/**
 * Turns a control byte, a line break or a Unicode separator into a space, so text a command did
 * not write itself, an identifier read from a file or a provider's error, cannot forge a second
 * line or drive the terminal.
 *
 * @param {string} value - Text to print.
 * @returns {string} The same text on one line.
 */
export function oneLine(value: string): string {
  return value.replaceAll(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, " ");
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
