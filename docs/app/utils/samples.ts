import type { Chain, KeyData, Puzzle, Status, VerifyResult } from "../../../src/index.ts";
import { formatPrize } from "./format.ts";

/** The slice of the library a sample needs, passed in so this module never imports it by name. */
export interface SampleLibrary {
  readonly secretOf: (key: KeyData | undefined) => { readonly kind: string } | undefined;
  readonly verifyPuzzle: (puzzle: Puzzle) => Promise<VerifyResult>;
}

/** What the landing shows about one puzzle: plain data, so a static copy renders before the library loads. */
export interface LandingSample {
  readonly id: string;
  readonly collection: string;
  readonly chain: Chain;
  readonly status: Status;
  readonly address: string;
  readonly kind: string;
  readonly hash160: string | undefined;
  readonly redeemScript: { readonly hash: string; readonly script: string } | undefined;
  readonly prize: string;
  readonly prizeAmount: number | undefined;
  readonly currency: string | undefined;
  readonly startedAt: string;
  readonly solvedAt: string | undefined;
  readonly solveTime: string | undefined;
  readonly bits: number | undefined;
  readonly range: readonly [string, string] | undefined;
  readonly pubkey: string | undefined;
  readonly pubkeyFormat: string | undefined;
  readonly secret: string;
  readonly keyLiteral: string | undefined;
  readonly verdict: "verified" | "unavailable" | "failed";
  readonly detail: string;
  readonly explorer: string;
  readonly source: string;
  readonly transactions: number;
  readonly tool: string;
}

function quote(value: string): string {
  return JSON.stringify(value);
}

/**
 * The head of a record that starts from raw or Wallet Import Format material.
 *
 * @param {KeyData} key - The serialized key record.
 * @returns {string | undefined} `hex(...)`, `wif(...)` or `encryptedWif(...)`, or nothing.
 */
function wifHead(key: KeyData): string | undefined {
  if (key.hex !== undefined) {
    return key.bits === undefined
      ? `hex(${quote(key.hex)})`
      : `hex(${quote(key.hex)}, ${key.bits})`;
  }
  if (key.wif?.decrypted !== undefined) return `wif(${quote(key.wif.decrypted)})`;
  return key.wif?.encrypted === undefined ? undefined : encryptedHead(key.wif.encrypted, key.wif);
}

/**
 * `encryptedWif(payload, { passphrase, salt })`, with the options object only when one is known.
 *
 * @param {string} payload - The BIP38 payload.
 * @param {{ readonly passphrase?: string; readonly salt?: string }} wif - The record's WIF block.
 * @returns {string} The builder call.
 */
function encryptedHead(
  payload: string,
  wif: { readonly passphrase?: string; readonly salt?: string },
): string {
  const options = [
    wif.passphrase === undefined ? "" : `passphrase: ${quote(wif.passphrase)}`,
    wif.salt === undefined ? "" : `salt: ${quote(wif.salt)}`,
  ].filter(Boolean);
  return options.length === 0
    ? `encryptedWif(${quote(payload)})`
    : `encryptedWif(${quote(payload)}, { ${options.join(", ")} })`;
}

/**
 * The head of a record that starts from a seed phrase or a derivation path.
 *
 * @param {KeyData} key - The serialized key record.
 * @returns {string | undefined} `seed(...)` or `derivation(...)`, or nothing.
 */
function seedHead(key: KeyData): string | undefined {
  const seed = key.seed;
  if (seed?.phrase !== undefined) {
    return seed.path === undefined
      ? `seed(${quote(seed.phrase)})`
      : `seed(${quote(seed.phrase)}, ${quote(seed.path)})`;
  }
  return seed?.path === undefined ? undefined : `derivation(${quote(seed.path)})`;
}

/**
 * The first builder call of a key record, or nothing when the record has no key at all.
 *
 * @param {KeyData} key - The serialized key record.
 * @returns {string | undefined} The head call, down to `mini(...)`, `passphrase(...)` or `bits(...)`.
 */
function keyHead(key: KeyData): string | undefined {
  const head = wifHead(key) ?? seedHead(key);
  if (head !== undefined) return head;
  if (key.mini !== undefined) return `mini(${quote(key.mini)})`;
  if (key.wif?.passphrase !== undefined) return `passphrase(${quote(key.wif.passphrase)})`;
  return key.bits === undefined ? undefined : `bits(${key.bits})`;
}

/**
 * The chained calls after a `hex()` head: the WIF, the passphrase and the salt it was made from.
 *
 * @param {KeyData} key - The serialized key record.
 * @returns {string[]} The `.wif()`, `.passphrase()` and `.salt()` calls that apply.
 */
function hexTail(key: KeyData): string[] {
  if (key.hex === undefined || key.wif === undefined) return [];
  const tail: string[] = [];
  if (key.wif.decrypted !== undefined) tail.push(`.wif(${quote(key.wif.decrypted)})`);
  if (key.wif.passphrase !== undefined) tail.push(`.passphrase(${quote(key.wif.passphrase)})`);
  if (key.wif.salt !== undefined) tail.push(`.salt(${quote(key.wif.salt)})`);
  return tail;
}

/**
 * The chained calls that describe a seed: the xpub, the entropy and the published shares.
 *
 * @param {KeyData} key - The serialized key record.
 * @returns {string[]} The `.xpub()`, `.entropy()` and `.shares()` calls that apply.
 */
