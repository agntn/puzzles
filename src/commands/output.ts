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
 * identifier a script may have read from a file, so a control byte, a line break or a Unicode
 * separator in it becomes a space and cannot forge a second line or drive the terminal.
 *
 * @param {string} value - Line to print.
 */
export function printError(value: string): void {
  process.stderr.write(`${value.replaceAll(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, " ")}\n`);
}

/** The `--json` flag shared by every command that can print machine-readable output. */
export const jsonArg = {
  json: { type: "boolean", description: "Print machine-readable JSON" },
} as const;
