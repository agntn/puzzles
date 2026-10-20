import { type AbstractBlockchain, getBlockchainPath } from "@agntn/keys";
import { bip39, entropyToMnemonic, mnemonicToSeed } from "@agntn/keys/bip39";
import { deriveHDKey, getMasterKeyFromSeed } from "@agntn/keys/bip32";
import { deriveSeed } from "@agntn/keys/electrum";
import { address as scriptAddress, multisig } from "@agntn/keys/script";

export { loadWordlist } from "@agntn/keys/bip39";
import { type BrainwalletRecipe, derive } from "@agntn/keys/brainwallet";
import { decode as decodeWIF, encode as encodeWIF, type WIFChain } from "@agntn/keys/wif";
import { Base } from "@agntn/keys/blockchains/base";
import { Bitcoin } from "@agntn/keys/blockchains/bitcoin";
import { BitcoinCash } from "@agntn/keys/blockchains/bitcoincash";
import { Decred } from "@agntn/keys/blockchains/decred";
import { Dogecoin } from "@agntn/keys/blockchains/dogecoin";
import { ECash } from "@agntn/keys/blockchains/ecash";
import { Ethereum } from "@agntn/keys/blockchains/ethereum";
import { Litecoin } from "@agntn/keys/blockchains/litecoin";
import { Chain } from "./chains.ts";
import { AddressKind, PubkeyFormat } from "./parts.ts";

/**
 * The `@agntn/keys` wallets behind key to address derivation. A record's chain, pubkey format and
 * address kind map onto a wallet, its `compressed` flag and its address type here, and nothing
 * below this module touches a curve or a checksum.
 */

/** Arweave and Monero have no key to address derivation here. */
const wallets: Readonly<Record<Chain, AbstractBlockchain | undefined>> = {
  arweave: undefined,
  base: new Base(),
  bitcoin: new Bitcoin(),
  bitcoincash: new BitcoinCash(),
  decred: new Decred(),
  dogecoin: new Dogecoin(),
  ecash: new ECash(),
  ethereum: new Ethereum(),
  litecoin: new Litecoin(),
  monero: undefined,
};

/**
 * The WIF version each chain writes. Bitcoin Cash kept Bitcoin's version byte when it forked, and
 * eCash kept Bitcoin Cash's. Arweave, Base, Ethereum and Monero have no WIF.
 */
const wifChains: Readonly<Record<Chain, WIFChain | undefined>> = {
  arweave: undefined,
  base: undefined,
  bitcoin: "bitcoin",
  bitcoincash: "bitcoin",
  decred: "decred",
  dogecoin: "dogecoin",
  ecash: "bitcoin",
  ethereum: undefined,
  litecoin: "litecoin",
  monero: undefined,
};

/** Address derivation needs information beyond the record's private key. */
export class UnsupportedAddressKindError extends TypeError {
  override readonly name = "UnsupportedAddressKindError";
}

/**
 * Ethereum and Base share the Keccak address, one shape for every key.
 *
 * @param {Chain} chain - Chain the address belongs to.
 * @returns {boolean} Whether the chain writes Ethereum addresses.
 */
function isEvm(chain: Chain): boolean {
  return chain === Chain.Ethereum || chain === Chain.Base;
}

function walletFor(chain: Chain): AbstractBlockchain | undefined {
  return wallets[chain];
}

function wifChain(chain: Chain): WIFChain {
  const version = wifChains[chain];
  if (version === undefined) {
    throw new TypeError(`${chain} has no WIF encoding`);
  }
  return version;
}

/**
 * Maps an address kind onto the keys address type. Standard is for chains without script kinds,
 * so on a UTXO chain it names nothing a key could derive.
 *
 * @param {Chain} chain - Chain the address belongs to.
 * @param {AddressKind} kind - Address encoding.
 * @returns {string | undefined} The keys address type, or `undefined` where the wallet has one shape.
 */
function addressType(chain: Chain, kind: AddressKind): string | undefined {
  if (isEvm(chain)) {
    return undefined;
  }
  switch (kind) {
    case AddressKind.P2PKH:
      return "legacy";
    case AddressKind.P2WPKH:
      return "segwit";
    case AddressKind.P2SH:
    case AddressKind.P2WSH:
    case AddressKind.Standard:
      throw new UnsupportedAddressKindError(
        `Cannot derive a ${kind} address from a private key alone`,
      );
  }
}

