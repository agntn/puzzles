import { createDecipheriv, scryptSync } from "node:crypto";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, concatBytes, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { createBase58check } from "@scure/base";
import { Chain } from "../../src/core/chains.ts";
import { addressFromPrivateKey } from "../../src/core/crypto.ts";
import { AddressKind, PubkeyFormat } from "../../src/core/parts.ts";

/**
 * BIP-38 decryption on Node's native scrypt.
 *
 * The `bip38` package runs scrypt in pure JavaScript, which made one EC-multiplied
 * record cost more than half of the test suite. This follows the decryption steps
 * of BIP-0038 and is pinned to the test vectors of that document.
 */

/** secp256k1 group order, from SEC 2 section 2.4.1. */
const CURVE_ORDER = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;

const base58check = createBase58check(sha256);

/** A decrypted BIP-38 payload. */
export interface DecryptedBip38 {
  readonly compressed: boolean;
  /** Private key as 64 hex characters. */
  readonly privateKey: string;
}

function sha256d(data: Uint8Array): Uint8Array {
  return sha256(sha256(data));
}

function scrypt(
  password: Uint8Array,
  salt: Uint8Array,
  length: number,
  n: number,
  r: number,
  p: number,
): Uint8Array {
  return new Uint8Array(scryptSync(password, salt, length, { N: n, r, p, maxmem: 256 * n * r }));
}

function aesDecrypt(key: Uint8Array, data: Uint8Array): Uint8Array {
  const decipher = createDecipheriv("aes-256-ecb", key, null).setAutoPadding(false);
  return concatBytes(new Uint8Array(decipher.update(data)), new Uint8Array(decipher.final()));
}

function xor(left: Uint8Array, right: Uint8Array): Uint8Array {
  if (left.length !== right.length) {
    throw new RangeError("XOR operands must have the same length");
  }
  return left.map((byte, index) => byte ^ (right[index] ?? 0));
}

function bytesToBigInt(bytes: Uint8Array): bigint {
  return BigInt(`0x${bytesToHex(bytes)}`);
}

function decode(encrypted: string): Uint8Array | undefined {
  try {
    const payload = base58check.decode(encrypted);
    return payload.length === 39 &&
      payload[0] === 0x01 &&
      (payload[1] === 0x42 || payload[1] === 0x43)
      ? payload
      : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Whether the string is a well-formed BIP-38 payload with a valid checksum.
 *
 * @param {string} encrypted - Base58Check string to test.
 * @returns {boolean} Whether the string is a well-formed BIP-38 payload with a valid checksum.
 */
export function isBip38(encrypted: string): boolean {
  return decode(encrypted) !== undefined;
}

function decryptDirect(payload: Uint8Array, password: Uint8Array): Uint8Array {
  const derived = scrypt(password, payload.subarray(3, 7), 64, 16_384, 8, 8);
  return xor(
    aesDecrypt(derived.subarray(32, 64), payload.subarray(7, 39)),
    derived.subarray(0, 32),
  );
}

function decryptMultiplied(payload: Uint8Array, password: Uint8Array, flag: number): Uint8Array {
  const hasLotSequence = (flag & 0x04) !== 0;
  const addressHash = payload.subarray(3, 7);
  const ownerEntropy = payload.subarray(7, 15);
  const ownerSalt = hasLotSequence ? ownerEntropy.subarray(0, 4) : ownerEntropy;
  const prefactor = scrypt(password, ownerSalt, 32, 16_384, 8, 8);
  const passFactor = hasLotSequence ? sha256d(concatBytes(prefactor, ownerEntropy)) : prefactor;
  const passPoint = secp256k1.getPublicKey(passFactor, true);
  const derived = scrypt(passPoint, concatBytes(addressHash, ownerEntropy), 64, 1024, 1, 1);
  const half1 = derived.subarray(0, 32);
  const half2 = derived.subarray(32, 64);
  const tail = xor(aesDecrypt(half2, payload.subarray(23, 39)), half1.subarray(16, 32));
  const encryptedPart1 = concatBytes(payload.subarray(15, 23), tail.subarray(0, 8));
  const seedB = concatBytes(
    xor(aesDecrypt(half2, encryptedPart1), half1.subarray(0, 16)),
    tail.subarray(8, 16),
  );
  const scalar = (bytesToBigInt(passFactor) * bytesToBigInt(sha256d(seedB))) % CURVE_ORDER;
  return hexToBytes(scalar.toString(16).padStart(64, "0"));
}

/**
 * Decrypts a BIP-38 payload and checks its address hash, throwing on a wrong passphrase.
 *
 * @param {string} encrypted - BIP-38 payload to decrypt.
 * @param {string} passphrase - Passphrase that unlocks the payload.
 * @returns {DecryptedBip38} The private key and its compression flag.
 */
export function decryptBip38(encrypted: string, passphrase: string): DecryptedBip38 {
  const payload = decode(encrypted);
  if (payload === undefined) {
    throw new TypeError("Not a BIP-38 payload");
  }
  const flag = payload[2] ?? 0;
  const compressed = (flag & 0x20) !== 0;
  const password = utf8ToBytes(passphrase.normalize("NFC"));
  const privateKey =
    payload[1] === 0x42
      ? decryptDirect(payload, password)
      : decryptMultiplied(payload, password, flag);
  const hex = bytesToHex(privateKey);
  const address = addressFromPrivateKey(
    hex,
    Chain.Bitcoin,
    compressed ? PubkeyFormat.Compressed : PubkeyFormat.Uncompressed,
    AddressKind.P2PKH,
  );
  const expectedHash = bytesToHex(payload.subarray(3, 7));
  if (
    address === undefined ||
    bytesToHex(sha256d(utf8ToBytes(address)).subarray(0, 4)) !== expectedHash
  ) {
    throw new Error("BIP-38 address hash mismatch: wrong passphrase or corrupt payload");
  }
  return { privateKey: hex, compressed };
}
