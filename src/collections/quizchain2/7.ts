import {
  answer,
  claim,
  compressed,
  funding,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 7 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bp8jlh/77_mbtc_quizchain2_block_7/";

/** The author's hint of May 17, 2019. */
const HINT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bp8jlh/comment/enwjga0/";

/** u/mooncritic's comment with the whole winning string and the method. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bp8jlh/comment/enwmri7/";

/**
 * Quizchain2 block 7: `Grycoin`, the Atbash of `Bit` rearranged, then TOMI and three words in
 * alphabetical order, hashed with MD5 into BIP39 entropy, for 77 mBTC. No source printed the hash
 * or the key.
 */
export const quizchain2Block7 = bitcoinPuzzle({
  id: "quizchain2/7",
  address: p2pkh("1MgqS8ng87o9JVNkaKhtBFXigYG9KvJ1Ff", "e2eb2b16530d257f0a6599ce83ab109ae742e657"),
  sourceUrl: THREAD,
  startedAt: "2019-05-15 23:24:23",
  status: Status.Solved,
  pubkey: compressed("03c9586e34cdc2fd0b8c2652a8296022996d462eef025ecb4e55c3cad282a8feaf"),
  key: wif("L5MJPrKiqPreFJJPFzASnb9Ru1QfqeVRwnHbLo18yPZpQNJm6KD2")
    .entropy(
      "df14b6d31d10082629fefa7f25c4601a",
      source(THREAD, "MD5 of the coin name, TOMI and three words"),
    )
    .derived(),
  prize: 0.077,
  hints: [
    official(
      'The question is to find the name for that altcoin, starting out from the name "Bitcoin".',
      THREAD,
      undefined,
      {
        answer: answer("Atbash of BIT is YRG. YRG can be rearranged to GRY.", PLAYER_COMMENT),
      },
    ),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Grycoin TOMI angry Atbash hungry", PLAYER_COMMENT),
    }),
    official(
      '[solution] is capitalized like "Bitcoin", which means only first letter in capitals.',
      THREAD,
    ),
    official(
      "[Tomi] are three words in alphabetical order [word1 word2 word3], with one of them starting with a capital letter like the solution and the other two in all lower case.",
      THREAD,
      undefined,
      {
        answer: answer(
          "For the TOMI, the two words that end in -gry are angry and hungry. Since I got to Gry using Atbash, I tried the word Atbash as well, and I organized these words in alphabetical order.",
          PLAYER_COMMENT,
        ),
      },
    ),
    official("First three digits of MD5 hash are df1.", THREAD),
    official("First digit of solution only MD5 hash is 5.", THREAD),
    official("First digit of TOMI field only MD5 hash is e.", THREAD),
    official(
      'When I first thought about an altcoin project, I wanted to call it Hascoin. That was derived from moving the letters in the "Bit" part of Bitcoin one place to the left in the alphabet, then changing the order to make it easier to pronounce.',
      HINT,
    ),
    official(
      'The format of the solution is also Xxxcoin, with three different letters replacing the BIt part, and these letters being derived directly from "Bit".',
      HINT,
    ),
    official(
      "Once you find the method for deriving it, you will be left with several choices. And the one I chose will have a clear relation to puzzles. There will be a famous puzzle associated with this choice, which is why I went with it.",
      HINT,
    ),
  ],
  solvedAt: "2019-05-17 13:22:07",
  solveTime: 136_664,
  transactions: [
    funding(
      "fe9bec614bc203f37ed5fd15236c75581bf012e83fc3f3ffdfaeac7858a2e8f9",
      "2019-05-15 23:24:23",
      0.077,
    ),
    claim(
      "4958e070784095909f228467637883845e4a2ba26ae5298ffb688ac26a21ac30",
      "2019-05-17 13:22:07",
      0.07650961,
    ),
  ],
});
