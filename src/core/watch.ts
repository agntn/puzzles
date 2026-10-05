import { BalanceError, type BalanceOptions, HISTORY_LIMIT } from "./balance.ts";
import { type Chain, chainDecimals, chainSymbol } from "./chains.ts";
import { InvalidArgumentError, SourceLookupError } from "./errors.ts";
import { AddressKind, defined } from "./parts.ts";
import type { ChainTransaction } from "./providers.ts";
import type { Puzzle } from "./puzzle.ts";
import type { SourceChange } from "./sources.ts";
import { Status } from "./status.ts";
import { oneLine } from "./text.ts";
import { type Balance, formatUnits } from "./types.ts";
import { decimal } from "./utils.ts";

/** Options for `watcher()`: the explorer options, plus the cutoff that turns on source checks. */
export interface WatchOptions extends BalanceOptions {
  /**
   * Also compare each source page's newest Wayback capture with the last one at or before this
   * moment, `YYYY-MM-DD` or ISO 8601. Without it only the chain is checked.
   */
  readonly since?: string | undefined;
}

/** A transaction on a prize address that the record doesn't list. */
export interface TransactionFinding extends ChainTransaction {
  /** `deposit` or `spend` by direction, `transaction` when the explorer names neither. */
  readonly kind: "deposit" | "spend" | "transaction";
}

/** An unsolved puzzle whose prize addresses hold something other than the recorded prize. */
export interface BalanceFinding {
  readonly kind: "balance";

  /** What the prize addresses hold now, unconfirmed movement included, in base units. */
  readonly balance: bigint;

  /** The recorded prize in whole units, every digit the record keeps. */
  readonly prize: string;
}

/** A key a spend from an unsolved target showed that the record lacks or spells otherwise. */
export interface PubkeyFinding {
  readonly kind: "pubkey";

  /** The target address that spent. */
  readonly address: string;

  /** The key the spend showed, in hex. */
  readonly pubkey: string;

  /** The key the record holds instead, when it holds one. */
  readonly recorded?: string;

  /** The spend that showed the key. */
  readonly txid: string;
}

/** A source page that changed after the cutoff. */
export interface SourceFinding extends SourceChange {
  readonly kind: "source";
}

/** One difference between the record and what the chain or the archive says now. */
export type Finding = TransactionFinding | BalanceFinding | PubkeyFinding | SourceFinding;

/** What one watch pass found for one puzzle. */
export interface WatchReport {
  /** Chain of the puzzle, which names the coin of every amount. */
  readonly chain: Chain;

  /** Checks that could not run, each as its error message. */
  readonly errors: readonly string[];

  /** Every difference found: transactions oldest first, then the balance, the key, the source. */
  readonly findings: readonly Finding[];

  /** Puzzle identifier. */
  readonly id: string;

  /** Prize addresses with more transactions than a watch reads; their older ones went unchecked. */
  readonly truncated: readonly string[];
}

/** One puzzle's check within a watch pass, with an optional provider key for its chain. */
export type Watch = (puzzle: Puzzle, apiKey?: string) => Promise<WatchReport>;

/**
 * Reads a cutoff as a moment, rejecting text `Date.parse` would guess at or roll over, such as
 * `2026-02-30`.
 *
 * @param {string} since - `YYYY-MM-DD` or an ISO 8601 date and time with its offset.
 * @returns {Date} The cutoff.
 */
