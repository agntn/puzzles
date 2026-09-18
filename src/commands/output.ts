/**
 * Writes one line of command output to standard output.
 *
 * @param {string} value - Line to print.
 */
export function printLine(value: string): void {
  process.stdout.write(`${value}\n`);
}

/**
 * Writes one line to standard error, so a script keeps stdout for the data.
 *
 * @param {string} value - Line to print.
 */
export function printError(value: string): void {
  process.stderr.write(`${value}\n`);
}

/** The `--json` flag shared by every command that can print machine-readable output. */
export const jsonArg = {
  json: { type: "boolean", description: "Print machine-readable JSON" },
} as const;
