import type { CollectionSummary } from "./dataset.ts";
import { InvalidArgumentError } from "./errors.ts";
import {
  type Confirmation,
  type Entropy,
  type EntropySource,
  type Hint,
  type KeyData,
  type Party,
  type Passphrase,
  type Pubkey,
  type RedeemScript,
  type Secret,
  type Seed,
  secretOf,
  type Shares,
  type Wif,
} from "./parts.ts";
import { type Puzzle, Status } from "./puzzle.ts";

/**
 * Serializes a value as JSON, rendering `bigint` balances as decimal strings.
 *
 * @param {unknown} value - Value to serialize.
 * @param {unknown} [compact] - Whether to omit indentation.
 * @returns {string} JSON text.
 */
export function toJson(value: unknown, compact = false): string {
  return JSON.stringify(
    value,
    (_key, item: unknown) => (typeof item === "bigint" ? item.toString() : item),
    compact ? undefined : 2,
  );
}

/**
 * Formats a prize for display: `0.001 BTC`, or a dash when none is recorded.
 *
 * @param {number | undefined} prize - The prize amount, when the record has one.
 * @param {string} currency - The prize currency.
 * @returns {string} The amount and currency, or `-`.
 */
export function formatPrize(prize: number | undefined, currency: string): string {
  return prize === undefined ? "-" : `${prize} ${currency}`;
}

/**
 * Sums prizes per currency, rounded to the eight places every chain here settles in, so a
 * float carry never prints as `1058.0688491299998`.
 *
 * @param {readonly Puzzle[]} puzzles - The puzzles to sum over.
 * @returns {Record<string, number>} Amounts per currency, in first-seen order.
 */
export function prizeTotals(puzzles: readonly Puzzle[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const puzzle of puzzles) {
    const prize = puzzle.prize();
    if (prize === undefined) continue;
    const currency = puzzle.prizeCurrency();
    totals[currency] = Number(((totals[currency] ?? 0) + prize).toFixed(8));
  }
  return totals;
}

/**
 * Formats per currency totals: `1008.52911 BTC` or `1000 AR, 1 ETH`, a dash when empty.
 *
 * @param {Readonly<Record<string, number>>} totals - Amounts per currency.
 * @returns {string} The amounts joined for display.
 */
export function formatPrizeTotals(totals: Readonly<Record<string, number>>): string {
  const entries = Object.entries(totals);
  return entries.length === 0
    ? "-"
    : entries.map(([currency, amount]) => `${amount} ${currency}`).join(", ");
}

/**
 * Formats a puzzle as one tab-separated summary line.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {string} Identifier, status, prize and address separated by tabs.
 */
export function formatPuzzle(puzzle: Puzzle): string {
  return `${puzzle.id()}\t${puzzle.status()}\t${formatPrize(puzzle.prize(), puzzle.prizeCurrency())}\t${puzzle.address().value}`;
}

/**
 * `label: value` as one line, or no line when the record has no value for it.
 *
 * @param {string} label - The field name.
 * @param {T | undefined} value - The field value, when the record has one.
 * @param {(value: T) => string} [format] - Renders the value; `String` by default.
 * @returns {string[]} The line, or nothing.
 */
function field<T>(
  label: string,
  value: T | undefined,
  format: (value: T) => string = String,
): string[] {
  return value === undefined ? [] : [`${label}: ${format(value)}`];
}

function formatSecret(secret: Secret | undefined): string {
  if (secret === undefined) {
    return "unknown";
  }
  switch (secret.kind) {
    case "hex":
      return `${secret.hex} (hex)`;
    case "wif":
      return `${secret.wif} (wif)`;
    case "encrypted":
      return `${secret.encrypted} (bip38)`;
    case "seed":
      return `${secret.phrase} (seed phrase)`;
    case "mini":
      return `${secret.mini} (mini)`;
  }
}

/**
 * The WIF forms and the mini key, minus the one the private key line already printed.
 *
 * @param {KeyData} key - The serialized key material.
 * @param {Secret["kind"] | undefined} secret - The kind the private key line printed.
 * @returns {string[]} One line per remaining form.
 */
function wifLines(key: KeyData, secret: Secret["kind"] | undefined): string[] {
  const wif: Partial<Wif> = key.wif ?? {};
  return [
    ...field("wif", secret === "wif" ? undefined : wif.decrypted),
    ...field("encrypted wif", secret === "encrypted" ? undefined : wif.encrypted, bip38),
    ...field("passphrase", wif.passphrase),
    ...field("salt", wif.salt),
    ...field("mini key", secret === "mini" ? undefined : key.mini),
  ];
}

function bip38(payload: string): string {
  return `${payload} (bip38)`;
}

/**
 * `value (note)`, or the value alone when there is no note.
 *
 * @param {string} value - The value.
 * @param {string | undefined} note - The note, when the record has one.
 * @returns {string} The value with the note in parentheses.
 */
