import { BalanceError, type BalanceOptions } from "./balance.ts";
import {
  type Chain,
  chainDecimals,
  chains,
  chainSymbol,
  isValidAddress,
  sameAddress,
} from "./chains.ts";
import { get, requirePuzzle, selectPuzzles } from "./dataset.ts";
import { InvalidArgumentError } from "./errors.ts";
import { type Address, type AddressKind, addressOn, defined } from "./parts.ts";
import type { AddressState } from "./providers.ts";
import type { Puzzle } from "./puzzle.ts";
import { requireCollection } from "./registry.ts";
import { Status } from "./status.ts";
import { oneLine } from "./text.ts";
import { Balance, formatUnits } from "./types.ts";
import { decimal, requireChain } from "./utils.ts";
import { expectedPrize, holdsPrize } from "./watch.ts";

/** Options for `eligibility()`: the explorer options, plus the chain of a bare address. */
export interface EligibilityOptions extends BalanceOptions {
  /** The provider key of a chain, asked once the query resolves and only when `apiKey` is absent. */
  readonly apiKeyFor?: ((chain: Chain) => string | undefined) | undefined;

  /** Chain to read a bare address on, when its format fits more than one. */
  readonly chain?: string | undefined;
}

/** What to check before working on a puzzle. A field nobody can fill gets a `missing` line. */
export interface Eligibility {
  /** Target address. */
  readonly address: string;

  /** Collection author, by name. */
  readonly author?: string;

  /** Files and pages the puzzle hides its clues in, and the key range of a range puzzle. */
  readonly carriers: readonly string[];

  /** Chain of the address. */
  readonly chain: Chain;

  /** Collection key. */
  readonly collection?: string;

  /** Where the record and the chain disagree, such as a prize the addresses no longer hold. */
  readonly conflicts: readonly string[];

  /** Escrow address, when the prize waits in one. */
  readonly escrow?: string;

  /** What the status rests on: the record, a claim, what the addresses hold. */
  readonly evidence: readonly string[];

  /** Puzzle identifier. */
  readonly id?: string;

  /** Address kind, the script type a solution has to spend. */
  readonly kind?: AddressKind;

  /** Each prize address as its explorer read it, the target first. */
  readonly live: readonly AddressState[];

  /** One line per field left empty, `field: why`. Empty when the record is complete. */
  readonly missing: readonly string[];

  /** What the lookup was given: an identifier or an address. */
  readonly query: string;

  /** Source page of the puzzle. */
  readonly source?: string;

  /** Recorded status. */
  readonly status?: Status;

  /** Whether the prize still waits for a solver, by the recorded status. */
  readonly unclaimed?: boolean;

  /** What counts as a solution, such as the private key the address hashes. */
  readonly verifier?: string;
}

/** What a query names: its chain and address, and the puzzle when a record holds it. */
interface Target {
  /** The address record, absent for a bare address of a kind no record holds. */
  readonly address: Address | undefined;
  readonly chain: Chain;
  readonly puzzle: Puzzle | undefined;
  /** The address as written. */
  readonly value: string;
}

/**
 * The puzzle a recorded prize address pays, its target or its escrow, or nothing when none does.
 *
 * @param {string} address - The address.
 * @param {Chain | undefined} chain - The chain it was given on, when any.
 * @returns {Promise<Puzzle | undefined>} The one puzzle paying to it.
 */
async function puzzleAt(address: string, chain: Chain | undefined): Promise<Puzzle | undefined> {
  const found = (await selectPuzzles({ chain })).filter((puzzle) =>
    [puzzle.address(), puzzle.escrow()].some(
      (held) => held !== undefined && sameAddress(puzzle.chain(), held.value, address),
    ),
  );
  if (found.length > 1) {
    const ids = found.map((puzzle) => puzzle.id()).join(", ");
    throw new InvalidArgumentError("query", `${address} pays ${ids}. Pass one identifier`);
  }
  return found[0];
}

/**
 * The chain of a bare address, or the identifier miss with its suggestions when it's no address.
 *
 * @param {string} address - The address.
 * @param {Chain | undefined} chain - The chain it was given on, when any.
 * @returns {Promise<Chain>} The chain to read it on.
 */
