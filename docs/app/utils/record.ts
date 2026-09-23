import { shorten } from "./format.ts";
import type { PuzzleView } from "./puzzle-view.ts";
import { addressLiteral, factoryName, statusLiteral } from "./samples.ts";

/**
 * When a record was solved, for a readout row: the date and, when the record has one, how long
 * the solve took. An open puzzle is `not yet`, a closed one without a date `unknown`.
 *
 * @param {PuzzleView} view - The record on screen.
 * @returns {string} `2024-09-12 · 9y 8mo 3d 4h 52m`, `2026-08-17`, `not yet` or `unknown`.
 */
export function solvedText(view: PuzzleView): string {
  if (view.solvedAt === undefined) return view.status === "unsolved" ? "not yet" : "unknown";
  const date = view.solvedAt.slice(0, 10);
  return view.solveTime === undefined ? date : `${date} · ${view.solveTime}`;
}

/**
 * One tick per transaction: money in stays hatched, money out opens in the accent.
 *
 * @param {PuzzleView} view - The record on screen.
 * @returns {("closed" | "open")[]} One entry per transaction, in record order.
 */
export function transactionTicks(view: PuzzleView): ("closed" | "open")[] {
  return view.transactionRows.map((row) =>
    /sweep|claim|decrease/u.test(row.type) ? "open" : "closed",
  );
}

/**
 * One line under the record's name: what it is called, when it started and, when it did, when it
 * was solved, plus how many transactions the record carries.
 *
 * @param {PuzzleView} view - The record on screen.
 * @returns {string} The sentence.
 */
export function recordSentence(view: PuzzleView): string {
  const dates = [`started ${view.startedAt.slice(0, 10)}`];
  if (view.solvedAt !== undefined) dates.push(`solved ${view.solvedAt.slice(0, 10)}`);
  const count = `${view.transactions} ${view.transactions === 1 ? "transaction" : "transactions"}`;
  return `${view.name} · ${dates.join(", ")}. ${count} on record.`;
}

/**
 * The record as its module writes it, in one line: the factory, the address builder, the status
 * when it is not the default and the key builder chain when the record has one.
 *
 * @param {PuzzleView} view - The record on screen.
 * @returns {string} The literal, shortened to what identifies the record.
 */
export function recordLiteral(view: PuzzleView): string {
  const fields = [`address: ${addressLiteral(view)}`];
  if (view.status !== "unsolved") fields.push(`status: ${statusLiteral(view.status)}`);
  if (view.keyLiteral !== undefined) fields.push(`key: ${view.keyLiteral}`);
  return `${factoryName(view.chain)}({\n${fields.map((field) => `  ${field},`).join("\n")}\n})`;
}

export interface LiteralToken {
  readonly text: string;
  readonly cls: string;
}

/**
 * Colors a record literal the way the landing colors its record file: builders and factories as
 * functions, quoted values as strings, field names as keys, numbers as constants. The tokens
 * concatenate back to the input; long quoted values are shortened for the screen only.
 *
 * @param {string} literal - The record literal.
 * @returns {LiteralToken[]} The literal in order, each piece with its class.
 */
export function literalTokens(literal: string): LiteralToken[] {
  const pattern = /"[^"]*"|\b[A-Za-z_]\w*(?=\()|\b[a-z]\w*(?=:)|\bStatus\.\w+|\b\d+\b/gu;
  const tokens: LiteralToken[] = [];
  let last = 0;
  for (const match of literal.matchAll(pattern)) {
    const text = match[0];
    if (match.index > last) tokens.push({ text: literal.slice(last, match.index), cls: "" });
    const cls = text.startsWith('"')
      ? "tok-str"
      : /^\d/u.test(text)
        ? "tok-const"
        : literal[match.index + text.length] === ":"
          ? "tok-key"
          : "tok-fn";
    tokens.push({
      text: text.startsWith('"') ? `"${shorten(text.slice(1, -1), 12, 8)}"` : text,
      cls,
    });
    last = match.index + text.length;
  }
  if (last < literal.length) tokens.push({ text: literal.slice(last), cls: "" });
  return tokens;
}
