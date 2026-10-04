import {
  answer,
  claim,
  compressed,
  funding,
  official,
  source,
  technique,
  wif,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 63 thread, with the question, the funding txid, the hash digits, two hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/casci2/7_mbtc_quizchain2_block_63/";

/** AoiNakamoto's reply that the new Wattpad story holds a hint. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/Grycoin/comments/casci2/comment/etbj6gc/";

/** u/puzzleponky's comment with the solution. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/casci2/comment/etgx7js/";

/** Quizchain2 block 63: `I am omnipotent Aoi`, the sentence behind the vowels `IAOAOI`. */
export const quizchain2Block63 = puzzle({
  id: "quizchain2/63",
  chain: "bitcoin",
  address: "1MnL2VeHEX3wE2dvUWfJ3H3tb1AqRhxSWK",
  sourceUrl: THREAD,
  startedAt: "2019-07-08 11:29:09",
  status: Status.Solved,
  pubkey: compressed("0265a6820f6b279b01478163f8d8189c8a6da988faba2d42bdbce75ea5eed6fd5f"),
  key: wif("Kwia5vhHRge5oND9mVU6UsoJhtVVdEnYfNHnPnfLWHHauUopjhic")
    .entropy("5615487295f19de75e253099838737d9", source(THREAD, "MD5 of the four words"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: IAOAOI", THREAD, undefined, {
      answer: answer(
        'solution was "I am omnipotent Aoi", which would be a good message for Cariga Bright to sign in 2029',
        THREAD,
      ),
    }),
    official("Format: (solution).", THREAD, undefined, {
      answer: answer('Solved! solution was "I am omnipotent Aoi".', PLAYER_COMMENT),
    }),
    official("FIrst three digits of MD5 hash are 561 (copypasted).", THREAD),
    official(
      "It is a special block dedicated to someone absolutely not existing whatsoever called Cariga Bright (which is a clue for the solution).",
      THREAD,
    ),
    official(
      "Not commenting much at this stage, but I can confirm that there is some kind of hint in the new Wattpad story.",
      AUTHOR_COMMENT,
    ),
    official(
      '"I am a young woman of Japanese ancestry, who is very smart and sincere, Aoi Nakamoto."',
      THREAD,
    ),
    official(
      '"**I a**m a young woman of Japanese ancestry, who is very smart and sincere, **Aoi** Nakamoto."',
      THREAD,
    ),
  ],
  solvedAt: "2019-07-10 23:17:02",
  solveTime: 215273,
  transactions: [
    funding(
      "7de43ce4ae06ac4c2c7de9b8f9466af1a2f8fd6c3595310516b23a0584f5c983",
      "2019-07-08 11:29:09",
      0.007,
    ),
    claim(
      "ac17f5ed98ed1ea7b406d0b832c4c252c6bbd19d12cea5d4619f8f9c6e0e578d",
      "2019-07-10 23:17:02",
      0.00679398,
    ),
  ],
});
