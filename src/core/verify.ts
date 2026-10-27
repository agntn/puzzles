import type { BrainwalletRecipe } from "@agntn/keys/brainwallet";
import type { Chain } from "./chains.ts";
import { once } from "./imports.ts";
import type { OpenedKeyfile } from "./keyfile.ts";
import {
  type KeyData,
  type Pubkey,
  PubkeyFormat,
  type Secret,
  type Seed,
  secretOf,
  seedPassphrase,
} from "./parts.ts";
import { type Puzzle } from "./puzzle.ts";

/** The recipes `verify` reruns, each named after the technique that marks it on a record. */
export type RecipeName =
  | "bip39-entropy"
  | "sha256-brainwallet"
  | "triple-sha256-brainwallet"
  | "warpwallet";

/** A record's recipe rerun from scratch, judged apart from the key the record publishes. */
export interface RecipeResult {
  readonly derivedAddress: string | null;
  readonly error: string | null;
  /** Path the entropy took: the record's own, or the chain's first receive address. */
  readonly path?: string;
  readonly privateKey: string | null;
  readonly recipe: RecipeName;
  /** True when the recipe can't run at all, false when it ran and missed. */
  readonly unavailable: boolean;
  readonly verified: boolean;
}

/** Successful puzzle key verification. */
export interface VerifySuccess {
  readonly derivedAddress: string;
  readonly error: null;
  readonly expectedAddress: string;
  readonly id: string;
  /** The key in hex, the cosigners' keys joined by spaces, or Arweave's opened keyfile JSON. */
  readonly privateKey: string;
  /** The record's recipe, rerun, when it holds one. */
  readonly recipe?: RecipeResult;
  readonly verified: true;
}

/** Failed or unavailable puzzle key verification. */
export interface VerifyFailure {
  readonly derivedAddress: string | null;
  readonly error: string;
  readonly expectedAddress: string;
  readonly id: string;
  readonly privateKey: null;
  /** The record's recipe, rerun, when it holds one. */
  readonly recipe?: RecipeResult;
  /** True when the key material can't be checked at all, false when checkable material failed to match. */
  readonly unavailable: boolean;
  readonly verified: false;
}

/** Result of verifying a puzzle's known key material. */
export type VerifyResult = VerifySuccess | VerifyFailure;

/**
 * The keys wallets that `verify` loads on its first call, so `@agntn/keys` stays out of the package
 * import and of CLI startup. No other module imports `crypto.ts` statically; `test/eval-packed.ts`
 * checks that a lookup loads no keys and the first verification does.
 */
type Wallets = Pick<
  typeof import("./crypto.ts"),
  | "addressFromCosigners"
  | "addressFromPrivateKey"
  | "addressesEqual"
  | "isUnsupportedAddressKind"
  | "loadWordlist"
  | "privateKeyFromElectrumSeed"
  | "privateKeyFromEntropy"
  | "privateKeyFromPassphrase"
  | "privateKeyFromSeed"
  | "wifToPrivateKey"
>;

/** The record a check runs against and the keys wallets it runs with. */
interface Context {
  readonly crypto: Wallets;
  readonly puzzle: Puzzle;
}

/** The key record a secret came from and its public key: the puzzle's, or a cosigner's. */
interface Holder {
  readonly key: KeyData | undefined;
  readonly pubkey: Pubkey | undefined;
}

/** A check context that also knows which key record holds the secret being resolved. */
interface Resolution extends Context {
  readonly holder: Holder;
}

/** A seed ready to derive: its secret, the path it checked out with and its chain. */
interface SeedJob {
  readonly chain: Chain;
  readonly passphrase: string | undefined;
  readonly path: string;
  readonly seed: Extract<Secret, { kind: "seed" }>;
}

/** The keys wallets, loaded on the first check. */
const loadWallets = once(() => import("./crypto.ts"));

/** The keyfile recipe, which only Arweave records ever load. */
const loadKeyfiles = once(() => import("./keyfile.ts"));

/** The registry, for the collection's technique tags. */
const loadRegistry = once(() => import("./registry.ts"));

interface ResolvedKey {
  readonly format: PubkeyFormat;
  readonly hex: string;
}

interface UnresolvedKey {
  readonly reason: string;
  readonly unavailable: boolean;
}

/** Every cosigner's key of a multisig, resolved in record order. */
interface ResolvedCosigners {
  readonly cosigners: readonly ResolvedKey[];
}

/** Whatever a record's secret resolves to before the address check. */
type Resolved = ResolvedKey | ResolvedCosigners | OpenedKeyfile | UnresolvedKey;