/**
 * Encodes a private key as the chain's mainnet WIF.
 *
 * @param {string} hexKey - Private key as 64 hex characters.
 * @param {Chain} chain - Chain the WIF belongs to; Bitcoin, Bitcoin Cash, eCash, Litecoin, Decred and Dogecoin have one.
 * @param {boolean} compressed - Whether the public key is compressed.
 * @returns {string} The WIF string.
 */
export function privateKeyToWif(hexKey: string, chain: Chain, compressed: boolean): string {
  return encodeWIF(hexKey, { chain: wifChain(chain), compressed });
}

/**
 * Decodes a mainnet WIF against the chain the record says it belongs to.
 *
 * @param {string} wif - Wallet Import Format key.
 * @param {Chain} chain - Chain the WIF belongs to; Bitcoin, Bitcoin Cash, eCash, Litecoin, Decred and Dogecoin have one.
 * @returns {{ readonly compressed: boolean; readonly hex: string; }} The private key in hex and whether the WIF marks it compressed.
 */
export function wifToPrivateKey(
  wif: string,
  chain: Chain,
): {
  readonly compressed: boolean;
  readonly hex: string;
} {
  const decoded = decodeWIF(wif, { chain: wifChain(chain) });
  return { compressed: decoded.compressed, hex: decoded.privateKey };
}

/** Where a BIP39 seed derives and what it takes besides its words. */
export interface SeedOptions {
  readonly chain: Chain;
  readonly passphrase?: string | undefined;
  /** Derivation path such as `m/44'/0'/0'/0/0`. */
  readonly path: string;
  /** PBKDF2 rounds, BIP39's 2048 when absent. */
  readonly rounds?: number | undefined;
  /** A list other than English, from `loadWordlist`. */
  readonly wordlist?: readonly string[] | undefined;
}

/**
 * Derives the key at a BIP39 seed's path. The checksum isn't enforced, the address decides, but a
 * word off the list fails in keys. Other rounds run after the standard 2048, which carry that
 * check: `mnemonicToSeed` counts the words and reads no list.
 *
 * @param {string} phrase - BIP39 mnemonic.
 * @param {SeedOptions} options - Chain, path, passphrase, rounds and word list.
 * @returns {string | undefined} The private key in hex, or `undefined` when the chain has no seed derivation: keys refuses Decred, whose HD keys drop leading zeros.
 */
export function privateKeyFromSeed(phrase: string, options: SeedOptions): string | undefined {
  const { chain, passphrase, path, rounds, wordlist } = options;
  const wallet = walletFor(chain);
  if (wallet === undefined || chain === Chain.Decred) {
    return undefined;
  }
  const derived = wallet.deriveHDWallet(phrase, {
    path,
    allowInvalidChecksum: true,
    ...(passphrase === undefined ? {} : { passphrase }),
    ...(wordlist === undefined ? {} : { wordlist }),
  });
  if (rounds === undefined) {
    return derived.keys.private;
  }
  const seed = mnemonicToSeed(
    phrase,
    passphrase === undefined ? { rounds } : { passphrase, rounds },
  );
  return privateKeyAt(seed, path);
}

/**
 * The key at an Electrum seed's path: Electrum's salt, then plain BIP32. Old and 2FA seeds fail.
 *
 * @param {string} phrase - Electrum standard or SegWit seed phrase.
 * @param {string} path - Derivation path such as `m/0'/0/0`.
 * @param {Chain} chain - Chain the seed belongs to.
 * @param {string} [passphrase] - Electrum seed extension, when the seed has one.
 * @returns {string | undefined} The key in hex, or `undefined` where the chain has no HD wallet.
 */
export function privateKeyFromElectrumSeed(
  phrase: string,
  path: string,
  chain: Chain,
  passphrase?: string,
): string | undefined {
  if (walletFor(chain) === undefined || chain === Chain.Decred) {
    return undefined;
  }
  return privateKeyAt(deriveSeed(phrase, passphrase).seed, path);
}

function privateKeyAt(seed: Uint8Array, path: string): string {
  const { privateKey } = deriveHDKey(getMasterKeyFromSeed(seed), path);
  if (privateKey === null) {
    throw new TypeError("No private key at the derivation path");
  }
  return privateKey.toHex();
}

