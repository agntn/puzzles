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
  weave: {
    icon: "i-token-ar",
    title: "Puzzle Weave",
    sample: "weave/3",
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
  "book-quiz": {
    icon: "i-lucide-book-open",
    title: "7 million book quiz",
    sample: "book-quiz",
    chains: ["bitcoin"],
    blurb:
      "Seven questions about a campaign book, one hour to sweep it. The deadline won and the author took the prize back.",
  },
  "coin-artist": {
    icon: "i-lucide-flame",
    title: "TORCHED H34R7S Bitcoin Puzzle",
    sample: "coin-artist/torched-h34r7s",
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
    sample: "genesis",
    chains: ["bitcoin"],
    blurb:
      "Two keys hidden in Genesis block data. Public clues, paid hints, still no verified solution.",
  },
  "great-riddle": {
    icon: "i-lucide-pen-tool",
    title: "The Great Riddle",
    sample: "great-riddle",
    chains: ["bitcoin"],
    blurb:
      "A seed of 24 words hidden one by one in the original ballpoint drawings of the Genesis Collection. Prints carry nothing, and the 25th word comes from the artist.",
  },
  gsmg: {
    icon: "i-lucide-rabbit",
    title: "GSMG.io puzzle",
    sample: "gsmg",
    chains: ["bitcoin"],
    blurb: "A multi phase image puzzle. The prize has been halved twice.",
  },
  "hash-collision": {
    icon: "i-lucide-hash",
    title: "Hash collision bounties",
    sample: "hash-collision/sha1",
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
  "80-bit": {
    icon: "i-lucide-timer",
    title: "kTimesG's 80-bit key challenge",
    sample: "80-bit",
    chains: ["bitcoin"],
    blurb:
      "80 unknown bits in a 511-bit key. The public key only ever showed up in the mempool. Taken 39 minutes in.",
  },
  "ledger-donjon": {
    icon: "i-lucide-scissors",
    title: "Ledger Donjon CTF",
    sample: "ledger-donjon/scissors-secret-sharing",
    chains: ["bitcoin"],
    blurb:
      "Scissors Secret Sharing. Twelve BIP39 words, ten out of order. CTF points, not a BTC prize.",
  },
  luckylurker: {
    icon: "i-lucide-vault",
    title: "LuckyLurker Bitcoin Vault puzzles",
    sample: "luckylurker/vault-1",
    chains: ["bitcoin"],
    blurb: "Paul Jones’s two Bitcoin Vaults. The first solved, the second funded with 1 BTC.",
  },
  "doges-gambit": {
    icon: "i-lucide-chess-knight",
    title: "Doge's Gambit",
    sample: "doges-gambit/doge",
    chains: ["ethereum", "dogecoin"],
    blurb:
      "A chess board with coins for pieces, sixteen frames and two keys in one clip. The 10,000 DOGE went from about $50 to a few thousand dollars while nobody could read it.",
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
    sample: "mini/3",
    chains: ["bitcoin", "bitcoincash"],
    blurb:
      "Seven small riddles on Bitcointalk. Four replay a solved puzzle key for the Bitcoin Cash still on its address, three put 0.01 BTC on a fresh key.",
  },
  "move-over-brokers": {
    icon: "i-lucide-book-open",
    title: "Move Over Brokers treasure hunt",
    sample: "move-over-brokers/en-easy-1",
    chains: ["bitcoin"],
    blurb:
      "Twelve keys hidden in a blockchain book and its Italian translation. One answer is Sherlock Holmes's address, another is printed only on the back cover.",
  },
  "movie-enigma": {
    icon: "i-lucide-clapperboard",
    title: "Bitcoin Movie Enigma",
    sample: "movie-enigma",
    chains: ["bitcoin"],
    blurb:
      "34 film stills, one BIP39 word each, ten intruders. Solved in 2026 with a phrase whose checksum fails.",
  },
  "natasha-otomoski": {
    icon: "i-lucide-text-cursor-input",
    title: "Natasha Otomoski puzzle, 1 BTC",
    sample: "natasha-otomoski",
    chains: ["bitcoin"],
    blurb:
      "One question, 32 characters of plain text as the private key. Someone typed the right eight words seven months later and never said how.",
  },
  rushwallet: {
    icon: "i-lucide-brain",
    title: "RushWallet contest",
    sample: "rushwallet/1",
    chains: ["bitcoin"],
    blurb: "Thirty brainwallets from 2014. Almost all cracked since.",
  },
  "brave-new-world": {
    icon: "i-lucide-cctv",
    title: "Brave New World",
    sample: "brave-new-world",
    chains: ["bitcoin"],
    blurb:
      "All of 2020 in one collage, runes included. Find the seed phrase, says the picture. Six years on, the 0.2 BTC is still there.",
  },
  bitaddress: {
    icon: "i-lucide-hammer",
    title: "Brute force and the coins are yours",
    sample: "bitaddress",
    chains: ["bitcoin"],
    blurb:
      "A paper wallet whose owner forgot the BIP38 passphrase and gave the coins to whoever guesses it. Probably three old passwords glued together. Good luck, q didn't have any.",
  },
  "wealth-in-poetry": {
    icon: "i-lucide-feather",
    title: "Securing Wealth in Poetry",
    sample: "wealth-in-poetry",
    chains: ["bitcoin"],
    blurb:
      "An essay on hiding seed phrases in stories, with a real one hidden in the essay. You've read every word, it says. The 0.03 BTC is still there.",
  },
  "path-to-greatness": {
    icon: "i-lucide-gamepad-2",
    title: "Path to Greatness",
    sample: "path-to-greatness",
    chains: ["litecoin"],
    blurb:
      "Clues hidden in a parkour game demo lead to a Litecoin key. Donations go straight into the prize, and nobody has taken it.",
  },
  phy: {
    icon: "i-lucide-flower",
    title: "kTimesG's Phy Challenge",
    sample: "phy",
    chains: ["bitcoin"],
    blurb:
      "A signed forum post, a signature the author's cat cut one character short, and grey emojis spiralling around a gold coin. The signature gives up the address. The key behind it, and 800,000 sats, nobody has found yet.",
  },
  "picture-puzzle": {
    icon: "i-lucide-scan-qr-code",
    title: "1 mBTC picture puzzle",
    sample: "picture-puzzle",
    chains: ["bitcoin"],
    blurb:
      "A directory, an eye, the letter O and a QR code: a page on directory.io and the 36th key down. Claimed five hours in.",
  },
  "powerful-moss": {
    icon: "i-lucide-sprout",
    title: "Powerful Moss",
    sample: "powerful-moss",
    chains: ["base"],
    blurb:
      "Twelve songs on Donkey Kong Country 2 soundfonts and a twelve-word seed somewhere in them. The prize waits in a contract on Base that opens only for the wallet the seed derives.",
  },
  "proof-of-writing": {
    icon: "i-lucide-pen-line",
    title: "Building an awesome eCash community",
    sample: "proof-of-writing",
    chains: ["ecash"],
    blurb:
      "An essay on what makes a crypto community, with a Cashtab seed on its diagonal: word one of one paragraph, word two of the next. 30 million XEC by the time it fell.",
  },
  quizchain: {
    icon: "i-lucide-link",
    title: "Quizchain",
    sample: "quizchain/1",
    chains: ["bitcoin"],
    blurb:
      "A quiz answer plus a piece of the previous block's key, hashed into a wallet. The chain ran from April to July 2019, one block at a time.",
  },
  quizchain2: {
    icon: "i-lucide-repeat",
    title: "Quizchain2",
    sample: "quizchain2/1",
    chains: ["bitcoin"],
    blurb:
      "The quizchain's second run, from May 2019. Most blocks stand alone now, an answer and a TOMI field hashed with MD5, and by block 6 the thread is arguing about scripts versus humans.",
  },
  "satoshi-birthday-quiz": {
    icon: "i-lucide-cake",
    title: "Satoshi birthday 7 million quiz",
    sample: "satoshi-birthday-quiz",
    chains: ["bitcoin"],
    blurb:
      "Seven questions about Bitcoin history, hashed into a brainwallet. Swept five hours after it was funded.",
  },
  "satoshi-maze": {
    icon: "i-lucide-route",
    title: "Satoshi-Maze, Phemex 2.1 BTC puzzle",
    sample: "satoshi-maze",
    chains: ["bitcoin"],
    blurb:
      "Satoshi drawn as a maze by an exchange. Nobody beat the deadline, so the designer published the key: a prime from e times two Base58 words read little endian.",
  },
  "trivia-brainwallet": {
    icon: "i-lucide-lightbulb",
    title: "Brainwallet puzzle, 0.04 BTC",
    sample: "trivia-brainwallet",
    chains: ["bitcoin"],
    blurb:
      "Twelve riddles from patents to chess to a ham deal, typed into brainwallet.io as a passphrase and a salt. Swept six hours after the post.",
  },
  teikhos: {
    icon: "i-lucide-shield",
    title: "TeikhosBounty",
    sample: "teikhos/4",
    chains: ["ethereum"],
    blurb:
      "Five Ethereum contracts that want a public key nobody published. Four can pay, and one did in 2026, with a key a failed attempt left on chain four years earlier.",
  },
  "walking-banks": {
    icon: "i-lucide-dna",
    title: "Walking Banks seed hunt",
    sample: "walking-banks/2",
    chains: ["bitcoin"],
    blurb:
      "A thriller whose murder victims carry a seed phrase in their DNA, and a real one hidden in the book. Four words decode on page 122. The other twenty, and 800,000 sats, are still out there.",
  },
  warp: {
    icon: "i-lucide-key-round",
    title: "WarpWallet challenges",
    sample: "warp/challenge-1",
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
    sample: "zden/decred-janus",
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
  base: "i-token-base",
  bitcoin: "i-token-btc",
  bitcoincash: "i-token-bch",
  decred: "i-token-dcr",
  dogecoin: "i-token-doge",
  ecash: "i-token-xec",
  ethereum: "i-token-eth",
  litecoin: "i-token-ltc",
  monero: "i-token-xmr",
};

/** The status values the list tool and the CLI accept. */
export const STATUSES: readonly string[] = Object.values(Status);