/** A key run against the record's address: no error means it derived the address. */
interface Check {
  readonly derivedAddress: string | null;
  readonly error: string | null;
  /** The key the address came from: hex, the cosigners' hex, or the keyfile JSON on Arweave. */
  readonly privateKey?: string;
  readonly unavailable: boolean;
}

/** A recipe's key, before the address check. */
interface Rebuilt {
  readonly key: ResolvedKey | UnresolvedKey;
  readonly path?: string;
  readonly recipe: RecipeName;
}

function unavailable(reason: string): UnresolvedKey {
  return { reason, unavailable: true };
}

function failed(reason: string): UnresolvedKey {
  return { reason, unavailable: false };
}

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

/**
 * The key at a seed's path, through Electrum's derivation or through BIP39 with the record's list.
 *
 * @param {SeedJob} job - The seed, its path, its chain and the known passphrase.
 * @param {Wallets} decoders - The keys wallets.
 * @returns {Promise<string | undefined>} The key in hex, or `undefined` where the chain has none.
 */
async function seedHex(job: SeedJob, decoders: Wallets): Promise<string | undefined> {
  const { chain, passphrase, path, seed } = job;
  if (seed.scheme === "electrum") {
    return decoders.privateKeyFromElectrumSeed(seed.phrase, path, chain, passphrase);
  }
  const wordlist =
    seed.language === undefined ? undefined : await decoders.loadWordlist(seed.language);
  return decoders.privateKeyFromSeed(seed.phrase, {
    chain,
    passphrase,
    path,
    rounds: seed.rounds,
    wordlist,
  });
}

async function resolveSeedKey(
  seed: Extract<Secret, { kind: "seed" }>,
  chain: Chain,
  format: PubkeyFormat,
  decoders: Wallets,
): Promise<ResolvedKey | UnresolvedKey> {
  if (seed.path === undefined) {
    return unavailable("Seed has no derivation path");
  }
  if (seed.passphrase === "Required") {
    return unavailable("Seed requires an unknown passphrase");
  }
  try {
    const job = { seed, path: seed.path, chain, passphrase: seed.passphrase?.Known };
    const hex = await seedHex(job, decoders);
    if (hex === undefined) {
      return unavailable(`Seed derivation is not supported for ${chain}`);
    }
    return { hex, format };
  } catch (error) {
    return failed(messageOf(error, "Seed derivation failed"));
  }
}

function resolveWifKey(wif: string, chain: Chain, decoders: Wallets): ResolvedKey | UnresolvedKey {
  try {
    const decoded = decoders.wifToPrivateKey(wif, chain);
    return {
      hex: decoded.hex,
      format: decoded.compressed ? PubkeyFormat.Compressed : PubkeyFormat.Uncompressed,
    };
  } catch (error) {
    return failed(messageOf(error, "Invalid WIF"));
  }
}

/**
 * The resolution of a puzzle's own key record.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {Wallets} crypto - The keys wallets.
 * @returns {Resolution} The context, holding the puzzle's key and public key.
 */
function topLevel(puzzle: Puzzle, crypto: Wallets): Resolution {
  return { crypto, puzzle, holder: { key: puzzle.keyData(), pubkey: puzzle.pubkey() } };
}

/**
 * A hex key's format: the holder's public key, then its WIF when that decodes to the same key.
 *
 * @param {Resolution} resolution - The puzzle, the keys wallets and the record holding the key.
 * @param {string} hex - The key in hex.
 * @returns {PubkeyFormat} The format, compressed when nothing says otherwise.
 */
function hexFormat(resolution: Resolution, hex: string): PubkeyFormat {
  const { crypto: decoders, holder, puzzle } = resolution;
  const format = holder.pubkey?.format;
  if (format !== undefined) {
    return format;
  }
  const wif = holder.key?.wif?.decrypted;
  if (wif !== undefined) {
    const decoded = resolveWifKey(wif, puzzle.chain(), decoders);
    if ("hex" in decoded && decoded.hex === hex.toLowerCase()) {
      return decoded.format;
    }
  }
  return PubkeyFormat.Compressed;
}

/**
 * Opens a sealed Arweave keyfile with the answer the record holds, the way the puzzle page does.
 *
 * @param {Extract<Secret, { kind: "keyfile" }>} secret - The keyfile the record exposes.
 * @returns {Promise<OpenedKeyfile | UnresolvedKey>} The opened keyfile, or why it stays shut.
 */
