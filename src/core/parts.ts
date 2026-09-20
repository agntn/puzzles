/** Address encodings used by puzzle targets. */
export const AddressKind = {
  P2PKH: "p2pkh",
  P2SH: "p2sh",
  P2WPKH: "p2wpkh",
  Standard: "standard",
} as const;

/** An address encoding. */
export type AddressKind = (typeof AddressKind)[keyof typeof AddressKind];

/** A P2SH redeem script and its HASH160. */
export interface RedeemScript {
  readonly hash: string;
  readonly script: string;
}

/** A puzzle target address. */
export interface Address {
  readonly hash160?: string;
  readonly kind: AddressKind;
  readonly redeem_script?: RedeemScript;
  readonly value: string;
}

/** Public key serializations. */
export const PubkeyFormat = {
  Compressed: "compressed",
  Uncompressed: "uncompressed",
} as const;

/** A public key serialization. */
export type PubkeyFormat = (typeof PubkeyFormat)[keyof typeof PubkeyFormat];

/** A public key exposed by a puzzle address. */
export interface Pubkey {
  readonly format: PubkeyFormat;
  readonly value: string;
}

/** Transaction roles recorded for a puzzle address. */
export const TransactionType = {
  Claim: "claim",
  Decrease: "decrease",
  Funding: "funding",
  Increase: "increase",
  PubkeyReveal: "pubkey_reveal",
  Sweep: "sweep",
} as const;

/** A transaction role. */
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

/** A recorded on-chain transaction. */
export interface Transaction {
  readonly amount: number;
  readonly date: string;
  readonly tx_type: TransactionType;
  readonly txid: string;
}

/** A public profile link. */
export interface Profile {
  readonly name: string;
  readonly url: string;
}

/** A puzzle author or solver. */
export interface Party {
  readonly addresses?: readonly string[];
  readonly name?: string;
  readonly profiles?: readonly Profile[];
}

/** Files shipped with a puzzle. */
export interface Assets {
  readonly hints?: readonly string[];
  readonly puzzle?: string;
  readonly solver?: string;
  readonly source_url?: string;
}

/** Who gave a hint: the puzzle's author, or someone else. */
export const HintKind = {
  Community: "community",
  Official: "official",
} as const;

/** A hint's origin. */
export type HintKind = (typeof HintKind)[keyof typeof HintKind];

/** What confirms where a hint came from: an archive capture, the author's reply, a transaction. */
export interface Confirmation {
  readonly description?: string;
  readonly url: string;
}

/** A published answer to one hint, not a verified solution of the puzzle. */
export interface Answer {
  readonly text: string;
  readonly source: string;
  readonly date?: string;
}

/** Optional hint metadata; an answer has its own source and publication date. */
export interface HintOptions {
  readonly date?: string;
  readonly answer?: Answer;
}

/**
 * One hint about a puzzle. `official` comes from the author, `community` from anyone else and
 * may be wrong; both say where they were published and what confirms that, never whether they
 * are right.
 */
export interface Hint {
  readonly answer?: Answer;
  readonly confirmation: Confirmation;
  readonly date?: string;
  readonly kind: HintKind;
  readonly source: string;
  readonly text: string;
}

/** Where external entropy came from. */
export interface EntropySource {
  readonly description?: string;
  readonly url?: string;
}

/** A known or required-but-unknown BIP39 passphrase. */
export type Passphrase = "Required" | { readonly Known: string };

/** External entropy used to derive a seed. */
export interface Entropy {
  readonly hash: string;
  readonly passphrase?: Passphrase;
  readonly source?: EntropySource;
}

/** BIP39 seed material and its derivation path. */
export interface Seed {
  readonly entropy?: Entropy;
  readonly path?: string;
  readonly phrase?: string;
  readonly xpub?: string;
}

/** Wallet Import Format material. */
export interface Wif {
  readonly decrypted?: string;
  readonly encrypted?: string;
  readonly passphrase?: string;
  readonly salt?: string;
}

/** One published secret sharing share. */
export interface Share {
  readonly data: string;
  readonly index: number;
}

