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
  book_quiz: {
    icon: "i-lucide-book-open",
    title: "7 million book quiz",
    sample: "book_quiz",
    chains: ["bitcoin"],
    blurb:
      "Seven questions about a campaign book, one hour to sweep it. The deadline won and the author took the prize back.",
  },
  coin_artist: {
    icon: "i-lucide-flame",
    title: "TORCHED H34R7S Bitcoin Puzzle",
    sample: "coin_artist/torched-h34r7s",
    chains: ["bitcoin"],
    blurb: "TORCHED H34R7S. A Bitcoin key painted into flames and decoded in 2018.",
  },
  dug: {
    icon: "i-lucide-graduation-cap",
    title: "Dug's Student Treasure Hunt",
    sample: "dug/2025-1",
    chains: ["bitcoin"],
    blurb: "Twelve lecture words, three Bitcoin prizes. A better reason to take notes.",
  },
  genesis: {
    icon: "i-lucide-blocks",
    title: "Genesis Block Wallet Puzzle",
    sample: "genesis/block",
    chains: ["bitcoin"],
    blurb:
      "Two keys hidden in Genesis block data. Public clues, paid hints, still no verified solution.",
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
  iamabananaamaa: {
    icon: "i-lucide-file-image",
    title: "IAMABananaAMAA's puzzles",
    sample: "iamabananaamaa/gif",
    chains: ["bitcoin"],
    blurb:
      "Two puzzles from the first night of r/bitcoinpuzzles. A ZIP after the last byte of a GIF, then a Caesar riddle whose key needed no shift at all.",
  },
  ktimesg: {
    icon: "i-lucide-timer",
    title: "kTimesG's 80-bit key challenge",
    sample: "ktimesg/80_bit",
    chains: ["bitcoin"],
    blurb:
      "80 unknown bits in a 511-bit key. The public key only ever showed up in the mempool. Taken 39 minutes in.",
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
  mineshop: {
    icon: "i-lucide-youtube",
    title: "The 10 ETH challenge",
    sample: "mineshop",
    chains: ["ethereum"],
    blurb:
      "Six seed words in a video, six in the blog post it links to. The author still spends from the wallet.",
  },
  mini: {
    icon: "i-lucide-puzzle",
    title: "RetiredCoder's mini-puzzles",
    sample: "mini/130",
    chains: ["bitcoincash"],
    blurb:
      "Three solved Bitcoin puzzle keys, played again for the Bitcoin Cash still on their addresses. A swapped key, a shuffled key, one signature too many.",
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
  picture_puzzle: {
    icon: "i-lucide-scan-qr-code",
    title: "1 mBTC picture puzzle",
    sample: "picture_puzzle",
    chains: ["bitcoin"],
    blurb:
      "A directory, an eye, the letter O and a QR code: a page on directory.io and the 36th key down. Claimed five hours in.",
  },
  quizchain: {
    icon: "i-lucide-link",
    title: "Quizchain",
    sample: "quizchain/1",
    chains: ["bitcoin"],
    blurb:
      "One quiz answer plus the tail of the author's favorite address, hashed into a wallet. The key went public in the comments.",
  },
  satoshi_birthday_quiz: {
    icon: "i-lucide-cake",
    title: "Satoshi birthday 7 million quiz",
    sample: "satoshi_birthday_quiz",
    chains: ["bitcoin"],
    blurb:
      "Seven questions about Bitcoin history, hashed into a brainwallet. Swept five hours after it was funded.",
  },
  teikhos: {
    icon: "i-lucide-shield",
    title: "TeikhosBounty",
    sample: "teikhos/4",
    chains: ["ethereum"],
    blurb:
      "Five Ethereum contracts that want a public key nobody published. Four can pay, and one did in 2026, with a key a failed attempt left on chain four years earlier.",
  },
  warp: {
    icon: "i-lucide-key-round",
    title: "WarpWallet challenges",
    sample: "warp/challenge_1",
    chains: ["bitcoin"],
    blurb: "Keybase's scrypt brainwallet. Four solved, two expired with the keys published.",
  },
  wickex: {
    icon: "i-lucide-audio-waveform",
    title: "Wickex's YouTube puzzle",
    sample: "wickex/youtube",
    chains: ["bitcoin"],
    blurb:
      "Hex that spells a YouTube link, Morse in the audio, a passphrase in a spectrogram. Swept 46 minutes in, sent back, swept again.",
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
  bitcoincash: "i-token-bch",
  decred: "i-token-dcr",
  ethereum: "i-token-eth",
  litecoin: "i-token-ltc",
  monero: "i-token-xmr",
};

/** The status values the list tool and the CLI accept. */
export const STATUSES: readonly string[] = Object.values(Status);