async function bareChain(address: string, chain: Chain | undefined): Promise<Chain> {
  const fits = chains.filter(
    (candidate) =>
      (chain === undefined || candidate === chain) && isValidAddress(candidate, address),
  );
  const [only] = fits;
  if (fits.length === 1 && only !== undefined) {
    return only;
  }
  if (fits.length > 1) {
    throw new InvalidArgumentError("chain", `${address} fits ${fits.join(", ")}. Pass one of them`);
  }
  if (chain !== undefined) {
    throw new InvalidArgumentError("query", `${JSON.stringify(address)} is not a ${chain} address`);
  }
  return (await requirePuzzle(address)).chain();
}

/**
 * Resolves a query to its puzzle, or to a bare address with its chain.
 *
 * @param {string} query - Puzzle identifier or address.
 * @param {Chain | undefined} chain - Chain of a bare address.
 * @returns {Promise<Target>} The puzzle, or the address and its chain.
 */
async function resolve(query: string, chain: Chain | undefined): Promise<Target> {
  const puzzle = (await get(query)) ?? (await puzzleAt(query, chain));
  if (puzzle === undefined) {
    const bare = await bareChain(query, chain);
    return { address: bareAddress(bare, query), chain: bare, puzzle, value: query };
  }
  if (chain !== undefined && puzzle.chain() !== chain) {
    throw new InvalidArgumentError("chain", `${puzzle.id()} is on ${puzzle.chain()}, not ${chain}`);
  }
  const address = puzzle.address();
  return { address, chain: puzzle.chain(), puzzle, value: address.value };
}

/** What a live read gave: every address, or the failure that took the place of all of them. */
type Reading = Readonly<{ states: readonly AddressState[]; error?: string }>;

/**
 * Reads every prize address, turning an explorer failure into the reason the live state is missing.
 *
 * @param {Chain} chain - Chain of the addresses.
 * @param {readonly string[]} addresses - The target, then the escrow.
 * @param {BalanceOptions} options - Explorer options.
 * @returns {Promise<Reading>} What the addresses hold, or why they could not be read.
 */
