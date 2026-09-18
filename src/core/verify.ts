import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { addressesEqual, addressFromPrivateKey, wifToPrivateKey } from "./crypto.ts";
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
  format: PubkeyFormat,
): ResolvedKey | UnresolvedKey {
  if (seed.path === undefined) {
    return unavailable("Seed has no derivation path");
  }
  if (!validateMnemonic(seed.phrase, wordlist)) {
    return failed("Invalid BIP39 mnemonic");
  }
  if (seed.passphrase === "Required") {
    return unavailable("Seed requires an unknown passphrase");
  }
  const knownPassphrase = seed.passphrase === undefined ? "" : seed.passphrase.Known;
  try {
    const privateKey = HDKey.fromMasterSeed(
      mnemonicToSeedSync(seed.phrase, knownPassphrase),
    ).derive(seed.path).privateKey;
    if (privateKey === null) {
      return failed("Derived key does not contain private material");
    }
    return { hex: bytesToHex(privateKey), format };
  } catch (error) {
    return failed(error instanceof Error ? error.message : "Seed derivation failed");
  }
}

function resolveWifKey(wif: string): ResolvedKey | UnresolvedKey {
  try {
    const decoded = wifToPrivateKey(wif);
    return {
      hex: decoded.hex,
      format: decoded.compressed ? PubkeyFormat.Compressed : PubkeyFormat.Uncompressed,
    };
  } catch (error) {
    return failed(error instanceof Error ? error.message : "Invalid WIF");
  }
}

function preferredFormat(puzzle: Puzzle): PubkeyFormat {
  return puzzle.pubkey()?.format ?? PubkeyFormat.Compressed;
}

function resolveKey(puzzle: Puzzle): ResolvedKey | UnresolvedKey {
  const secret = secretOf(puzzle.keyData());
  switch (secret?.kind) {
    case undefined:
      return unavailable("Puzzle has no private key");
    case "hex":
      return { hex: secret.hex, format: preferredFormat(puzzle) };
    case "wif":
      return resolveWifKey(secret.wif);
    case "encrypted":
      return unavailable("WIF is encrypted");
    case "seed":
      return resolveSeedKey(secret, preferredFormat(puzzle));
    case "mini":
      return unavailable("Mini private keys are not verified");
  }
}

/**
 * Verifies that a puzzle's known key material derives its stored address.
 *
 * @param {Puzzle} puzzle - The puzzle.
 * @returns {VerifyResult} The outcome, with the derived address when a key was available.
 */
export function verifyPuzzle(puzzle: Puzzle): VerifyResult {
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
  const resolved = resolveKey(puzzle);
  if (!("hex" in resolved)) {
    return fail(resolved.reason, resolved.unavailable);
  }
  try {
    const derivedAddress = addressFromPrivateKey(
      resolved.hex,
      chain,
      resolved.format,
      address.kind,
    );
    if (derivedAddress === undefined) {
      return fail(`Unsupported verification chain: ${chain}`, true);
    }
    if (!addressesEqual(chain, derivedAddress, expectedAddress)) {
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
    return fail(error instanceof Error ? error.message : "Verification failed", false);
  }
}
