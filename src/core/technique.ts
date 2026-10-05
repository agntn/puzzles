/** The methods a puzzle's key or one of its stages was built with, one name each. */
export const Technique = {
  /** AES encryption under a key the solver has to assemble. */
  Aes: "aes",
  /** Plain text whose ASCII bytes are the private key, read as one number. */
  AsciiPrivateKey: "ascii-private-key",
  /** The Atbash substitution, A for Z, B for Y. */
  Atbash: "atbash",
  /** Base64, standard or with a shuffled alphabet. */
  Base64: "base64",
  /** The Beaufort cipher. */
  Beaufort: "beaufort",
  /** Data spelled out as ones and zeros. */
  Binary: "binary",
  /** A BIP38 encrypted private key whose passphrase is the secret. */
  Bip38: "bip38",
  /** A Caesar shift, every letter moved the same distance. ROT13 goes 13, HAL to IBM just 1. */
  Caesar: "caesar",
  /** Two different preimages with the same hash. */
  HashCollision: "hash-collision",
  /** The words of a BIP39 phrase hidden in a text, an image or a video. */
  HiddenSeedWords: "hidden-seed-words",
  /** A key masked with leading zeros down to a declared bit width. */
  MaskedKeyRange: "masked-key-range",
  /** The MD5 of a text as BIP39 entropy. */
  Md5ToBip39Entropy: "md5-to-bip39-entropy",
  /** Morse code. */
  Morse: "morse",
  /** An OpenSSL salted blob whose password is the SHA-256 hex of a phrase. */
  OpensslSaltedSha256: "openssl-salted-sha256",
  /** A key published with characters missing or wrong. */
  PartialKey: "partial-key",
  /** A QR code. */
  Qr: "qr",
  /** A brainwallet that runs scrypt over the passphrase first. */
  ScryptBrainwallet: "scrypt-brainwallet",
  /** The SHA-256 of a passphrase as the private key. */
  Sha256Brainwallet: "sha256-brainwallet",
  /** The SHA-256 of a text or a file as BIP39 entropy. */
  Sha256ToBip39Entropy: "sha256-to-bip39-entropy",
  /** Shamir secret sharing, a threshold of shares. */
  ShamirShares: "shamir-shares",
  /** Data hidden inside an image, a sound, a video or a file. */
  Steganography: "steganography",
  /** A straddling checkerboard, digits for letters. */
  StraddlingCheckerboard: "straddling-checkerboard",
  /** Three rounds of SHA-256 over a passphrase, each on the last digest, as the private key. */
  TripleSha256Brainwallet: "triple-sha256-brainwallet",
  /** Keybase's WarpWallet, scrypt and PBKDF2 over a passphrase and a salt. */
  Warpwallet: "warpwallet",
  /** XOR with a mask. */
  Xor: "xor",
} as const;

/** One name from the technique vocabulary. */
export type Technique = (typeof Technique)[keyof typeof Technique];

/** Every technique name, sorted. */
export const techniques: readonly Technique[] = Object.freeze(Object.values(Technique).toSorted());
