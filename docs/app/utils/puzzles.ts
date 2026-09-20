import { collectionKeys, Status } from "@agntn/puzzles";

/**
 * Icon, title, chains and one sample id per collection. Everything else comes from the library at
 * render time. The chain list is written down because the OG templates render without loading a
 * record.
 */
const PRESENTATION: Readonly<
  Record<
    string,
    {
      readonly icon: string;
      readonly title: string;
      readonly sample: string;
      readonly chains: readonly string[];
      readonly blurb: string;
    }
  >
> = {
  arweave: {
    icon: "i-token-ar",
    title: "Arweave bounties",
    sample: "arweave/weave3",
    chains: ["arweave", "ethereum"],
    blurb: "Tiamat's weave puzzles. Prizes in AR and ETH. Four still open.",
  },
  b1000: {
    icon: "i-lucide-binary",
    title: "Bitcoin puzzle transaction",
    sample: "b1000/71",
    chains: ["bitcoin"],
    blurb: "256 addresses with keys of 1 to 256 bits. The one everybody scans.",
  },
  ballet: {
    icon: "i-lucide-wallet",
    title: "Ballet wallets",
    sample: "ballet/AA007448",
    chains: ["bitcoin"],
    blurb: "Three BIP38 encrypted keys printed on physical wallets.",
  },
  bitaps: {
    icon: "i-lucide-split",
    title: "Bitaps mnemonic challenge",
    sample: "bitaps",
    chains: ["bitcoin"],
    blurb: "A 3 of 5 secret sharing scheme with two shares published.",
  },
  bitimage: {
    icon: "i-lucide-camera",
    title: "Bitimage",
    sample: "bitimage/kitten",
    chains: ["bitcoin"],
    blurb: "Seeds hashed out of photographs. One solved, one waits on a passphrase.",
  },
  dug: {
    icon: "i-lucide-graduation-cap",
    title: "Dug's Student Treasure Hunt",
    sample: "dug/2025-1",
    chains: ["bitcoin"],
    blurb: "Three funded BIP84 addresses. One published seed. All three prizes claimed.",
  },
  gsmg: {
    icon: "i-lucide-rabbit",
    title: "GSMG.io puzzle",
    sample: "gsmg",
    chains: ["bitcoin"],
    blurb: "A multi phase image puzzle. The prize has been halved twice.",
  },
  hash_collision: {
    icon: "i-lucide-hash",
    title: "Hash collision bounties",
    sample: "hash_collision/sha1",
    chains: ["bitcoin"],
    blurb: "Peter Todd's P2SH scripts that pay for a collision. SHA-1 fell in 2017.",
  },
  ledger_donjon: {
    icon: "i-lucide-scissors",
    title: "Ledger Donjon CTF",
    sample: "ledger_donjon/scissors_secret_sharing",
    chains: ["bitcoin"],
    blurb:
      "Scissors Secret Sharing. Twelve BIP39 words, ten out of order. CTF points, not a BTC prize.",
  },
  luckylurker: {
    icon: "i-lucide-vault",
    title: "LuckyLurker Bitcoin Vault puzzles",
    sample: "luckylurker/vault_1",
    chains: ["bitcoin"],
    blurb: "Paul Jones’s two Bitcoin Vaults. The first solved, the second funded with 1 BTC.",
  },
  movie_enigma: {
    icon: "i-lucide-clapperboard",
    title: "Bitcoin Movie Enigma",
    sample: "movie_enigma",
    chains: ["bitcoin"],
    blurb:
      "34 film stills, one BIP39 word each, ten intruders. Solved in 2026 with a phrase whose checksum fails.",
  },
  rushwallet: {
    icon: "i-lucide-brain",
    title: "RushWallet contest",
    sample: "rushwallet/1",
    chains: ["bitcoin"],
    blurb: "Thirty brainwallets from 2014. Almost all cracked since.",
  },
  warp: {
    icon: "i-lucide-key-round",
    title: "WarpWallet challenges",
    sample: "warp/challenge_1",
    chains: ["bitcoin"],
    blurb: "Keybase's scrypt brainwallet. Four solved, two expired with the keys published.",
  },
  zden: {
    icon: "i-lucide-image",
    title: "Zden's puzzles",
    sample: "zden/decred_janus",
    chains: ["bitcoin", "ethereum", "litecoin", "decred"],
    blurb: "Fifteen visual puzzles on four chains, most of them solved.",
  },
};

export interface CollectionEntry {
  readonly key: string;
  readonly to: string;
  readonly icon: string;
  readonly title: string;
  readonly sample: string;
  readonly chains: readonly string[];
  readonly blurb: string;
}

/** The built-in collections in manifest order. Nothing loads here: the keys come from the manifest. */
export const COLLECTIONS: readonly CollectionEntry[] = collectionKeys().map((key) => {
  const presentation = PRESENTATION[key];
  if (presentation === undefined) {
    throw new Error(`No presentation for collection ${key}`);
  }
  return { key, to: `/collections/${key}`, ...presentation };
});

export function collectionEntry(key: string): CollectionEntry | undefined {
  return COLLECTIONS.find((entry) => entry.key === key);
}

/** Chain icons come from the monochrome token set, the same as everywhere else in agntn. */
export const CHAIN_ICONS: Readonly<Record<string, string>> = {
  arweave: "i-token-ar",
  bitcoin: "i-token-btc",
  decred: "i-token-dcr",
  ethereum: "i-token-eth",
  litecoin: "i-token-ltc",
  monero: "i-token-xmr",
};

/** The status values the list tool and the CLI accept. */
export const STATUSES: readonly string[] = Object.values(Status);