export function parseSince(since: string): Date {
  const day =
    /^(\d{4}-\d{2}-\d{2})(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/u.exec(
      since,
    )?.[1];
  const midnight = day === undefined ? Number.NaN : Date.parse(`${day}T00:00:00Z`);
  const time = Date.parse(since);
  if (
    Number.isNaN(midnight) ||
    Number.isNaN(time) ||
    new Date(midnight).toISOString().slice(0, 10) !== day
  ) {
    throw new InvalidArgumentError("since", "expected YYYY-MM-DD or an ISO 8601 date and time");
  }
  return new Date(time);
}

/**
 * The record's txids in the case the explorers write them, so `0xAB…` and `0xab…` are one.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {Set<string>} Every recorded txid, lowercased.
 */
function recordedTxids(puzzle: Puzzle): Set<string> {
  return new Set(puzzle.transactions().map((transaction) => transaction.txid.toLowerCase()));
}

/**
 * Oldest first, with the unconfirmed ones last, the order a record lists transactions in.
 *
 * @param {Readonly<TransactionFinding>} left - One finding.
 * @param {Readonly<TransactionFinding>} right - Another.
 * @returns {number} Their order.
 */
function chronological(left: Readonly<TransactionFinding>, right: Readonly<TransactionFinding>) {
  return (
    Number(left.pending) - Number(right.pending) ||
    (left.date ?? "").localeCompare(right.date ?? "")
  );
}

/** What the record lacks among the transactions read, the addresses read only in part, and why. */
interface Unrecorded {
  readonly failures: string[];
  readonly findings: TransactionFinding[];

  /** Whether the target address spent, or kept part of its history unread. */
  readonly spent: boolean;

  readonly truncated: string[];
}

/** What a history read that failed stands for: nothing read, so nothing to compare. */
const nothingRead: Unrecorded = { failures: [], findings: [], spent: false, truncated: [] };

/**
 * The transactions on the prize addresses the record lacks. Incoming calls that move no coin stay
 * out; a spend always counts, since even an empty one can reveal the public key.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {BalanceOptions} options - Explorer options.
 * @returns {Promise<Unrecorded>} The unrecorded transactions, oldest first, and the cut addresses.
 */
async function unrecorded(puzzle: Puzzle, options: BalanceOptions): Promise<Unrecorded> {
  const { lookupHistory } = await import("./providers.ts");
  const recorded = recordedTxids(puzzle);
  const kinds = { in: "deposit", out: "spend" } as const;
  const histories = await lookupHistory(puzzle, options);
  const target = puzzle.address().value;
  return {
    failures: histories.flatMap(({ failure }) => (failure === undefined ? [] : [failure])),
    findings: histories
      .flatMap((history) => history.transactions)
      .filter(
        (transaction) =>
          !recorded.has(transaction.txid.toLowerCase()) &&
          (transaction.direction === "out" || transaction.amount > 0n),
      )
      .map((transaction): TransactionFinding => ({
        ...transaction,
        kind: transaction.direction === undefined ? "transaction" : kinds[transaction.direction],
      }))
      .toSorted(chronological),
    spent: histories.some(
      (history) =>
        history.address === target &&
        (!history.complete ||
          history.transactions.some((transaction) => transaction.direction !== "in")),
    ),
    truncated: histories
      .filter((history) => !history.complete && history.failure === undefined)
      .map(({ address }) => address),
  };
}

/**
 * The prize when the balance should still equal it: an unsolved puzzle whose prize is recorded in
 * the chain's own coin.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {number | undefined} The expected balance in whole units, when there is one.
 */
export function expectedPrize(puzzle: Puzzle): number | undefined {
  const prize = puzzle.prize();
  return puzzle.status() === Status.Unsolved && puzzle.currency() === undefined ? prize : undefined;
}

/**
 * Compares a balance with the prize at the precision the record keeps: a prize is a double, so
 * `8.612541554256945` ETH stands for every wei amount that rounds to it.
 *
 * @param {Balance} balance - What the prize addresses hold.
 * @param {number} prize - The recorded prize, in whole units.
 * @returns {boolean} Whether the balance reads as the prize.
 */
export function holdsPrize(balance: Balance, prize: number): boolean {
  return Number(balance.totalAmount()) === prize;
}

/**
 * Reads the prize addresses and compares what they hold with the recorded prize.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {number} prize - The prize the balance should still equal.
 * @param {BalanceOptions} explorer - Explorer options.
 * @returns {Promise<Finding[]>} A balance finding, or none when the addresses hold the prize.
 */
async function balanceFindings(
  puzzle: Puzzle,
  prize: number,
  explorer: BalanceOptions,
): Promise<Finding[]> {
  const balance = await puzzle.balance(explorer);
  return holdsPrize(balance, prize)
    ? []
    : [{ kind: "balance", balance: balance.total(), prize: decimal(prize) }];
}

/** Address kinds whose spend shows one key, P2SH for the P2WPKH it may wrap. */
const keyedKinds: readonly string[] = [AddressKind.P2PKH, AddressKind.P2WPKH, AddressKind.P2SH];

/**
 * Whether to ask for the key: a target that never spent has none on chain, so it costs nothing.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {boolean} spent - Whether the history read saw the target spend, or missed some of it.
 * @returns {boolean} Whether to ask the explorer for the key.
 */
function asksPubkey(puzzle: Puzzle, spent: boolean): boolean {
  return spent && puzzle.status() === Status.Unsolved && keyedKinds.includes(puzzle.address().kind);
}

/**
 * Compares the key the target's spend showed with the record's.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {BalanceOptions} explorer - Explorer options.
 * @returns {Promise<Finding[]>} A key finding, or none when the chain shows none or the same one.
 */
async function pubkeyFindings(puzzle: Puzzle, explorer: BalanceOptions): Promise<Finding[]> {
  const { lookupPubkey } = await import("./providers.ts");
  const address = puzzle.address().value;
  const shown = await lookupPubkey(puzzle.chain(), address, explorer);
  const recorded = puzzle.pubkey()?.value.toLowerCase();
  return shown === undefined || shown.pubkey.toLowerCase() === recorded
    ? []
    : [defined<PubkeyFinding>({ kind: "pubkey", address, ...shown, recorded })];
}

/** What one check gave: its value, or the message of the lookup failure that took its place. */
type Attempt<T> = Readonly<{ value: T; error?: never } | { value?: never; error: string }>;

/**
 * Runs one check, turning an explorer or archive failure into an error message instead of ending
 * the pass. Any other error still ends it, because it isn't the provider's.
 *
 * @param {() => Promise<T>} check - The check.
 * @returns {Promise<Attempt<T>>} What the check returned, or why it could not.
 */
async function attempt<T>(check: () => Promise<T>): Promise<Attempt<T>> {
  try {
    return { value: await check() };
  } catch (error) {
    if (!(error instanceof BalanceError || error instanceof SourceLookupError)) {
      throw error;
    }
    return { error: error.message };
  }
}

/**
 * Creates a watch pass: each call lays one puzzle over its chain, and over its archived source
 * page when `since` is set. Puzzles sharing a page share its read; nothing edits a record.
 *
 * @param {WatchOptions} [options] - Explorer options and the source cutoff.
 * @returns {Watch} The check for one puzzle.
 */
export function watcher(options: WatchOptions = {}): Watch {
  const since = options.since === undefined ? undefined : parseSince(options.since);
  const sources = new Map<string, Promise<SourceChange | undefined>>();
  const sourceFindings = async (url: string, cutoff: Readonly<Date>): Promise<Finding[]> => {
    let read = sources.get(url);
    if (read === undefined) {
      read = import("./sources.ts").then(({ sourceChange }) =>
        sourceChange(url, cutoff, options.timeout),
      );
      sources.set(url, read);
    }
    const change = await read;
    return change === undefined ? [] : [{ kind: "source", ...change }];
  };
  return async (puzzle, apiKey = options.apiKey) => {
    const explorer: BalanceOptions = { apiKey, baseUrl: options.baseUrl, timeout: options.timeout };
    const prize = expectedPrize(puzzle);
    const history = await attempt(() => unrecorded(puzzle, explorer));
    const read = history.value ?? nothingRead;
    const attempts = [
      history.error === undefined ? { value: read.findings } : { error: history.error },
      prize === undefined
        ? undefined
        : await attempt(() => balanceFindings(puzzle, prize, explorer)),
      asksPubkey(puzzle, read.spent)
        ? await attempt(() => pubkeyFindings(puzzle, explorer))
        : undefined,
      since === undefined
        ? undefined
        : await attempt(() => sourceFindings(puzzle.sourceUrl(), since)),
    ].filter((done) => done !== undefined);
    return {
      id: puzzle.id(),
      chain: puzzle.chain(),
      findings: attempts.flatMap((done) => done.value ?? []),
      errors: [
        ...attempts.flatMap((done) => (done.error === undefined ? [] : [done.error])),
        ...read.failures,
      ],
      truncated: read.truncated,
    };
  };
}

/**
 * An amount with the chain's coin, every digit kept.
 *
 * @param {bigint} units - Base units.
 * @param {Chain} chain - Chain whose coin they count.
 * @returns {string} Such as `0.00000371 BTC`.
 */
function amount(units: bigint, chain: Chain): string {
  return `${formatUnits(units, chainDecimals(chain))} ${chainSymbol(chain)}`;
}

/**
 * What one finding says, for the row that names its kind and puzzle.
 *
 * @param {Readonly<Finding>} finding - The finding.
 * @param {Chain} chain - Chain of the puzzle.
 * @returns {string} What a person needs to look it up.
 */
function describe(finding: Readonly<Finding>, chain: Chain): string {
  switch (finding.kind) {
    case "balance":
      return `${amount(finding.balance, chain)} held, ${finding.prize} ${chainSymbol(chain)} recorded as the prize`;
    case "pubkey":
      return `${finding.pubkey} shown by ${finding.txid} at ${finding.address}, ${finding.recorded === undefined ? "none recorded" : `${finding.recorded} recorded`}`;
    case "source":
      return `${finding.url} changed, +${finding.additions} -${finding.deletions} lines from ${finding.before.snapshot} to ${finding.after.snapshot}${finding.partial ? ", bodies cut off" : ""}`;
    default:
      return `${finding.txid} ${amount(finding.amount, chain)} ${finding.pending ? "unconfirmed" : (finding.date ?? "undated")} at ${finding.address}`;
  }
}

/**
 * One report as the rows `puzzles watch` and `puzzles_watch` print: one per finding, `PARTIAL` per
 * address read only in part, `FAIL` per failed check, `OK` when there's none of them.
 *
 * @param {Readonly<WatchReport>} report - The report.
 * @returns {string[]} The rows, each on one line.
 */
export function formatWatchReport(report: Readonly<WatchReport>): string[] {
  const rows = [
    ...report.findings.map(
      (finding) =>
        `${finding.kind.toUpperCase()}\t${report.id}\t${oneLine(describe(finding, report.chain))}`,
    ),
    ...report.truncated.map(
      (address) =>
        `PARTIAL\t${report.id}\tonly the newest ${HISTORY_LIMIT} transactions at ${address} read, older ones unchecked`,
    ),
    ...report.errors.map((error) => `FAIL\t${report.id}\t${oneLine(error)}`),
  ];
  return rows.length === 0 ? [`OK\t${report.id}`] : rows;
}