/** Secret-sharing scheme metadata. */
export interface Shares {
  readonly shares: readonly Share[];
  readonly threshold: number;
  readonly total: number;
}

/** Serialized private key material. */
export interface KeyData {
  readonly bits?: number;
  readonly hex?: string;
  readonly mini?: string;
  readonly seed?: Seed;
  readonly shares?: Shares;
  readonly wif?: Wif;
}

/** The one private key representation a key record exposes, in precedence order. */
export type Secret =
  | { readonly kind: "hex"; readonly hex: string }
  | { readonly kind: "wif"; readonly wif: string }
  | { readonly kind: "encrypted"; readonly encrypted: string }
  | {
      readonly kind: "seed";
      readonly phrase: string;
      readonly path?: string | undefined;
      readonly passphrase?: Passphrase | undefined;
    }
  | { readonly kind: "mini"; readonly mini: string };

/**
 * The private key representation a key record exposes. `hasPrivateKey()` and verification read the
 * same answer, so a path or an xpub alone counts as no key for both.
 *
 * @param {KeyData | undefined} key - Serialized key material.
 * @returns {Secret | undefined} The secret, or `undefined` when the record has none.
 */
export function secretOf(key: KeyData | undefined): Secret | undefined {
  if (key === undefined) {
    return undefined;
  }
  return hexSecret(key) ?? wifSecret(key) ?? seedSecret(key) ?? miniSecret(key);
}

function hexSecret(key: KeyData): Secret | undefined {
  return key.hex === undefined ? undefined : { kind: "hex", hex: key.hex };
}

function wifSecret(key: KeyData): Secret | undefined {
  if (key.wif?.decrypted !== undefined) {
    return { kind: "wif", wif: key.wif.decrypted };
  }
  if (key.wif?.encrypted !== undefined) {
    return { kind: "encrypted", encrypted: key.wif.encrypted };
  }
  return undefined;
}

function seedSecret(key: KeyData): Secret | undefined {
  if (key.seed?.phrase === undefined) {
    return undefined;
  }
  return {
    kind: "seed",
    phrase: key.seed.phrase,
    path: key.seed.path,
    passphrase: key.seed.entropy?.passphrase,
  };
}

function miniSecret(key: KeyData): Secret | undefined {
  return key.mini === undefined ? undefined : { kind: "mini", mini: key.mini };
}

/**
 * Drops the keys whose value is `undefined`, so a record never carries a key it has no value for
 * and nothing serializes as null.
 *
 * @param {Readonly<Record<string, unknown>>} value - Record whose `undefined` entries are dropped.
 * @returns {T} The same record without its `undefined` entries.
 */
export function defined<T>(value: Readonly<Record<string, unknown>>): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

/**
 * Freezes a record and everything nested in it, so the data a factory took stays as written. A
 * frozen object refuses a new value in strict mode, and every module here is strict. The walk
 * goes on below an object that is frozen already, because a shallow `Object.freeze` by the caller
 * leaves the parts under it open, and it visits each object once, so a shared or circular part
 * ends it.
 *
 * @param {T} value - Record, array or primitive to freeze.
 * @returns {T} The same value, frozen through.
 */
export function frozen<T>(value: T): T {
  const seen = new WeakSet<object>();
  const walk = (item: unknown): void => {
    if (typeof item !== "object" || item === null || seen.has(item)) {
      return;
    }
    seen.add(item);
    Object.freeze(item);
    for (const nested of Object.values(item)) {
      walk(nested);
    }
  };
  walk(value);
  return value;
}

function address(kind: AddressKind, value: string, hash160?: string): Address {
  return defined({ value, kind, hash160 });
}

/**
 * Builds a legacy pay-to-public key-hash address.
 *
 * @param {string} value - Encoded address.
 * @param {string} [hash160] - HASH160 of the public key, in hex.
 * @returns {Address} The legacy pay-to-public key-hash address.
 */
export function p2pkh(value: string, hash160?: string): Address {
  return address(AddressKind.P2PKH, value, hash160);
}

