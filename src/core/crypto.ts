import { secp256k1 } from "@noble/curves/secp256k1.js";
import { blake256 } from "@noble/hashes/blake1.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { bytesToHex, concatBytes, hexToBytes } from "@noble/hashes/utils.js";
import { base58, base58check, bech32 } from "@scure/base";
import { Chain } from "./chains.ts";
import { AddressKind, PubkeyFormat } from "./parts.ts";

const bitcoinBase58 = base58check(sha256);

function hash160(data: Uint8Array): Uint8Array {
  return ripemd160(sha256(data));
}

function blakeHash160(data: Uint8Array): Uint8Array {
  return ripemd160(blake256(data));
}

function privateKeyBytes(hexKey: string): Uint8Array {
  const bytes = hexToBytes(hexKey);
  if (bytes.length !== 32 || !secp256k1.utils.isValidSecretKey(bytes)) {
    throw new TypeError("Private key must be a valid 32-byte secp256k1 scalar");
  }
  return bytes;
}

function segwitAddress(prefix: "bc" | "ltc", digest: Uint8Array): string {
  return bech32.encode(prefix, [0, ...bech32.toWords(digest)]);
}

/**
 * Derives a secp256k1 public key from a private key.
 *
 * @param {string} hexKey - Private key as 64 hex characters.
 * @param {PubkeyFormat} format - Public key serialization to use.
 * @returns {Uint8Array} The secp256k1 public key.
 */
function publicKeyFromPrivateKey(hexKey: string, format: PubkeyFormat): Uint8Array {
  return secp256k1.getPublicKey(privateKeyBytes(hexKey), format === PubkeyFormat.Compressed);
}

/**
 * Encodes a private key in Bitcoin mainnet WIF.
 *
 * @param {string} hexKey - Private key as 64 hex characters.
 * @param {boolean} compressed - Whether the public key is compressed.
 * @returns {string} The WIF string.
 */
export function privateKeyToWif(hexKey: string, compressed: boolean): string {
  const payload = compressed
    ? concatBytes(Uint8Array.of(0x80), privateKeyBytes(hexKey), Uint8Array.of(0x01))
    : concatBytes(Uint8Array.of(0x80), privateKeyBytes(hexKey));
  return bitcoinBase58.encode(payload);
}

/**
 * Decodes and validates a Bitcoin mainnet WIF.
 *
 * @param {string} wif - Wallet Import Format key.
 * @returns {{ readonly compressed: boolean; readonly hex: string; }} The private key in hex and whether the WIF marks it compressed.
 */
export function wifToPrivateKey(wif: string): {
  readonly compressed: boolean;
  readonly hex: string;
} {
  const payload = bitcoinBase58.decode(wif);
  if (payload[0] !== 0x80) {
    throw new TypeError("WIF must use the Bitcoin mainnet version byte");
  }
  if (payload.length === 34 && payload[33] === 0x01) {
    return { compressed: true, hex: bytesToHex(payload.slice(1, 33)) };
  }
  if (payload.length === 33) {
    return { compressed: false, hex: bytesToHex(payload.slice(1)) };
  }
  throw new TypeError("WIF has an invalid payload length or compression marker");
}

/**
 * Derives a Bitcoin or Litecoin P2PKH/P2WPKH address.
 *
 * @param {string} hexKey - Private key as 64 hex characters.
 * @param {typeof Chain.Bitcoin | typeof Chain.Litecoin} chain - Chain the value belongs to.
 * @param {PubkeyFormat} format - Public key serialization to use.
 * @param {AddressKind} kind - Address encoding.
 * @returns {string} The Bitcoin or Litecoin P2PKH/P2WPKH address.
 */
function utxoAddressFromPrivateKey(
  hexKey: string,
  chain: typeof Chain.Bitcoin | typeof Chain.Litecoin,
  format: PubkeyFormat,
  kind: AddressKind,
): string {
  const digest = hash160(publicKeyFromPrivateKey(hexKey, format));
  switch (kind) {
    case AddressKind.P2WPKH:
      return segwitAddress(chain === Chain.Bitcoin ? "bc" : "ltc", digest);
    case AddressKind.P2PKH:
      return bitcoinBase58.encode(
        concatBytes(Uint8Array.of(chain === Chain.Bitcoin ? 0x00 : 0x30), digest),
      );
    case AddressKind.P2SH:
    case AddressKind.Standard:
      throw new TypeError(`Cannot derive a ${kind} address from a private key alone`);
  }
}

/**
 * Derives an Ethereum address from a secp256k1 private key.
 *
 * @param {string} hexKey - Private key as 64 hex characters.
 * @returns {string} The Ethereum address.
 */
function ethereumAddressFromPrivateKey(hexKey: string): string {
  const publicKey = secp256k1.getPublicKey(privateKeyBytes(hexKey), false);
  return `0x${bytesToHex(keccak_256(publicKey.slice(1)).slice(-20))}`;
}

/**
 * Derives a Decred mainnet P2PKH address from a secp256k1 private key.
 *
 * @param {string} hexKey - Private key as 64 hex characters.
 * @param {PubkeyFormat} format - Public key serialization to use.
 * @returns {string} The Decred mainnet P2PKH address.
 */
function decredAddressFromPrivateKey(hexKey: string, format: PubkeyFormat): string {
  const payload = concatBytes(
    Uint8Array.of(0x07, 0x3f),
    blakeHash160(publicKeyFromPrivateKey(hexKey, format)),
  );
  const checksum = blake256(blake256(payload)).slice(0, 4);
  return base58.encode(concatBytes(payload, checksum));
}

/**
 * Derives the supported chain address for a private key.
 *
 * @param {string} hexKey - Private key as 64 hex characters.
 * @param {Chain} chain - Chain the value belongs to.
 * @param {PubkeyFormat} format - Public key serialization to use.
 * @param {AddressKind} kind - Address encoding.
 * @returns {string | undefined} The derived address, or `undefined` when the chain has no key to address derivation.
 */
export function addressFromPrivateKey(
  hexKey: string,
  chain: Chain,
  format: PubkeyFormat,
  kind: AddressKind,
): string | undefined {
  switch (chain) {
    case Chain.Bitcoin:
    case Chain.Litecoin:
      return utxoAddressFromPrivateKey(hexKey, chain, format, kind);
    case Chain.Decred:
      return decredAddressFromPrivateKey(hexKey, format);
    case Chain.Ethereum:
      return ethereumAddressFromPrivateKey(hexKey);
    case Chain.Arweave:
    case Chain.Monero:
      return undefined;
  }
}

/**
 * Compares a derived address with a stored address using chain semantics.
 *
 * @param {Chain} chain - Chain the value belongs to.
 * @param {string} left - First address.
 * @param {string} right - Second address.
 * @returns {boolean} Whether both addresses denote the same target.
 */
export function addressesEqual(chain: Chain, left: string, right: string): boolean {
  return chain === Chain.Ethereum ? left.toLowerCase() === right.toLowerCase() : left === right;
}