async function readAddresses(
  chain: Chain,
  addresses: readonly string[],
  options: BalanceOptions,
): Promise<Reading> {
  const { lookupAddress } = await import("./providers.ts");
  try {
    return {
      states: await Promise.all(addresses.map((address) => lookupAddress(chain, address, options))),
    };
  } catch (error) {
    if (!(error instanceof BalanceError)) {
      throw error;
    }
    return { states: [], error: error.message };
  }
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
 * What the record leaves for the live part to fill in: the totals the explorer didn't keep.
 *
 * @param {Chain} chain - Chain of the addresses.
 * @param {Reading} reading - The live read.
 * @returns {string[]} One `missing` line per gap.
 */
function liveGaps(chain: Chain, reading: Reading): string[] {
  if (reading.error !== undefined) {
    return [`live: ${reading.error}`];
  }
  const verbs = { funded: "received", spent: "spent" } as const;
  return reading.states.flatMap((state) =>
    (["funded", "spent"] as const)
      .filter((total) => state[total] === undefined)
      .map(
        (total) =>
          `${total}: ${state.provider} doesn't count the ${chainSymbol(chain)} ${state.address} ever ${verbs[total]}`,
      ),
  );
}

/**
 * The private key or script a solution has to produce, read from the address kind.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {Address} target - The address record.
 * @param {Puzzle | undefined} puzzle - The puzzle, when a record holds the address.
 * @returns {string | undefined} The verifier, or nothing when neither tells.
 */
function keyVerifier(
  chain: Chain,
  target: Address,
  puzzle: Puzzle | undefined,
): string | undefined {
  switch (target.kind) {
    case "p2pkh":
    case "p2wpkh":
      return hashVerifier(target, puzzle);
    case "p2sh":
    case "p2wsh":
      return target.redeem_script === undefined
        ? undefined
        : `a spend that satisfies redeem script ${target.redeem_script.script}`;
    default:
      return standardVerifier(chain, target.value, puzzle);
  }
}

/**
 * The verifier of an address that hashes one public key, the recorded one when there is one.
 *
 * @param {Address} target - The address record.
 * @param {Puzzle | undefined} puzzle - The puzzle, when a record holds the address.
 * @returns {string} The verifier.
 */
function hashVerifier(target: Address, puzzle: Puzzle | undefined): string {
  const pubkey = puzzle?.pubkey();
  if (pubkey !== undefined) {
    return `the private key of public key ${pubkey.value}, which hashes to ${target.value}`;
  }
  const formats = target.kind === "p2wpkh" ? "compressed" : "compressed or uncompressed";
  return `a private key whose ${formats} public key hashes to ${target.value}`;
}

/**
 * The verifier of a chain without script types. Only key material tells an EVM key from a contract.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {string} address - The address.
 * @param {Puzzle | undefined} puzzle - The puzzle, when a record holds the address.
 * @returns {string | undefined} The verifier, or nothing when the record can't tell.
 */
function standardVerifier(
  chain: Chain,
  address: string,
  puzzle: Puzzle | undefined,
): string | undefined {
  if (chain === "arweave") {
    return `the RSA keyfile whose modulus hashes to ${address}`;
  }
  if (chain === "monero") {
    return `the private spend key behind ${address}`;
  }
  return puzzle?.hasPubkey() === true || puzzle?.hasPrivateKey() === true
    ? `the private key of ${address}`
    : undefined;
}

/**
 * Why a target has no verifier.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {Address} target - The address record.
 * @returns {string} The `missing` line.
 */
function verifierGap(chain: Chain, target: Address): string {
  return target.kind === "standard"
    ? `verifier: the record doesn't say whether ${target.value} is a contract or a key on ${chain}`
    : `verifier: the record has no script behind the ${target.kind} address ${target.value}`;
}

/**
 * What counts as a solution for a target, or why nobody can say.
 *
 * @param {Target} target - The resolved query.
 * @returns {{ verifier?: string; missing: string[] }} The verifier, or the `missing` lines.
 */
function solution({ address, chain, puzzle, value }: Target): {
  verifier?: string;
  missing: string[];
} {
  if (address === undefined) {
    return { missing: [`kind: ${value} has no kind a record holds on ${chain}`] };
  }
  const verifier = keyVerifier(chain, address, puzzle);
  return verifier === undefined
    ? { missing: [verifierGap(chain, address)] }
    : { verifier, missing: [] };
}

/**
 * The address record of a target: the puzzle's, or the kind a bare address reads as.
 *
 * @param {Chain} chain - Chain of the address.
 * @param {string} address - The address.
 * @returns {Address | undefined} The record, or nothing for a kind no record holds.
 */
function bareAddress(chain: Chain, address: string): Address | undefined {
  try {
    return addressOn(chain, address);
  } catch {
    return undefined;
  }
}

/**
 * The files and pages a puzzle hides its clues in, each once, and its key range. Solutions aren't clues.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {string[]} Asset and artifact URLs, then the range.
 */
function carriers(puzzle: Puzzle): string[] {
  const urls = new Set([
    ...puzzle
      .assetLinks()
      .filter((link) => link.kind !== "solution")
      .map((link) => link.url),
    ...puzzle.stages().flatMap((stage) => stage.artifacts.map((artifact) => artifact.url)),
  ]);
  const range = puzzle.keyRange();
  return [
    ...urls,
    ...(range === undefined
      ? []
      : [`key range 0x${range[0].toString(16)} to 0x${range[1].toString(16)}`]),
  ];
}

/**
 * The evidence for a puzzle's status, and a prize the addresses no longer hold as a conflict.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {readonly AddressState[]} states - The live read, empty when it failed.
 * @returns {{ evidence: string[]; conflicts: string[] }} The two lists.
 */
function statusEvidence(
  puzzle: Puzzle,
  states: readonly AddressState[],
): { evidence: string[]; conflicts: string[] } {
  const chain = puzzle.chain();
  const claim = puzzle.claimTransaction();
  const held = new Balance(
    chain,
    states.reduce((sum, state) => sum + state.confirmed, 0n),
    states.reduce((sum, state) => sum + state.unconfirmed, 0n),
  );
  const prize = expectedPrize(puzzle);
  const read = states.length > 0;
  return {
    evidence: [
      `record says ${puzzle.status()}`,
      ...(claim === undefined ? [] : [`claim ${claim.txid} on ${claim.date}`]),
      ...(read ? [`addresses hold ${amount(held.total(), chain)} now`] : []),
    ],
    conflicts:
      read && prize !== undefined && !holdsPrize(held, prize)
        ? [
            `addresses hold ${amount(held.total(), chain)}, the record says the prize is ${decimal(prize)} ${chainSymbol(chain)}`,
          ]
        : [],
  };
}

/**
 * The record half of an eligibility check, from the puzzle and its collection.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {readonly AddressState[]} states - The live read, empty when it failed.
 * @returns {Promise<object>} The identity, status and carrier fields, and what they lack.
 */
async function recordFields(puzzle: Puzzle, states: readonly AddressState[]) {
  const { author } = await requireCollection(puzzle.collection());
  const name = author.name ?? author.key;
  const found = carriers(puzzle);
  const status = puzzle.status();
  return {
    fields: {
      id: puzzle.id(),
      collection: puzzle.collection(),
      author: name,
      source: puzzle.sourceUrl(),
      escrow: puzzle.escrow()?.value,
      status,
      unclaimed: status === Status.Unsolved,
      carriers: found,
      ...statusEvidence(puzzle, states),
    },
    missing: [
      ...(name === undefined ? ["author: the collection names no author"] : []),
      ...(found.length === 0 ? ["carriers: the record links no clue file, page or key range"] : []),
    ],
  };
}

/**
 * The record half for an address no record holds: nothing but the reasons.
 *
 * @param {string} address - The address.
 * @returns {object} Empty fields and one `missing` line each.
 */
function bareFields(address: string) {
  const absent = `${address} is in no record`;
  return {
    fields: { carriers: [], evidence: [], conflicts: [] },
    missing: ["id", "collection", "author", "source", "status", "carriers"].map(
      (field) => `${field}: ${absent}`,
    ),
  };
}

/**
 * Builds the eligibility record of a puzzle or a bare address, never guessing a missing field.
 *
 * @param {string} query - Puzzle identifier or address.
 * @param {EligibilityOptions} [options] - Explorer options, and the chain of a bare address.
 * @returns {Promise<Eligibility>} The record.
 */
export async function eligibility(
  query: string,
  options: EligibilityOptions = {},
): Promise<Eligibility> {
  const target = await resolve(query, requireChain(options.chain));
  const { chain, puzzle, value } = target;
  const { prizeAddresses } = await import("./providers.ts");
  const reading = await readAddresses(
    chain,
    puzzle === undefined ? [value] : prizeAddresses(puzzle),
    { ...options, apiKey: options.apiKey ?? options.apiKeyFor?.(chain) },
  );
  const record =
    puzzle === undefined ? bareFields(value) : await recordFields(puzzle, reading.states);
  const solved = solution(target);
  return defined<Eligibility>({
    query,
    ...record.fields,
    chain,
    address: value,
    kind: target.address?.kind,
    live: reading.states,
    verifier: solved.verifier,
    missing: [...record.missing, ...liveGaps(chain, reading), ...solved.missing],
  });
}

/**
 * One live read as its row says it.
 *
 * @param {AddressState} state - The read.
 * @param {Chain} chain - Chain of the address.
 * @returns {string} Balance, totals and where they came from.
 */
function describeState(state: AddressState, chain: Chain): string {
  const parts = [
    `${state.address} ${amount(state.confirmed, chain)} confirmed`,
    `${amount(state.unconfirmed, chain)} unconfirmed`,
    ...(state.funded === undefined ? [] : [`received ${amount(state.funded, chain)}`]),
    ...(state.spent === undefined ? [] : [`spent ${amount(state.spent, chain)}`]),
    `read from ${state.provider} at ${state.readAt}`,
  ];
  return parts.join(", ");
}

/**
 * One record as the `label<TAB>value` rows `puzzles eligibility` and `puzzles_eligibility` print.
 *
 * @param {Readonly<Eligibility>} record - The record.
 * @returns {string[]} The rows, each on one line.
 */
export function formatEligibility(record: Readonly<Eligibility>): string[] {
  const status =
    record.status === undefined
      ? undefined
      : `${record.status}, prize ${record.unclaimed === true ? "open" : "closed"}`;
  const rows: [string, string | undefined][] = [
    ["id", record.id],
    ["collection", record.collection],
    ["author", record.author],
    ["source", record.source],
    ["chain", record.chain],
    ["address", record.kind === undefined ? record.address : `${record.address} ${record.kind}`],
    ["escrow", record.escrow],
    ...record.live.map((state): [string, string] => ["live", describeState(state, record.chain)]),
    ["status", status],
    ...record.evidence.map((line): [string, string] => ["evidence", line]),
    ...record.conflicts.map((line): [string, string] => ["conflict", line]),
    ...record.carriers.map((line): [string, string] => ["carrier", line]),
    ["verifier", record.verifier],
    ...record.missing.map((line): [string, string] => ["missing", line]),
  ];
  return rows.flatMap(([label, value]) =>
    value === undefined ? [] : [`${label}\t${oneLine(value)}`],
  );
}
