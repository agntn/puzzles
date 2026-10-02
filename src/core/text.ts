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
