import type { AuthorEntry } from "./dataset.ts";
import { type Chain, chains, parseChain, sameAddress } from "./chains.ts";
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
import { type AssetLink, type Puzzle, Status } from "./puzzle.ts";

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

/** Writes an amount as a plain decimal, since `String(1e-8)` is `1e-8`. */
const amounts = new Intl.NumberFormat("en-US", { maximumFractionDigits: 20, useGrouping: false });

/**
 * Formats a prize for display: `0.001 BTC`, or a dash when none is recorded.
 *
 * @param {number | undefined} prize - The prize amount, when the record has one.
 * @param {string} currency - The prize currency.
 * @returns {string} The amount and currency, or `-`.
 */
export function formatPrize(prize: number | undefined, currency: string): string {
  return prize === undefined ? "-" : `${amounts.format(prize)} ${currency}`;
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
 * Counts the puzzles in each status, every status listed so a zero reads as a zero.
 *
 * @param {readonly Puzzle[]} puzzles - The puzzles to count.
 * @returns {Readonly<Record<Status, number>>} One count per status.
 */
export function statusCounts(puzzles: readonly Puzzle[]): Readonly<Record<Status, number>> {
  const counts: Record<Status, number> = {
    claimed: 0,
    expired: 0,
    solved: 0,
    swept: 0,
    unsolved: 0,
  };
  for (const puzzle of puzzles) {
    counts[puzzle.status()] += 1;
  }
  return counts;
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
    : entries.map(([currency, amount]) => `${amounts.format(amount)} ${currency}`).join(", ");
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
      (item) =>
        `\t${item.tx_type}\t${item.date}\t${amounts.format(item.amount)} ${currency}\t${item.txid}`,
    ),
  ];
}

/**
 * Every asset as a URL, the hint files and the solution under the same root as the puzzle
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
  return [
    ...field("asset", puzzle.assetUrl()),
    ...formatHintAssets(hintAssets(puzzle)),
    ...field("solution asset", puzzle.assetLinks().find((link) => link.kind === "solution")?.url),
    ...field("asset source", assets.source_url),
  ];
}

/**
 * The hint files a record ships, the hints that came as a file rather than as a line of text.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {readonly AssetLink[]} The hint links, empty when the record ships none.
 */
export function hintAssets(puzzle: Puzzle): readonly AssetLink[] {
  return puzzle.assetLinks().filter((link) => link.kind === "hint");
}

/**
 * The `hint assets` line `puzzles_show` and `puzzles_hints` share: every hint file as a URL, or
 * nothing when the record ships none.
 *
 * @param {readonly AssetLink[]} links - The hint links of the record.
 * @returns {string[]} The line, or an empty list.
 */
function formatHintAssets(links: readonly AssetLink[]): string[] {
  return field("hint assets", links.length === 0 ? undefined : links, (list) =>
    list.map((link) => link.url).join(", "),
  );
}

function formatConfirmation(confirmation: Confirmation | undefined): string {
  return confirmation === undefined
    ? ""
    : `\tconfirmation: ${withNote(confirmation.url, confirmation.description)}`;
}

/**
 * One tab-separated hint with its source and any optional confirmation or published answer.
 *
 * @param {Hint} hint - The hint.
 * @returns {string} The line.
 */