/**
 * Builds a pay-to-witness-public key-hash address.
 *
 * @param {string} value - Encoded address.
 * @param {string} [hash160] - HASH160 of the public key, in hex.
 * @returns {Address} The pay-to-witness-public key-hash address.
 */
export function p2wpkh(value: string, hash160?: string): Address {
  return address(AddressKind.P2WPKH, value, hash160);
}

/**
 * Builds a pay-to-script-hash address with its redeem script.
 *
 * @param {string} value - Encoded address.
 * @param {string} hash160 - HASH160 of the redeem script, in hex.
 * @param {RedeemScript} [redeemScript] - Redeem script, when the puzzle publishes it.
 * @returns {Address} The pay-to-script-hash address.
 */
export function p2sh(value: string, hash160: string, redeemScript?: RedeemScript): Address {
  return defined({ value, kind: AddressKind.P2SH, hash160, redeem_script: redeemScript });
}

/**
 * Builds an address for chains without Bitcoin script kinds.
 *
 * @param {string} value - Encoded address.
 * @param {string} [hash160] - HASH160 of the public key, in hex.
 * @returns {Address} The address record.
 */
export function standard(value: string, hash160?: string): Address {
  return address(AddressKind.Standard, value, hash160);
}

/**
 * Builds a redeem script record.
 *
 * @param {string} hash - HASH160 of the script, in hex.
 * @param {string} script - Redeem script in hex.
 * @returns {RedeemScript} The redeem script record.
 */
export function redeemScript(hash: string, script: string): RedeemScript {
  return { hash, script };
}

/**
 * Marks a public key as compressed.
 *
 * @param {string} value - Public key in hex.
 * @returns {Pubkey} The public key.
 */
export function compressed(value: string): Pubkey {
  return { value, format: PubkeyFormat.Compressed };
}

/**
 * Marks a public key as uncompressed.
 *
 * @param {string} value - Public key in hex.
 * @returns {Pubkey} The public key.
 */
export function uncompressed(value: string): Pubkey {
  return { value, format: PubkeyFormat.Uncompressed };
}

/**
 * Private key material assembled through chained calls. Each call returns a new builder and every
 * record is frozen, so what a puzzle hands back through `key()` and `keyData()` stays as written.
 */
export class Key {
  readonly #data: KeyData;

  /** Starts an empty key record, or freezes the one it is given. */
  constructor(data: KeyData = {}) {
    this.#data = frozen(data);
  }

