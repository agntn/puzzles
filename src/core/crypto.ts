import { type AbstractBlockchain, decodeWIF, encodeWIF, type WIFChain } from "@agntn/keys";
import { Bitcoin } from "@agntn/keys/blockchains/bitcoin";
import { Decred } from "@agntn/keys/blockchains/decred";
import { Ethereum } from "@agntn/keys/blockchains/ethereum";
import { Litecoin } from "@agntn/keys/blockchains/litecoin";
import { Chain } from "./chains.ts";
import { AddressKind, PubkeyFormat } from "./parts.ts";

/**
 * The `@agntn/keys` wallets behind key to address derivation. A record's chain, pubkey format and
 * address kind map onto a wallet, its `compressed` flag and its address type here, and nothing
 * below this module touches a curve or a checksum.
 */

const bitcoin = new Bitcoin();
const litecoin = new Litecoin();
const decred = new Decred();
const ethereum = new Ethereum();

/** Address derivation needs information beyond the record's private key. */
export class UnsupportedAddressKindError extends TypeError {
  override readonly name = "UnsupportedAddressKindError";
}

function walletFor(chain: Chain): AbstractBlockchain | undefined {
  switch (chain) {
    case Chain.Bitcoin:
      return bitcoin;
    case Chain.Litecoin:
      return litecoin;
    case Chain.Decred:
      return decred;
    case Chain.Ethereum:
      return ethereum;
    case Chain.Arweave:
    case Chain.Monero:
      return undefined;
  }
}

function wifChain(chain: Chain): WIFChain {
  switch (chain) {
    case Chain.Bitcoin:
    case Chain.Litecoin:
    case Chain.Decred:
      return chain;
    case Chain.Arweave:
    case Chain.Ethereum:
    case Chain.Monero:
      throw new TypeError(`${chain} has no WIF encoding`);
  }
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
  if (chain === Chain.Ethereum) {
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
 * @param {Chain} chain - Chain the WIF belongs to; Bitcoin, Litecoin and Decred have one.
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
 * @param {Chain} chain - Chain the WIF belongs to; Bitcoin, Litecoin and Decred have one.
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

/**
 * Derives the private key at a BIP39 seed's derivation path. The checksum isn't enforced: the seed
 * is PBKDF2 over the words, a puzzle can publish a phrase whose checksum fails, and the address
 * comparison decides. Keys still refuses a word outside the list.
 *
 * @param {string} phrase - BIP39 mnemonic.
 * @param {string} path - Derivation path such as `m/44'/0'/0'/0/0`.
 * @param {Chain} chain - Chain the seed belongs to.
 * @param {string} [passphrase] - BIP39 passphrase, when the seed has one.
 * @returns {string | undefined} The private key in hex, or `undefined` when the chain has no seed derivation: keys refuses Decred, whose HD keys drop leading zeros.
 */
export function privateKeyFromSeed(
  phrase: string,
  path: string,
  chain: Chain,
  passphrase?: string,
): string | undefined {
  const wallet = walletFor(chain);
  if (wallet === undefined || chain === Chain.Decred) {
    return undefined;
  }
  const derived = wallet.deriveHDWallet(phrase, path, {
    allowInvalidChecksum: true,
    ...(passphrase === undefined ? {} : { passphrase }),
  });
  return derived.keys.private;
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