function formatHint(hint: Hint): string {
  const published = hint.answer;
  const answer =
    published === undefined
      ? ""
      : `\tanswer: ${published.text}\tanswer source: ${published.source}${published.date === undefined ? "" : `\tanswer date: ${published.date}`}`;
  return `\t${hint.kind}\t${hint.date ?? "-"}\t${hint.text}\tsource: ${hint.source}${formatConfirmation(hint.confirmation)}${answer}`;
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
 * The lines `puzzles hints` and `puzzles_hints` print: `id: N hints`, `id: N hint assets`, both
 * when the record has both, or `id: no hints recorded`, then the blocks of `formatHintBlocks`
 * and the `hint assets` line `puzzles_show` prints.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {readonly Hint[]} inherited - The hints of the puzzle's collection.
 * @returns {string[]} The header, then the hint lines.
 */
export function formatHintReport(puzzle: Puzzle, inherited: readonly Hint[]): string[] {
  const own = puzzle.hints();
  const assets = hintAssets(puzzle);
  const counts = [
    [inherited.length + own.length, "hint"],
    [assets.length, "hint asset"],
  ] as const;
  const header = counts
    .filter(([count]) => count > 0)
    .map(([count, noun]) => `${count} ${noun}${count === 1 ? "" : "s"}`)
    .join(", ");
  return [
    `${puzzle.id()}: ${header.length === 0 ? "no hints recorded" : header}`,
    ...formatHintBlocks(inherited, own),
    ...formatHintAssets(assets),
  ];
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
 * The count labels of a collection row: solved and unsolved always, then claimed, swept and
 * expired when the collection has any, so a reader can add them up to the total.
 *
 * @param {CollectionSummary} summary - The collection summary.
 * @returns {string[]} `83 solved`, `77 unsolved`, `96 swept`.
 */
export function statusCountLabels(summary: CollectionSummary): string[] {
  return [
    `${summary.solved} solved`,
    `${summary.unsolved} unsolved`,
    ...[Status.Claimed, Status.Swept, Status.Expired]
      .filter((status) => summary[status] > 0)
      .map((status) => `${summary[status]} ${status}`),
  ];
}

/**
 * Formats an author as the one discovery row the CLI and the tools share.
 *
 * @param {AuthorEntry} entry - The author with its collections.
 * @returns {string} `key: name (kind), N collections: a, b, N puzzles`.
 */
export function formatAuthor(entry: AuthorEntry): string {
  const { author } = entry;
  const kind = author.kind === undefined ? "" : ` (${author.kind})`;
  const collections =
    entry.collections.length === 1 ? "1 collection" : `${entry.collections.length} collections`;
  return `${entry.key}: ${author.name ?? "unknown"}${kind}, ${collections}: ${entry.collections.join(", ")}, ${entry.puzzles} puzzles`;
}

/**
 * The lines of one author record block: a count line, then one indented line per item.
 *
 * @param {string} label - The block name.
 * @param {readonly T[]} items - The block's items.
 * @param {(item: T) => string} line - How one item prints.
 * @returns {string[]} `label: N` followed by the items, tab indented.
 */
function authorBlock<T>(
  label: string,
  items: readonly T[] | undefined,
  line: (item: T) => string,
): string[] {
  return [`${label}: ${items?.length ?? 0}`, ...(items ?? []).map((item) => `\t${line(item)}`)];
}

/**
 * One author's complete record for a model: identity, collections, channels, addresses and the
 * sourced facts, one per line with its date and source.
 *
 * @param {AuthorEntry} entry - The author with its collections.
 * @returns {string} The record as lines.
 */
export function formatAuthorRecord(entry: AuthorEntry): string {
  const { author } = entry;
  return [
    `${entry.key}\t${author.name ?? "unknown"}\t${author.kind ?? "kind unknown"}`,
    `collections: ${entry.collections.join(", ")} (${entry.puzzles} puzzles)`,
    ...field("aliases", author.aliases, (aliases) => aliases.join(", ")),
    ...field("about", author.about),
    ...authorBlock("profiles", author.profiles, (link) => `${link.name}\t${link.url}`),
    ...authorBlock("addresses", author.addresses, (address) => address),
    ...authorBlock(
      "facts",
      author.facts,
      (item) => `${item.date ?? "-"}\t${item.text}\tsource: ${item.source}`,
    ),
  ].join("\n");
}

/**
 * Formats a collection summary as the one discovery row the CLI and the tools share.
 *
 * @param {CollectionSummary} summary - The collection summary.
 * @returns {string} `key: N puzzles, N solved, N unsolved, N swept, by author`.
 */
export function formatCollection(summary: CollectionSummary): string {
  return `${summary.key}: ${summary.total} puzzles, ${statusCountLabels(summary).join(", ")}, by ${summary.author ?? "unknown"}`;
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
 * Parses a chain filter, throwing on a value no supported chain answers to. A key, a display
 * name, a symbol and a `@agntn/chains` alias all resolve, so `bitcoin`, `Bitcoin` and `BTC` name
 * the same chain. Anything that is not a string is a rejected filter, not a `TypeError`, because
 * a host may hand the executors whatever a model wrote.
 *
 * @param {string | undefined} value - Chain text from a caller, when given.
 * @returns {Chain | undefined} The chain filter.
 */
export function requireChain(value: string | undefined): Chain | undefined {
  if (value === undefined) {
    return undefined;
  }
  const chain = typeof value === "string" ? parseChain(value) : undefined;
  if (chain === undefined) {
    throw new InvalidArgumentError("chain", `expected one of ${chains.join(", ")}`);
  }
  return chain;
}

/**
 * Whether a puzzle's target address is the one a caller asked about. Each record is compared on
 * its own chain's terms, so a checksummed Ethereum address and an uppercased bech32 one both find
 * their puzzle. Anything that is not a string matches nothing, because a host may hand the
 * executors whatever a model wrote.
 *
 * @param {Puzzle} puzzle - Puzzle whose target address is weighed.
 * @param {string} address - Address text from a caller.
 * @returns {boolean} `true` when the puzzle pays to that address.
 */
function addressMatches(puzzle: Puzzle, address: string): boolean {
  return (
    typeof address === "string" && sameAddress(puzzle.chain(), puzzle.address().value, address)
  );
}

/**
 * Filters puzzles by optional address, chain, status and public key constraints.
 *
 * @param {readonly Puzzle[]} puzzles - Puzzles to work on.
 * @param {{ readonly address?: string | undefined; readonly chain?: Chain | undefined; readonly status?: Status | undefined; readonly withPubkey?: boolean | undefined }} options - Lookup options.
 * @returns {readonly Puzzle[]} The puzzles that pass every given constraint.
 */
export function filterPuzzles(
  puzzles: readonly Puzzle[],
  options: {
    readonly address?: string | undefined;
    readonly chain?: Chain | undefined;
    readonly status?: Status | undefined;
    readonly withPubkey?: boolean | undefined;
  },
): readonly Puzzle[] {
  return puzzles.filter(
    (puzzle) =>
      (options.address === undefined || addressMatches(puzzle, options.address)) &&
      (options.chain === undefined || puzzle.chain() === options.chain) &&
      (options.status === undefined || puzzle.status() === options.status) &&
      (options.withPubkey !== true || puzzle.hasPubkey()),
  );
}