  #with(patch: KeyData): Key {
    return new Key({ ...this.#data, ...patch });
  }

  /**
   * Records the raw private key in hex, with an optional bit length.
   *
   * @param {string} value - Private key in hex.
   * @param {number} [bits] - Search space width in bits.
   * @returns {Key} A new builder with the value recorded.
   */
  hex(value: string, bits?: number): Key {
    return this.#with(defined({ hex: value, bits }));
  }

  /**
   * Records the search space width in bits.
   *
   * @param {number} value - Search space width in bits.
   * @returns {Key} A new builder with the value recorded.
   */
  bits(value: number): Key {
    return this.#with({ bits: value });
  }

  /**
   * Records a decrypted Wallet Import Format key.
   *
   * @param {string} decrypted - Decrypted Wallet Import Format key.
   * @returns {Key} A new builder with the value recorded.
   */
  wif(decrypted: string): Key {
    return this.#with({ wif: { ...this.#data.wif, decrypted } });
  }

  /**
   * Records an encrypted BIP38 payload and, when known, its passphrase.
   *
   * @param {string} payload - Encrypted BIP38 payload.
   * @param {Readonly<{ passphrase?: string; salt?: string }>} [options] - Passphrase and salt, when known.
   * @returns {Key} A new builder with the value recorded.
   */
  encrypted(payload: string, options: Readonly<{ passphrase?: string; salt?: string }> = {}): Key {
    return this.#with({ wif: defined({ ...this.#data.wif, encrypted: payload, ...options }) });
  }

  /**
   * Records the passphrase that produced the key.
   *
   * @param {string} value - Passphrase in clear text.
   * @returns {Key} A new builder with the value recorded.
   */
  passphrase(value: string): Key {
    return this.#with({ wif: { ...this.#data.wif, passphrase: value } });
  }

  /**
   * Records the salt the key derivation used, for example a WarpWallet email.
   *
   * @param {string} value - Salt string.
   * @returns {Key} A new builder with the value recorded.
   */
  salt(value: string): Key {
    return this.#with({ wif: { ...this.#data.wif, salt: value } });
  }

  /**
   * Records a BIP39 seed phrase and its derivation path.
   *
   * @param {string} phrase - BIP39 mnemonic phrase.
   * @param {string} [path] - BIP32 derivation path.
   * @returns {Key} A new builder with the value recorded.
   */
  seed(phrase: string, path?: string): Key {
    return this.#with({ seed: defined({ ...this.#data.seed, phrase, path }) });
  }

  /**
   * Records a derivation path without a known phrase.
   *
   * @param {string} value - BIP32 derivation path.
   * @returns {Key} A new builder with the value recorded.
   */
  path(value: string): Key {
    return this.#with({ seed: { ...this.#data.seed, path: value } });
  }

  /**
   * Records the extended public key of a seed.
   *
   * @param {string} value - Extended public key.
   * @returns {Key} A new builder with the value recorded.
   */
  xpub(value: string): Key {
    return this.#with({ seed: { ...this.#data.seed, xpub: value } });
  }

  /**
   * Records external entropy that seeds the key.
   *
   * @param {string} hash - Hash of the entropy, in hex.
   * @param {EntropySource} [source] - Where the entropy came from.
   * @param {Passphrase} [passphrase] - BIP39 passphrase, known or marked required.
   * @returns {Key} A new builder with the value recorded.
   */
  entropy(hash: string, source?: EntropySource, passphrase?: Passphrase): Key {
    return this.#with({
      seed: { ...this.#data.seed, entropy: defined({ hash, source, passphrase }) },
    });
  }

  /**
   * Records a mini private key.
   *
   * @param {string} value - Mini private key.
   * @returns {Key} A new builder with the value recorded.
   */
  mini(value: string): Key {
    return this.#with({ mini: value });
  }

  /**
   * Records a secret sharing scheme and its published shares.
   *
   * @param {number} threshold - Shares needed to recover the key.
   * @param {number} total - Shares issued in total.
   * @param {readonly Share[]} published - Shares the author published.
   * @returns {Key} A new builder with the value recorded.
   */
  shares(threshold: number, total: number, published: readonly Share[]): Key {
    return this.#with({ shares: { threshold, total, shares: published } });
  }

  /**
   * Returns the serializable key record.
   *
   * @returns {KeyData} The serializable key record.
   */
  data(): KeyData {
    return this.#data;
  }
}

/**
 * Starts key material from a raw hex private key.
 *
 * @param {string} value - Private key in hex.
 * @param {number} [bits] - Search space width in bits.
 * @returns {Key} The builder, for chaining.
 */
export function hex(value: string, bits?: number): Key {
  return new Key().hex(value, bits);
}

/**
 * Starts key material from a search space width.
 *
 * @param {number} value - Search space width in bits.
 * @returns {Key} The builder, for chaining.
 */
export function bits(value: number): Key {
  return new Key().bits(value);
}

/**
 * Starts key material from a decrypted Wallet Import Format key.
 *
 * @param {string} decrypted - Decrypted Wallet Import Format key.
 * @returns {Key} The builder, for chaining.
 */
export function wif(decrypted: string): Key {
  return new Key().wif(decrypted);
}

/**
 * Starts key material from an encrypted BIP38 payload.
 *
 * @param {string} payload - Encrypted BIP38 payload.
 * @param {Readonly<{ passphrase?: string; salt?: string }>} [options] - Passphrase and salt, when known.
 * @returns {Key} The builder, for chaining.
 */
export function encryptedWif(
  payload: string,
  options: Readonly<{ passphrase?: string; salt?: string }> = {},
): Key {
  return new Key().encrypted(payload, options);
}

/**
 * Starts key material from a known passphrase, with the key itself still unpublished.
 *
 * @param {string} value - Passphrase in clear text.
 * @returns {Key} The builder, for chaining.
 */