/**
 * Rebuilds a key from BIP39 entropy, at the BIP39 tool's default path when the record has none.
 *
 * @param {string} hash - Entropy in hex, 16 to 32 bytes.
 * @param {EntropyOptions} options - Chain, path if any, passphrase, rounds and word list.
 * @returns {{ readonly hex: string; readonly path: string } | undefined} The private key in hex and the path it came from, or `undefined` when the chain has no seed derivation.
 */
export function privateKeyFromEntropy(
  hash: string,
  options: EntropyOptions,
): { readonly hex: string; readonly path: string } | undefined {
  const wallet = walletFor(options.chain);
  if (wallet === undefined) {
    return undefined;
  }
  const path = options.path ?? getBlockchainPath(wallet);
  const entropy = Uint8Array.fromHex(hash);
  const phrase =
    options.wordlist === undefined
      ? entropyToMnemonic(entropy)
      : bip39.entropyToMnemonic(entropy, [...options.wordlist]);
  const hex = privateKeyFromSeed(phrase, { ...options, path });
  return hex === undefined ? undefined : { hex, path };
}

/** A seed rebuilt from entropy, which may leave the path to the chain's first receive address. */
export interface EntropyOptions extends Omit<SeedOptions, "path"> {
  readonly path?: string | undefined;
}

/**
 * Rebuilds a brainwallet key from its passphrase.
 *
 * @param {string} passphrase - Passphrase as the record holds it.
 * @param {BrainwalletRecipe} recipe - The KDF, here SHA-256 with its rounds.
 * @returns {string} The private key in hex.
 */
export function privateKeyFromPassphrase(passphrase: string, recipe: BrainwalletRecipe): string {
  return derive(passphrase, recipe).toHex();
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
  const wallet = walletFor(chain);
  if (wallet === undefined) {
    return undefined;
  }
  const publicKey = wallet.getKeyPublic(hexKey, {
    compressed: format === PubkeyFormat.Compressed,
  });
  return wallet.getAddress(publicKey, addressType(chain, kind));
}

/** One cosigner's private key and the serialization of its public key in the script. */
export interface CosignerKey {
  readonly format: PubkeyFormat;
  readonly hex: string;
}

/** The chain and the witness script the record holds for a multisig address. */
export interface WitnessScript {
  /** Keys writes script addresses for Bitcoin only. */
  readonly chain: Chain;
  /** In hex. */
  readonly script: string;
}

/** `OP_1`, where the opcodes that push a multisig threshold start. */
const OP_1 = 0x51;

/**
 * The P2WSH address of the multisig the keys rebuild, in the recorded script's threshold and order.
 *
 * @param {readonly CosignerKey[]} keys - Every cosigner's key.
 * @param {WitnessScript} witness - The chain and the recorded witness script.
 * @returns {string} The address the rebuilt script hashes to.
 * @throws {UnsupportedAddressKindError} On a chain other than Bitcoin.
 */
export function addressFromCosigners(keys: readonly CosignerKey[], witness: WitnessScript): string {
  const { chain, script: witnessScript } = witness;
  const wallet = walletFor(chain);
  if (chain !== Chain.Bitcoin || wallet === undefined) {
    throw new UnsupportedAddressKindError(`Cannot derive a p2wsh address on ${chain}`);
  }
  const publicKeys = keys.map((key) =>
    wallet.getKeyPublic(key.hex, { compressed: key.format === PubkeyFormat.Compressed }),
  );
  const threshold = Number.parseInt(witnessScript.slice(0, 2), 16) - OP_1 + 1;
  const listed = multisig(publicKeys, { threshold });
  const script =
    listed.toHex() === witnessScript.toLowerCase()
      ? listed
      : multisig(publicKeys, { threshold, sorted: true });
  return scriptAddress(script, { addressType: "p2wsh" });
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
  return isEvm(chain) ? left.toLowerCase() === right.toLowerCase() : left === right;
}

/**
 * Tells "keys can't derive this" apart from "this key is wrong".
 *
 * @param {unknown} error - The thrown value.
 * @returns {boolean} Whether the address kind needs more than a private key.
 */
export function isUnsupportedAddressKind(error: unknown): boolean {
  return error instanceof UnsupportedAddressKindError;
}