async function resolveKeyfile(
  secret: Extract<Secret, { kind: "keyfile" }>,
): Promise<OpenedKeyfile | UnresolvedKey> {
  if (secret.passphrase === undefined) {
    return unavailable("Keyfile passphrase is unknown");
  }
  const { openKeyfile } = await loadKeyfiles();
  try {
    return openKeyfile(secret.encrypted, secret.passphrase);
  } catch {
    return failed("The recorded passphrase doesn't open the keyfile");
  }
}

async function resolveKey(puzzle: Puzzle, decoders: Wallets): Promise<Resolved> {
  const secret = secretOf(puzzle.keyData());
  return secret === undefined
    ? unavailable("Puzzle has no private key")
    : resolveSecret(topLevel(puzzle, decoders), secret);
}

/**
 * The holder's public key format for a seed's key, else compressed, as HD wallets write it.
 *
 * @param {Holder} holder - The key record and its public key.
 * @returns {PubkeyFormat} The format.
 */
function seedFormat(holder: Holder): PubkeyFormat {
  return holder.pubkey?.format ?? PubkeyFormat.Compressed;
}

function isResolvedKey(key: Resolved): key is ResolvedKey {
  return "hex" in key;
}

function isUnresolved(key: Resolved): key is UnresolvedKey {
  return "reason" in key;
}

/**
 * Resolves every cosigner's secret, each against its own key record and with no public key of
 * its own. The first one that stays unknown or fails speaks for the lot.
 *
 * @param {Resolution} resolution - The puzzle, the keys wallets and the multisig key record.
 * @param {readonly Secret[]} secrets - The cosigners' secrets in record order.
 * @returns {Promise<ResolvedCosigners | UnresolvedKey>} The keys, or why one is missing.
 */
async function resolveCosigners(
  resolution: Resolution,
  secrets: readonly Secret[],
): Promise<ResolvedCosigners | UnresolvedKey> {
  const records = resolution.holder.key?.cosigners ?? [];
  const keys = await Promise.all(
    secrets.map((secret, index) =>
      resolveSecret({ ...resolution, holder: { key: records[index], pubkey: undefined } }, secret),
    ),
  );
  const cosigners = keys.filter((key) => isResolvedKey(key));
  if (cosigners.length === keys.length) {
    return { cosigners };
  }
  return (
    keys.find((key) => isUnresolved(key)) ??
    failed("Each cosigner needs a key of its own, not a keyfile or another script")
  );
}

async function resolveSecret(resolution: Resolution, secret: Secret): Promise<Resolved> {
  const { crypto: decoders, holder, puzzle } = resolution;
  switch (secret.kind) {
    case "hex":
      return { hex: secret.hex, format: hexFormat(resolution, secret.hex) };
    case "wif":
      return resolveWifKey(secret.wif, puzzle.chain(), decoders);
    case "encrypted":
      return unavailable("WIF is encrypted");
    case "seed":
      return resolveSeedKey(secret, puzzle.chain(), seedFormat(holder), decoders);
    case "mini":
      return unavailable("Mini private keys are not verified");
    case "keyfile":
      return resolveKeyfile(secret);
    case "cosigners":
      return resolveCosigners(resolution, secret.cosigners);
  }
}

/**
 * Every technique a puzzle was built with, the collection's tags included, like WarpWallet's one.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {Promise<readonly string[]>} The technique names.
 */
async function techniqueNames(puzzle: Puzzle): Promise<readonly string[]> {
  const { getCollection } = await loadRegistry();
  const collection = await getCollection(puzzle.collection());
  const tags = collection?.all().includes(puzzle)
    ? collection.techniquesById(puzzle.id())
    : [...puzzle.techniques(), ...puzzle.stages().flatMap((item) => item.techniques ?? [])];
  return tags.map((tag) => tag.name);
}

/** WarpWallet's scrypt takes 256 MiB, twice a Worker's memory, so only the data gate runs it. */
const WARPWALLET_SKIPPED = "WarpWallet's scrypt needs 256 MiB, so the data gate checks it instead";

/**
 * The SHA-256 brainwallet a passphrase went through. Scrypt ones stay out, no record holds its costs.
 *
 * @param {readonly string[]} names - The puzzle's technique names.
 * @returns {readonly [RecipeName, BrainwalletRecipe] | undefined} The recipe, or `undefined` for none.
 */
