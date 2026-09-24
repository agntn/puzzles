import {
  answer,
  claim,
  compressed,
  confirmation,
  funding,
  official,
  p2pkh,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** The post: four lines of text, a verse signed by Caesar, the address and the prize. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/1ticec/medium_1mbtc_riddle_me_this_for_a_private_key/";

/** The Wayback capture of the post and every comment that survived. */
const CAPTURE =
  "https://web.archive.org/web/20230531170758/https://old.reddit.com/r/bitcoinpuzzles/comments/1ticec/medium_1mbtc_riddle_me_this_for_a_private_key/";

/** The author's explanation, posted after the prize was gone. */
const EXPLANATION = "https://www.reddit.com/r/bitcoinpuzzles/comments/1ticec/comment/ce8nwvi/";

/**
 * Four lines of Base58 under a verse credited to Caesar. The author later said each line was
 * Caesar shifted by the number in the verse, but the four lines as posted, joined, already are the
 * WIF: it derives the address and the public key in the claim's input script. The solvers'
 * comments are deleted and the claim names no one, so the record has no solver.
 */
export const iAmABananaAmaaCaesar = bitcoinPuzzle({
  id: "iamabananaamaa/caesar",
  address: p2pkh("1wkQxZaewFqYrDJeVnxqrfMKfJykdRfr5", "0a5ab38b15e06067b9ad40237c699694636eadc6"),
  sourceUrl: THREAD,
  startedAt: "2013-12-23 04:53:59",
  status: Status.Solved,
  pubkey: compressed("022550e961be572a4909f753ea9e98a2a70d77743f367979c5309c2215e852a9be"),
  key: wif("Ky1VCMxtg9xD13hFrEhWxN22QobNEfeTDX14sZdhGHC3nBRTEDQ8"),
  prize: 0.001,
  hints: [
    official(
      '"FOUR IS SIX / THREE IS SEVEN / TWO IS NINE / ONE IS FOUR" - CAESAR\'S LAST WORDS',
      THREAD,
      confirmation(CAPTURE, "Wayback capture of the post and its comments"),
      {
        date: "2013-12-23",
        answer: answer(
          "The info given to you was an encrypted key in four parts. According to CAESAR'S last words, you can decrypt each part. I don't remember it off the top of my head, but whatever the second number in each line is the Caesar Shift amount. So if \"one is four\", the first line can be decrypted using a Caesar shift of 4.",
          EXPLANATION,
          { date: "2013-12-23" },
        ),
      },
    ),
    official(
      "This one is easy/medium. It doesn't involve any images or videos.",
      THREAD,
      undefined,
      {
        date: "2013-12-23",
      },
    ),
  ],
  solvedAt: "2013-12-23 15:18:26",
  solveTime: 37467,
  transactions: [
    funding(
      "5c2b479557a3e09bc032faac765ad74ed35d309a325a18f2f83586c54d71e8ca",
      "2013-12-23 03:08:58",
      0.001,
    ),
    claim(
      "a5829ee22a26a167e9ec19808fb307a3dfccd6a9b63191859825561f1643ce9d",
      "2013-12-23 15:18:26",
      0.0009,
    ),
  ],
});
