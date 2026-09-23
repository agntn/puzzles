import type { Chain } from "./chains.ts";
import { PubkeyFormat, type Secret, secretOf } from "./parts.ts";
import { type Puzzle } from "./puzzle.ts";

/** Successful puzzle key verification. */
export interface VerifySuccess {
  readonly derivedAddress: string;
  readonly error: null;
  readonly expectedAddress: string;
  readonly id: string;
  readonly privateKey: string;
  readonly verified: true;
}

/** Failed or unavailable puzzle key verification. */
export interface VerifyFailure {
  readonly derivedAddress: string | null;
  readonly error: string;
  readonly expectedAddress: string;
  readonly id: string;
  readonly privateKey: null;
  /** True when the key material can't be checked at all, false when checkable material failed to match. */
  readonly unavailable: boolean;
  readonly verified: false;
}

/** Result of verifying a puzzle's known key material. */
export type VerifyResult = VerifySuccess | VerifyFailure;

/** The decoders a secret needs, from the keys wallets that `verifyPuzzle` loads on its first call. */
type Decoders = Pick<typeof import("./crypto.ts"), "privateKeyFromSeed" | "wifToPrivateKey">;

interface ResolvedKey {
  readonly format: PubkeyFormat;
  readonly hex: string;
}

interface UnresolvedKey {
  readonly reason: string;
  readonly unavailable: boolean;
}

function unavailable(reason: string): UnresolvedKey {
  return { reason, unavailable: true };
}

function failed(reason: string): UnresolvedKey {
  return { reason, unavailable: false };
}

function resolveSeedKey(
  seed: Extract<Secret, { kind: "seed" }>,
  chain: Chain,
  format: PubkeyFormat,
  decoders: Decoders,
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
    return failed(error instanceof Error ? error.message : "Seed derivation failed");
  }
}

function resolveWifKey(wif: string, chain: Chain, decoders: Decoders): ResolvedKey | UnresolvedKey {
  try {
    const decoded = decoders.wifToPrivateKey(wif, chain);
    return {
      hex: decoded.hex,
      format: decoded.compressed ? PubkeyFormat.Compressed : PubkeyFormat.Uncompressed,
    };
  } catch (error) {
    return failed(error instanceof Error ? error.message : "Invalid WIF");
  }
}

function hexFormat(puzzle: Puzzle, hex: string, decoders: Decoders): PubkeyFormat {
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

function resolveKey(puzzle: Puzzle, decoders: Decoders): ResolvedKey | UnresolvedKey {
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
 * Verifies that a puzzle's known key material derives its stored address. The first call loads
 * the keys wallets; later calls reuse them.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {Promise<VerifyResult>} The outcome, with the derived address when a key was available.
 */
export async function verifyPuzzle(puzzle: Puzzle): Promise<VerifyResult> {
  const crypto = await import("./crypto.ts");
  const id = puzzle.id();
  const chain = puzzle.chain();
  const address = puzzle.address();
  const expectedAddress = address.value;
  const fail = (
    error: string,
    unavailable: boolean,
    derivedAddress: string | null = null,
  ): VerifyFailure => ({
    id,
    verified: false,
    privateKey: null,
    expectedAddress,
    derivedAddress,
    unavailable,
    error,
  });
  const resolved = resolveKey(puzzle, crypto);
  if (!("hex" in resolved)) {
    return fail(resolved.reason, resolved.unavailable);
  }
  try {
    const derivedAddress = crypto.addressFromPrivateKey(
      resolved.hex,
      chain,
      resolved.format,
      address.kind,
    );
    if (derivedAddress === undefined) {
      return fail(`Unsupported verification chain: ${chain}`, true);
    }
    if (!crypto.addressesEqual(chain, derivedAddress, expectedAddress)) {
      return fail(
        `Verification mismatch: expected ${expectedAddress}, got ${derivedAddress}`,
        false,
        derivedAddress,
      );
    }
    return {
      id,
      verified: true,
      privateKey: resolved.hex,
      expectedAddress,
      derivedAddress,
      error: null,
    };
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Verification failed",
      error instanceof crypto.UnsupportedAddressKindError,
    );
  }
}