function brainwalletOf(
  names: readonly string[],
): readonly [RecipeName, BrainwalletRecipe] | undefined {
  if (names.includes("triple-sha256-brainwallet")) {
    return ["triple-sha256-brainwallet", { kdf: "sha256", iterations: 3 }];
  }
  if (names.includes("sha256-brainwallet")) {
    return ["sha256-brainwallet", { kdf: "sha256" }];
  }
  return undefined;
}

async function rebuildFromEntropy(
  puzzle: Puzzle,
  seed: Seed & { readonly entropy: NonNullable<Seed["entropy"]> },
  decoders: Wallets,
): Promise<Rebuilt> {
  const chain = puzzle.chain();
  const recipe = "bip39-entropy";
  if (seed.scheme === "electrum") {
    return { recipe, key: unavailable("BIP39 entropy doesn't rebuild an Electrum seed") };
  }
  const passphrase = seedPassphrase(seed);
  if (passphrase === "Required") {
    return { recipe, key: unavailable("Entropy seed requires an unknown passphrase") };
  }
  try {
    const wordlist =
      seed.language === undefined ? undefined : await decoders.loadWordlist(seed.language);
    const rebuilt = decoders.privateKeyFromEntropy(seed.entropy.hash, {
      chain,
      passphrase: passphrase?.Known,
      path: seed.path,
      rounds: seed.rounds,
      wordlist,
    });
    return rebuilt === undefined
      ? { recipe, key: unavailable(`Seed derivation is not supported for ${chain}`) }
      : {
          recipe,
          path: rebuilt.path,
          key: { hex: rebuilt.hex, format: hexFormat(topLevel(puzzle, decoders), rebuilt.hex) },
        };
  } catch (error) {
    return { recipe, key: failed(messageOf(error, "Entropy derivation failed")) };
  }
}

function rebuildFromPassphrase(
  puzzle: Puzzle,
  recipe: readonly [RecipeName, BrainwalletRecipe],
  passphrase: string,
  decoders: Wallets,
): Rebuilt {
  const [name, options] = recipe;
  try {
    const hex = decoders.privateKeyFromPassphrase(passphrase, options);
    return { recipe: name, key: { hex, format: hexFormat(topLevel(puzzle, decoders), hex) } };
  } catch (error) {
    return { recipe: name, key: failed(messageOf(error, "Brainwallet derivation failed")) };
  }
}

/**
 * Rebuilds a key from the record's recipe: BIP39 entropy first, then a tagged brainwallet.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {Wallets} decoders - The keys wallets.
 * @returns {Promise<Rebuilt | undefined>} The rebuilt key, or `undefined` when the record holds no recipe.
 */
async function rebuild(puzzle: Puzzle, decoders: Wallets): Promise<Rebuilt | undefined> {
  const key = puzzle.keyData();
  const entropy = key?.seed?.entropy;
  if (key?.seed !== undefined && entropy !== undefined) {
    return rebuildFromEntropy(puzzle, { ...key.seed, entropy }, decoders);
  }
  return key?.wif?.passphrase === undefined
    ? undefined
    : rebuildBrainwallet(puzzle, key.wif.passphrase, decoders);
}

async function rebuildBrainwallet(
  puzzle: Puzzle,
  passphrase: string,
  decoders: Wallets,
): Promise<Rebuilt | undefined> {
  const names = await techniqueNames(puzzle);
  if (names.includes("warpwallet")) {
    return { recipe: "warpwallet", key: unavailable(WARPWALLET_SKIPPED) };
  }
  const recipe = brainwalletOf(names);
  return recipe === undefined
    ? undefined
    : rebuildFromPassphrase(puzzle, recipe, passphrase, decoders);
}

/**
 * Compares the address an opened keyfile gives with the record's, byte for byte as Arweave writes it.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {OpenedKeyfile} key - The opened keyfile.
 * @returns {Check} The verdict, with the keyfile as the private key.
 */
function checkKeyfile(puzzle: Puzzle, key: OpenedKeyfile): Check {
  const expected = puzzle.address().value;
  const error =
    key.address === expected
      ? null
      : `Verification mismatch: expected ${expected}, got ${key.address}`;
  return { derivedAddress: key.address, error, unavailable: false, privateKey: key.keyfile };
}

/** A derivation to run and the key material it started from, as `verify` returns it. */
interface Attempt {
  /** `undefined` where the chain has no derivation. */
  readonly derive: () => string | undefined;
  readonly privateKey: string;
}

/**
 * Runs a derivation and holds what it gives against the record's address.
 *
 * @param {Context} context - The puzzle and the keys wallets.
 * @param {Attempt} attempt - The derivation and its key material.
 * @returns {Check} The verdict.
 */
