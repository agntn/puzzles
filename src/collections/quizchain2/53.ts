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

/** The block 53 thread, with the question, the funding txid, the hash digits, the hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c6w965/7_mbtc_quizchain2_block_53/";

/** AoiNakamoto's reply on how to copy the URL. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c6w965/comment/esboql9/";

/** Quizchain2 block 53: a tweet URL, Hal Finney in a Superman shirt, as the mobile site writes it. */
export const quizchain2Block53 = puzzle({
  id: "quizchain2/53",
  chain: "bitcoin",
  address: "14v36xE3KFyP35S2BfoK7XUYMbg3j2NXRy",
  sourceUrl: THREAD,
  startedAt: "2019-06-29 03:10:25",
  status: Status.Solved,
  pubkey: compressed("0252c71dff54db39a7552aec853bbde052fd4dcde19cd6f48caca5e4dafdf4a306"),
  key: wif("Kwp34pYdLg522kp89Vnd1b2x6H56B8vrNpqG1WhtbRZ8FSG8DC51")
    .entropy("4c17b6bd386f7b6a7807e783de250af1", source(THREAD, "MD5 of the URL"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Superman", THREAD, undefined, {
      answer: answer(
        "which is a Tweet by Jameson Lopp showing a picture of Hal Finney in a Superman t-shirt.",
        THREAD,
      ),
    }),
    official("Format: [solution], solution format is relevant URL unchanged.", THREAD, undefined, {
      answer: answer("https://mobile.twitter.com/lopp/status/1143879778170232833", THREAD),
    }),
    official(
      "FIrst three digits of MD5 hash (not MP5, spelled correctly this time) are 4c1.",
      THREAD,
    ),
    official(
      "Just copypaste as is from browser, so include http or www or whatever there is. Change nothing.",
      AUTHOR_COMMENT,
    ),
    official(
      "Update: As noted in block 54 (already solved) there is a connection from Superman to Satoshi (Hal FInney). That is a hint for this block.",
      THREAD,
    ),
    official(
      "Another is the fact that the URL will change depending on what kind of hardware you use. I used a mobile device.",
      THREAD,
    ),
    official(
      'And the maybe decisive hint is "warm miners", though that one also does not lead to the solution with a simple Google search.',
      THREAD,
    ),
  ],
  solvedAt: "2019-06-30 08:21:06",
  solveTime: 105_041,
  transactions: [
    funding(
      "68c6f4f253c4501ea1ab3b53420cb73ed0253a24cfc30a9c244bca5dd2f3f561",
      "2019-06-29 03:10:25",
      0.007,
    ),
    claim(
      "429e4f59abc0c62679d067c387482392d11f67e003c272d96c880d03e1cbe890",
      "2019-06-30 08:21:06",
      0.00690208,
    ),
  ],
});