function withNote(value: string, note: string | undefined): string {
  return note === undefined ? value : `${value} (${note})`;
}

function formatEntropy(entropy: Entropy): string {
  const source: Partial<EntropySource> = entropy.source ?? {};
  const from = source.url === undefined ? "" : ` from ${source.url}`;
  return withNote(`${entropy.hash}${from}`, source.description);
}

function formatPassphrase(passphrase: Passphrase): string {
  return passphrase === "Required" ? "required" : passphrase.Known;
}

function formatShares(shares: Shares): string {
  const published = shares.shares.map((share) => `${share.index} "${share.data}"`);
  return `${published.length} of ${shares.total} published, ${shares.threshold} needed: ${published.join("; ")}`;
}

function seedLines(key: KeyData, secret: Secret["kind"] | undefined): string[] {
  const seed: Partial<Seed> = key.seed ?? {};
  const entropy = seed.entropy;
  return [
    ...field("seed phrase", secret === "seed" ? undefined : seed.phrase),
    ...field("derivation path", seed.path),
    ...field("xpub", seed.xpub),
    ...field("entropy", entropy, formatEntropy),
    ...field("seed passphrase", entropy?.passphrase, formatPassphrase),
    ...field("shares", key.shares, formatShares),
  ];
}

/**
 * The private key line always prints, so an unknown key says so, and the other forms follow.
 *
 * @param {KeyData | undefined} key - The serialized key material, when the record has any.
 * @returns {string[]} The key lines.
 */
function keyLines(key: KeyData | undefined): string[] {
  const secret = secretOf(key);
  const lines = [`private key: ${formatSecret(secret)}`];
  const kind = secret?.kind;
  return key === undefined ? lines : [...lines, ...wifLines(key, kind), ...seedLines(key, kind)];
}

function formatPubkey(pubkey: Pubkey | undefined): string {
  return pubkey === undefined ? "unknown" : `${pubkey.value} (${pubkey.format})`;
}

function formatRedeemScript(script: RedeemScript): string {
  return `${script.script} (hash ${script.hash})`;
}

function formatParty(party: Party): string {
  const profiles = (party.profiles ?? []).map((item) => `${item.name} ${item.url}`);
  return [party.name, ...profiles, ...(party.addresses ?? [])]
    .filter((item) => item !== undefined)
    .join(", ");
}

function formatSolved(date: string, duration: string | undefined): string {
  return withNote(date, duration);
}

function formatRange(range: readonly [bigint, bigint], bits: number | undefined): string {
  const width = bits === undefined ? "" : bits === 1 ? ", 1 bit" : `, ${bits} bits`;
  return `${range[0].toString(16)}..${range[1].toString(16)} (hex${width})`;
}

/**
 * The transaction count, then one tab-separated line per transaction in record order.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {string[]} The count line and the transaction lines.
 */
function formatTransactions(puzzle: Puzzle): string[] {
  const currency = puzzle.prizeCurrency();
  const transactions = puzzle.transactions();
  return [
    `transactions: ${transactions.length}`,
    ...transactions.map(
      (item) => `\t${item.tx_type}\t${item.date}\t${item.amount} ${currency}\t${item.txid}`,
    ),
  ];
}

/**
 * Every asset as a URL, the hint files and the solver's notes under the same root as the puzzle
 * image.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {string[]} The asset lines.
 */
function formatAssets(puzzle: Puzzle): string[] {
  const assets = puzzle.assets();
  if (assets === undefined) {
    return [];
  }
  const links = puzzle.assetLinks();
  const hints = links.filter((link) => link.kind === "hint").map((link) => link.url);
  return [
    ...field("asset", puzzle.assetUrl()),
    ...field("hint assets", hints.length === 0 ? undefined : hints, (list) => list.join(", ")),
    ...field("solver asset", links.find((link) => link.kind === "solver")?.url),
    ...field("asset source", assets.source_url),
  ];
}

function formatConfirmation(confirmation: Confirmation): string {
  return withNote(confirmation.url, confirmation.description);
}

/**
 * One tab-separated line per hint: its kind, its date or a dash, the text, then the source and
 * what confirms it as `label: value` pairs, so the two URLs stay apart.
 *
 * @param {Hint} hint - The hint.
 * @returns {string} The line.
 */
function formatHint(hint: Hint): string {
  return `\t${hint.kind}\t${hint.date ?? "-"}\t${hint.text}\tsource: ${hint.source}\tconfirmation: ${formatConfirmation(hint.confirmation)}`;
}

/**
 * The hint count under its label, then one line per hint in record order, or nothing for an
 * empty list.
 *
 * @param {string} label - `collection hints` for the inherited ones, `hints` for the puzzle's own.
 * @param {readonly Hint[]} hints - The hints.
 * @returns {string[]} The count line and the hint lines.
 */