function compareDerived(context: Context, attempt: Attempt): Check {
  const { crypto, puzzle } = context;
  const { derive, privateKey } = attempt;
  const chain = puzzle.chain();
  const expected = puzzle.address().value;
  try {
    const derivedAddress = derive();
    if (derivedAddress === undefined) {
      return {
        derivedAddress: null,
        error: `Unsupported verification chain: ${chain}`,
        unavailable: true,
      };
    }
    const error = crypto.addressesEqual(chain, derivedAddress, expected)
      ? null
      : `Verification mismatch: expected ${expected}, got ${derivedAddress}`;
    return { derivedAddress, error, unavailable: false, privateKey };
  } catch (error) {
    return {
      derivedAddress: null,
      error: messageOf(error, "Verification failed"),
      unavailable: crypto.isUnsupportedAddressKind(error),
    };
  }
}

/**
 * Rebuilds the witness script from the cosigners' keys, with the recorded script's threshold.
 *
 * @param {Context} context - The puzzle and the keys wallets.
 * @param {ResolvedCosigners} key - Every cosigner's key.
 * @returns {Check} The verdict, with the cosigners' keys joined by spaces.
 */
function checkCosigners(context: Context, key: ResolvedCosigners): Check {
  const { crypto, puzzle } = context;
  const script = puzzle.address().witness_script;
  if (script === undefined) {
    return {
      derivedAddress: null,
      error: "Cosigner keys need the witness script the address hashes",
      unavailable: true,
    };
  }
  const witness = { chain: puzzle.chain(), script };
  return compareDerived(context, {
    derive: () => crypto.addressFromCosigners(key.cosigners, witness),
    privateKey: key.cosigners.map((cosigner) => cosigner.hex).join(" "),
  });
}

function checkKey(context: Context, key: Resolved): Check {
  const { crypto, puzzle } = context;
  if ("keyfile" in key) {
    return checkKeyfile(puzzle, key);
  }
  if ("cosigners" in key) {
    return checkCosigners(context, key);
  }
  if (!("hex" in key)) {
    return { derivedAddress: null, error: key.reason, unavailable: key.unavailable };
  }
  const { kind } = puzzle.address();
  return compareDerived(context, {
    derive: () => crypto.addressFromPrivateKey(key.hex, puzzle.chain(), key.format, kind),
    privateKey: key.hex,
  });
}

/**
 * Runs a rebuilt key against the address; a wrong published key already fails on its own.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @param {Wallets} crypto - The keys wallets.
 * @param {Rebuilt} rebuilt - The key the recipe gave.
 * @returns {RecipeResult} The recipe's own verdict.
 */
function checkRecipe(puzzle: Puzzle, crypto: Wallets, rebuilt: Rebuilt): RecipeResult {
  const checked = checkKey({ puzzle, crypto }, rebuilt.key);
  return {
    recipe: rebuilt.recipe,
    ...(rebuilt.path === undefined ? {} : { path: rebuilt.path }),
    verified: checked.error === null,
    unavailable: checked.unavailable,
    privateKey: checked.error === null ? (checked.privateKey ?? null) : null,
    derivedAddress: checked.derivedAddress,
    error: checked.error,
  };
}

/**
 * Verifies that a puzzle's known key material derives its stored address, and reruns its recipe
 * as a separate check. The first call loads the keys wallets; later calls reuse them.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {Promise<VerifyResult>} The outcome, with the derived address when a key was available.
 */
export async function verify(puzzle: Puzzle): Promise<VerifyResult> {
  const crypto = await loadWallets();
  const published = await resolveKey(puzzle, crypto);
  const checked = checkKey({ puzzle, crypto }, published);
  const rebuilt = await rebuild(puzzle, crypto);
  const id = puzzle.id();
  const expectedAddress = puzzle.address().value;
  const recipe = rebuilt === undefined ? {} : { recipe: checkRecipe(puzzle, crypto, rebuilt) };
  if (
    checked.error === null &&
    checked.derivedAddress !== null &&
    checked.privateKey !== undefined
  ) {
    return {
      id,
      verified: true,
      privateKey: checked.privateKey,
      expectedAddress,
      derivedAddress: checked.derivedAddress,
      error: null,
      ...recipe,
    };
  }
  return {
    id,
    verified: false,
    privateKey: null,
    expectedAddress,
    derivedAddress: checked.derivedAddress,
    unavailable: checked.unavailable,
    error: checked.error ?? "Verification failed",
    ...recipe,
  };
}
