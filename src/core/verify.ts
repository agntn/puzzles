import type { BrainwalletRecipe } from "@agntn/keys/brainwallet";
import type { Chain } from "./chains.ts";
import { type Entropy, PubkeyFormat, type Secret, secretOf } from "./parts.ts";
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

/** The keys wallets that `verify` loads on its first call. */
type Wallets = Pick<
  typeof import("./crypto.ts"),
  | "addressFromPrivateKey"
  | "addressesEqual"
  | "isUnsupportedAddressKind"
  | "privateKeyFromEntropy"
  | "privateKeyFromPassphrase"
  | "privateKeyFromSeed"
  | "wifToPrivateKey"
>;

/** One import shared by overlapping first calls, so Pi's loader can't evaluate it twice. */
let wallets: Promise<typeof import("./crypto.ts")> | undefined;

interface ResolvedKey {
  readonly format: PubkeyFormat;
  readonly hex: string;
}

interface UnresolvedKey {
  readonly reason: string;
  readonly unavailable: boolean;
}

/** A key run against the record's address: no error means it derived the address. */
interface Check {
  readonly derivedAddress: string | null;
  readonly error: string | null;
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

function resolveSeedKey(
  seed: Extract<Secret, { kind: "seed" }>,
  chain: Chain,
  format: PubkeyFormat,
  decoders: Wallets,
): ResolvedKey | UnresolvedKey {
  if (seed.path === undefined) {
    return unavailable("Seed has no derivation path");
  }
  if (seed.passphrase === "Required") {
    return unavailable("Seed requires an unknown passphrase");
  }
  try {
    const hex = decoders.privateKeyFromSeed(seed.phrase, seed.path, chain, seed.passphrase?.Known);
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

function hexFormat(puzzle: Puzzle, hex: string, decoders: Wallets): PubkeyFormat {
  const format = puzzle.pubkey()?.format;
  if (format !== undefined) {
    return format;
  }
  const wif = puzzle.keyData()?.wif?.decrypted;
  if (wif !== undefined) {
    const decoded = resolveWifKey(wif, puzzle.chain(), decoders);
    if ("hex" in decoded && decoded.hex === hex.toLowerCase()) {
      return decoded.format;
    }
  }
  return PubkeyFormat.Compressed;
}

function resolveKey(puzzle: Puzzle, decoders: Wallets): ResolvedKey | UnresolvedKey {
  const secret = secretOf(puzzle.keyData());
  if (secret === undefined) {
    return unavailable("Puzzle has no private key");
  }
  switch (secret.kind) {
    case "hex":
      return { hex: secret.hex, format: hexFormat(puzzle, secret.hex, decoders) };
    case "wif":
      return resolveWifKey(secret.wif, puzzle.chain(), decoders);
    case "encrypted":
      return unavailable("WIF is encrypted");
    case "seed":
      return resolveSeedKey(
        secret,
        puzzle.chain(),
        puzzle.pubkey()?.format ?? PubkeyFormat.Compressed,
        decoders,
      );
    case "mini":
      return unavailable("Mini private keys are not verified");
  }
}

/**
 * Every technique a puzzle was built with, the collection's tags included, like WarpWallet's one.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {Promise<readonly string[]>} The technique names.
 */
async function techniqueNames(puzzle: Puzzle): Promise<readonly string[]> {
  const { getCollection } = await import("./registry.ts");
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

function rebuildFromEntropy(
  puzzle: Puzzle,
  entropy: Entropy,
  path: string | undefined,
  decoders: Wallets,
): Rebuilt {
  const chain = puzzle.chain();
  const recipe = "bip39-entropy";
  if (entropy.passphrase === "Required") {
    return { recipe, key: unavailable("Entropy seed requires an unknown passphrase") };
  }
  try {
    const rebuilt = decoders.privateKeyFromEntropy(
      entropy.hash,
      path,
      chain,
      entropy.passphrase?.Known,
    );
    return rebuilt === undefined
      ? { recipe, key: unavailable(`Seed derivation is not supported for ${chain}`) }
      : {
          recipe,
          path: rebuilt.path,
          key: { hex: rebuilt.hex, format: hexFormat(puzzle, rebuilt.hex, decoders) },
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
    return { recipe: name, key: { hex, format: hexFormat(puzzle, hex, decoders) } };
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
  if (key?.seed?.entropy !== undefined) {
    return rebuildFromEntropy(puzzle, key.seed.entropy, key.seed.path, decoders);
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

function checkKey(
  puzzle: Puzzle,
  crypto: Wallets,
  key: ResolvedKey | UnresolvedKey,
): Check & { readonly hex?: string } {
  if (!("hex" in key)) {
    return { derivedAddress: null, error: key.reason, unavailable: key.unavailable };
  }
  const chain = puzzle.chain();
  const address = puzzle.address();
  try {
    const derivedAddress = crypto.addressFromPrivateKey(key.hex, chain, key.format, address.kind);
    if (derivedAddress === undefined) {
      return {
        derivedAddress: null,
        error: `Unsupported verification chain: ${chain}`,
        unavailable: true,
      };
    }
    const error = crypto.addressesEqual(chain, derivedAddress, address.value)
      ? null
      : `Verification mismatch: expected ${address.value}, got ${derivedAddress}`;
    return { derivedAddress, error, unavailable: false, hex: key.hex };
  } catch (error) {
    return {
      derivedAddress: null,
      error: messageOf(error, "Verification failed"),
      unavailable: crypto.isUnsupportedAddressKind(error),
    };
  }
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
  const checked = checkKey(puzzle, crypto, rebuilt.key);
  return {
    recipe: rebuilt.recipe,
    ...(rebuilt.path === undefined ? {} : { path: rebuilt.path }),
    verified: checked.error === null,
    unavailable: checked.unavailable,
    privateKey: checked.error === null ? (checked.hex ?? null) : null,
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
  const crypto = await (wallets ??= import("./crypto.ts"));
  const published = resolveKey(puzzle, crypto);
  const checked = checkKey(puzzle, crypto, published);
  const rebuilt = await rebuild(puzzle, crypto);
  const id = puzzle.id();
  const expectedAddress = puzzle.address().value;
  const recipe = rebuilt === undefined ? {} : { recipe: checkRecipe(puzzle, crypto, rebuilt) };
  if (checked.error === null && checked.derivedAddress !== null && checked.hex !== undefined) {
    return {
      id,
      verified: true,
      privateKey: checked.hex,
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