function formatHints(label: string, hints: readonly Hint[]): string[] {
  return hints.length === 0 ? [] : [`${label}: ${hints.length}`, ...hints.map(formatHint)];
}

/**
 * The hint blocks `puzzles_show` and `puzzles_hints` share: the collection's under
 * `collection hints`, then the puzzle's own under `hints`, each block only when it has any.
 *
 * @param {readonly Hint[]} inherited - The hints of the puzzle's collection.
 * @param {readonly Hint[]} own - The puzzle's own hints.
 * @returns {string[]} The lines, empty when neither list has a hint.
 */
function formatHintBlocks(inherited: readonly Hint[], own: readonly Hint[]): string[] {
  return [...formatHints("collection hints", inherited), ...formatHints("hints", own)];
}

/**
 * The lines `puzzles hints` and `puzzles_hints` print: `id: N hints`, or `id: no hints recorded`,
 * then the blocks of `formatHintBlocks`.
 *
 * @param {string} id - Universal puzzle identifier.
 * @param {readonly Hint[]} inherited - The hints of the puzzle's collection.
 * @param {readonly Hint[]} own - The puzzle's own hints.
 * @returns {string[]} The header, then the hint lines.
 */
export function formatHintReport(
  id: string,
  inherited: readonly Hint[],
  own: readonly Hint[],
): string[] {
  const count = inherited.length + own.length;
  const header =
    count === 0 ? `${id}: no hints recorded` : `${id}: ${count} ${count === 1 ? "hint" : "hints"}`;
  return [header, ...formatHintBlocks(inherited, own)];
}

/**
 * Formats a puzzle as the lines `puzzles_show` prints: the summary row, then every field the
 * record has as `name: value`, so a client that only sees the text still has the record. The
 * hints the collection shares print as `collection hints` ahead of the puzzle's own.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {readonly Hint[]} [inherited] - The hints of the puzzle's collection.
 * @returns {string} The record as lines.
 */
export function formatPuzzleRecord(puzzle: Puzzle, inherited: readonly Hint[] = []): string {
  const address = puzzle.address();
  const key = puzzle.keyData();
  const bits = key?.bits;
  return [
    formatPuzzle(puzzle),
    `chain: ${puzzle.chain()}  address kind: ${address.kind}`,
    ...field("hash160", address.hash160),
    ...field("redeem script", address.redeem_script, formatRedeemScript),
    `public key: ${formatPubkey(puzzle.pubkey())}`,
    ...keyLines(key),
    `started: ${puzzle.startedAt()}`,
    ...field("solved", puzzle.solvedAt(), (date) =>
      formatSolved(date, puzzle.formattedSolveTime()),
    ),
    ...field("solver", puzzle.solver(), formatParty),
    ...(puzzle.preGenesis() ? ["pre-genesis: yes"] : []),
    ...formatTransactions(puzzle),
    ...field("claim", puzzle.claimExplorerUrl()),
    ...formatAssets(puzzle),
    ...formatHintBlocks(inherited, puzzle.hints()),
    `explorer: ${puzzle.explorerUrl()}`,
    `source: ${puzzle.sourceUrl()}`,
    ...field("key range", puzzle.keyRange(), (range) => formatRange(range, bits)),
  ].join("\n");
}

/**
 * Formats a collection summary as the one discovery row the CLI and the tools share.
 *
 * @param {CollectionSummary} summary - The collection summary.
 * @returns {string} `key: N puzzles, N solved, N unsolved, by author`.
 */
export function formatCollection(summary: CollectionSummary): string {
  return `${summary.key}: ${summary.total} puzzles, ${summary.solved} solved, ${summary.unsolved} unsolved, by ${summary.author ?? "unknown"}`;
}

/**
 * Parses a puzzle status filter, throwing on an unknown value.
 *
 * @param {string | undefined} value - Status text from the command line, when given.
 * @returns {Status | undefined} The puzzle status filter.
 */
export function parseStatus(value: string | undefined): Status | undefined {
  if (value === undefined) {
    return undefined;
  }
  const status = Object.values(Status).find((item) => item === value);
  if (status === undefined) {
    throw new InvalidArgumentError("status", `expected one of ${Object.values(Status).join(", ")}`);
  }
  return status;
}

/**
 * Filters puzzles by optional status and public key constraints.
 *
 * @param {readonly Puzzle[]} puzzles - Puzzles to work on.
 * @param {{ readonly status?: Status | undefined; readonly withPubkey?: boolean | undefined }} options - Lookup options.
 * @returns {readonly Puzzle[]} The puzzles that pass every given constraint.
 */
export function filterPuzzles(
  puzzles: readonly Puzzle[],
  options: { readonly status?: Status | undefined; readonly withPubkey?: boolean | undefined },
): readonly Puzzle[] {
  return puzzles.filter(
    (puzzle) =>
      (options.status === undefined || puzzle.status() === options.status) &&
      (options.withPubkey !== true || puzzle.hasPubkey()),
  );
}