export function passphrase(value: string): Key {
  return new Key().passphrase(value);
}

/**
 * Starts key material from a BIP39 seed phrase.
 *
 * @param {string} phrase - BIP39 mnemonic phrase.
 * @param {string} [path] - BIP32 derivation path.
 * @returns {Key} The builder, for chaining.
 */
export function seed(phrase: string, path?: string): Key {
  return new Key().seed(phrase, path);
}

/**
 * Starts key material from a derivation path alone.
 *
 * @param {string} path - BIP32 derivation path.
 * @returns {Key} The builder, for chaining.
 */
export function derivation(path: string): Key {
  return new Key().path(path);
}

/**
 * Starts key material from a mini private key.
 *
 * @param {string} value - Mini private key.
 * @returns {Key} The builder, for chaining.
 */
export function mini(value: string): Key {
  return new Key().mini(value);
}

/**
 * Starts key material from a secret sharing scheme.
 *
 * @param {number} threshold - Shares needed to recover the key.
 * @param {number} total - Shares issued in total.
 * @param {readonly Share[]} published - Shares the author published.
 * @returns {Key} The builder, for chaining.
 */
export function shares(threshold: number, total: number, published: readonly Share[]): Key {
  return new Key().shares(threshold, total, published);
}

/**
 * One published secret sharing share.
 *
 * @param {number} index - Share index.
 * @param {string} data - Share payload as published.
 * @returns {Share} The share.
 */
export function share(index: number, data: string): Share {
  return { index, data };
}

/**
 * Builds an external entropy source.
 *
 * @param {string} url - Link target.
 * @param {string} [description] - Human-readable description.
 * @returns {EntropySource} The external entropy source.
 */
export function source(url: string, description?: string): EntropySource {
  return defined({ url, description });
}

function transaction(
  tx_type: TransactionType,
  txid: string,
  date: string,
  amount: number,
): Transaction {
  return { tx_type, txid, date, amount };
}

/**
 * Records the transaction that funded the puzzle address.
 *
 * @param {string} txid - Transaction identifier.
 * @param {string} date - Transaction time as `YYYY-MM-DD HH:MM:SS`.
 * @param {number} amount - Amount moved, in whole native units.
 * @returns {Transaction} The funding transaction.
 */
export function funding(txid: string, date: string, amount: number): Transaction {
  return transaction(TransactionType.Funding, txid, date, amount);
}

/**
 * Records a top-up of the prize.
 *
 * @param {string} txid - Transaction identifier.
 * @param {string} date - Transaction time as `YYYY-MM-DD HH:MM:SS`.
 * @param {number} amount - Amount moved, in whole native units.
 * @returns {Transaction} The top-up transaction.
 */
export function increase(txid: string, date: string, amount: number): Transaction {
  return transaction(TransactionType.Increase, txid, date, amount);
}

/**
 * Records a partial withdrawal by the author.
 *
 * @param {string} txid - Transaction identifier.
 * @param {string} date - Transaction time as `YYYY-MM-DD HH:MM:SS`.
 * @param {number} amount - Amount moved, in whole native units.
 * @returns {Transaction} The withdrawal transaction.
 */
export function decrease(txid: string, date: string, amount: number): Transaction {
  return transaction(TransactionType.Decrease, txid, date, amount);
}

/**
 * Records the transaction that exposed the public key.
 *
 * @param {string} txid - Transaction identifier.
 * @param {string} date - Transaction time as `YYYY-MM-DD HH:MM:SS`.
 * @param {number} amount - Amount moved, in whole native units.
 * @returns {Transaction} The public key reveal transaction.
 */
export function pubkeyReveal(txid: string, date: string, amount: number): Transaction {
  return transaction(TransactionType.PubkeyReveal, txid, date, amount);
}

/**
 * Records the transaction that collected the prize.
 *
 * @param {string} txid - Transaction identifier.
 * @param {string} date - Transaction time as `YYYY-MM-DD HH:MM:SS`.
 * @param {number} amount - Amount moved, in whole native units.
 * @returns {Transaction} The claim transaction.
 */
