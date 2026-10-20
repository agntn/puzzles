import { create } from "@agntn/ciphers";
import { sha512 } from "@agntn/hashes";
import { type ArweaveJWK, getAddress } from "@agntn/keys/arweave";

/**
 * Tiamat's `decodewallet`, the routine every Puzzle Weave page opens its keyfile with. The recipe
 * belongs to the puzzles, so it lives here and not in ciphers. `verify` imports this module only
 * for a record that holds a keyfile.
 */

/** SHA-512 over the answer, then 11,512 more passes over the raw digest. */
const HASH_ROUNDS = 11_513;

/** `CryptoJS.algo.AES.keySize = 32` counts words, so the pages run AES with a 1024-bit key. */
const KEY_LENGTH = 1024;

/** `CryptoJS.algo.EvpKDF.cfg.iterations = 1e4`. */
const KDF_ITERATIONS = 10_000;

/** An opened keyfile: the JWK as the page would download it, and the address its modulus gives. */
export interface OpenedKeyfile {
  readonly address: string;
  readonly keyfile: string;
}

/**
 * The passphrase the page hands CryptoJS: the hex of the last SHA-512 in the chain.
 *
 * @param {string} answer - The answer exactly as typed into the page.
 * @returns {string} 128 hex digits.
 */
function passphraseOf(answer: string): string {
  let digest = sha512(new TextEncoder().encode(answer));
  for (let round = 1; round < HASH_ROUNDS; round++) {
    digest = sha512(digest);
  }
  return digest.toHex();
}

/**
 * Opens a sealed keyfile with its answer and derives the Arweave address of the key inside.
 *
 * @param {string} encrypted - The page's `var msg`, base64 starting `U2FsdGVkX1`.
 * @param {string} answer - The answer exactly as typed into the page.
 * @returns {OpenedKeyfile} The keyfile JSON and its address.
 * @throws {Error} When the answer doesn't open it, or what comes out isn't an RSA JWK.
 */
export function openKeyfile(encrypted: string, answer: string): OpenedKeyfile {
  const { text } = create("aes-passphrase").decode(encrypted, {
    key: passphraseOf(answer),
    keyLength: KEY_LENGTH,
    iterations: KDF_ITERATIONS,
  });
  return { keyfile: text, address: getAddress(JSON.parse(text) as ArweaveJWK) };
}