function seedTail(key: KeyData): string[] {
  const tail: string[] = [];
  if (key.seed?.xpub !== undefined) tail.push(`.xpub(${quote(key.seed.xpub)})`);
  const entropy = key.seed?.entropy;
  if (entropy !== undefined) {
    tail.push(
      entropy.source?.url === undefined
        ? `.entropy(${quote(entropy.hash)})`
        : `.entropy(${quote(entropy.hash)}, source(${quote(entropy.source.url)}))`,
    );
  }
  if (key.shares !== undefined) {
    const shares = key.shares.shares.map((share) => `share(${share.index}, ${quote(share.data)})`);
    tail.push(`.shares(${key.shares.threshold}, ${key.shares.total}, [${shares.join(", ")}])`);
  }
  return tail;
}

/**
 * The `parts.ts` builder chain that produces a key record, for the rotating code panel. It mirrors
 * the builders in `src/core/parts.ts`, so a new builder there needs a line here.
 *
 * @param {KeyData | undefined} key - The serialized key record.
 * @returns {string | undefined} The builder chain, or nothing for a record without a key.
 */
export function keyLiteral(key: KeyData | undefined): string | undefined {
  if (key === undefined) return undefined;
  const head = keyHead(key);
  return head === undefined ? undefined : [head, ...hexTail(key), ...seedTail(key)].join("");
}

function verdictOf(result: VerifyResult): LandingSample["verdict"] {
  if (result.verified) return "verified";
  return result.unavailable ? "unavailable" : "failed";
}

/**
 * Reads one puzzle into the shape the landing renders. The tool text is passed in because
 * `showTool` is asynchronous, and the library because this file is shared with the root test.
 *
 * @param {SampleLibrary} library - `secretOf` and `verifyPuzzle`, from `src/` or the alias.
 * @param {Puzzle} puzzle - The puzzle to read.
 * @param {string} tool - What `puzzles_show` prints for it.
 * @returns {Promise<LandingSample>} Plain data for the panels.
 */
export async function toSample(
  library: SampleLibrary,
  puzzle: Puzzle,
  tool: string,
): Promise<LandingSample> {
  const address = puzzle.address();
  const range = puzzle.keyRange();
  const result = await library.verifyPuzzle(puzzle);
  return {
    id: puzzle.id(),
    collection: puzzle.collection(),
    chain: puzzle.chain(),
    status: puzzle.status(),
    address: address.value,
    kind: address.kind,
    hash160: address.hash160,
    redeemScript: address.redeem_script,
    prize: formatPrize(puzzle.prize(), puzzle.prizeCurrency()),
    prizeAmount: puzzle.prize(),
    currency: puzzle.currency(),
    startedAt: puzzle.startedAt(),
    solvedAt: puzzle.solvedAt(),
    solveTime: puzzle.formattedSolveTime(),
    bits: puzzle.keyData()?.bits,
    range: range === undefined ? undefined : [range[0].toString(16), range[1].toString(16)],
    pubkey: puzzle.pubkey()?.value,
    pubkeyFormat: puzzle.pubkey()?.format,
    secret: library.secretOf(puzzle.keyData())?.kind ?? "none",
    keyLiteral: keyLiteral(puzzle.keyData()),
    verdict: verdictOf(result),
    detail: result.verified ? result.derivedAddress : (result.error ?? ""),
    explorer: puzzle.explorerUrl(),
    source: puzzle.sourceUrl(),
    transactions: puzzle.transactions().length,
    tool,
  };
}

/**
 * The factory a chain's records are built with; every chain factory has this name.
 *
 * @param {string} chain - The chain key.
 * @returns {string} `bitcoinPuzzle` for `bitcoin`.
 */
export function factoryName(chain: string): string {
  return `${chain}Puzzle`;
}

/**
 * The address builder that produced the record's address, by kind.
 *
 * @param {LandingSample} sample - The sample whose address to write out.
 * @returns {string} A `p2pkh(...)`, `p2sh(...)`, `p2wpkh(...)`, `p2wsh(...)` or `standard(...)` call.
 */
export function addressLiteral(sample: LandingSample): string {
  const args = [quote(sample.address)];
  if (sample.hash160 !== undefined) args.push(quote(sample.hash160));
  if (sample.redeemScript !== undefined) {
    args.push(
      `redeemScript(${quote(sample.redeemScript.hash)}, ${quote(sample.redeemScript.script)})`,
    );
  }
  return `${sample.kind}(${args.join(", ")})`;
}

/**
 * The export name a record module uses: `<collection>Puzzle<Name>` in camelCase.
 *
 * @param {string} id - The puzzle identifier.
 * @returns {string} `b1000Puzzle71` for `b1000/71`, `gsmgPuzzle` for the singleton.
 */
export function exportName(id: string): string {
  const [collection = "", name = ""] = id.split("/", 2);
  const camel = (value: string) =>
    value
      .split(/[_-]/u)
      .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
      .join("");
  const suffix = name === "" ? "" : name.charAt(0).toUpperCase() + camel(name).slice(1);
  return `${camel(collection)}Puzzle${suffix}`;
}

/**
 * `Status.Solved` for `solved`: the enum member a record names when its status isn't the default.
 *
 * @param {string} status - The status value.
 * @returns {string} The member access as written in a record.
 */
export function statusLiteral(status: string): string {
  return `Status.${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}