export function claim(txid: string, date: string, amount: number): Transaction {
  return transaction(TransactionType.Claim, txid, date, amount);
}

/**
 * Records a sweep of the address by a third party.
 *
 * @param {string} txid - Transaction identifier.
 * @param {string} date - Transaction time as `YYYY-MM-DD HH:MM:SS`.
 * @param {number} amount - Amount moved, in whole native units.
 * @returns {Transaction} The sweep transaction.
 */
export function sweep(txid: string, date: string, amount: number): Transaction {
  return transaction(TransactionType.Sweep, txid, date, amount);
}

/**
 * Builds a public profile link.
 *
 * @param {string} name - Profile label, such as `website` or `twitter`.
 * @param {string} url - Link target.
 * @returns {Profile} The public profile link.
 */
export function profile(name: string, url: string): Profile {
  return { name, url };
}

/**
 * Builds an author or solver record.
 *
 * @param {string} [name] - Display name, when known.
 * @param {Readonly<{ addresses?: readonly string[]; profiles?: readonly Profile[] }>} [options] - Known addresses and profile links.
 * @returns {Party} The author or solver record.
 */
export function party(
  name?: string,
  options: Readonly<{ addresses?: readonly string[]; profiles?: readonly Profile[] }> = {},
): Party {
  return defined({ name, ...options });
}

/**
 * The asset record of a puzzle.
 *
 * @param {Readonly<{ hints?: readonly string[]; puzzle?: string; solver?: string; sourceUrl?: string }>} options - File names under the collection's asset directory and their source.
 * @returns {Assets} The asset record.
 */
export function assets(
  options: Readonly<{
    hints?: readonly string[];
    puzzle?: string;
    solver?: string;
    sourceUrl?: string;
  }>,
): Assets {
  return defined({
    puzzle: options.puzzle,
    solver: options.solver,
    hints: options.hints,
    source_url: options.sourceUrl,
  });
}

/**
 * What confirms where a hint came from.
 *
 * @param {string} url - An archive capture of the source, the author's reply, a transaction.
 * @param {string} [description] - What the link shows.
 * @returns {Confirmation} The confirmation.
 */
export function confirmation(url: string, description?: string): Confirmation {
  return defined({ url, description });
}

/**
 * Records a published answer without changing the original hint.
 *
 * @param {string} text - The published answer, on one line.
 * @param {string} source - Where the answer was published.
 * @param {Readonly<{ date?: string }>} [options] - Its publication date, when known.
 * @returns {Answer} The answer with absent metadata omitted.
 */
export function answer(
  text: string,
  source: string,
  options: Readonly<{ date?: string }> = {},
): Answer {
  return defined({ text, source, date: options.date });
}

function hint(
  kind: HintKind,
  text: string,
  source: string,
  confirmation: Confirmation,
  options: HintOptions,
): Hint {
  return defined({ kind, text, source, confirmation, date: options.date, answer: options.answer });
}

/**
 * Records a hint the puzzle's author published.
 *
 * @param {string} text - The hint as the source states it, on one line.
 * @param {string} source - Where the author published it.
 * @param {Confirmation} confirmation - What confirms the source said it.
 * @param {HintOptions} [options] - The hint's publication date and any separately published answer.
 * @returns {Hint} The hint.
 */
export function official(
  text: string,
  source: string,
  confirmation: Confirmation,
  options: HintOptions = {},
): Hint {
  return hint(HintKind.Official, text, source, confirmation, options);
}

/**
 * Records a hint someone other than the author gave, right or not.
 *
 * @param {string} text - The hint as the source states it, on one line.
 * @param {string} source - Where it was published.
 * @param {Confirmation} confirmation - What confirms the source said it.
 * @param {HintOptions} [options] - The hint's publication date and any separately published answer.
 * @returns {Hint} The hint.
 */
export function community(
  text: string,
  source: string,
  confirmation: Confirmation,
  options: HintOptions = {},
): Hint {
  return hint(HintKind.Community, text, source, confirmation, options);
}
