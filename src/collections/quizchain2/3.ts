import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question, the funding txid and the solution of block 3 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bnj8ew/7_mbtc_quizchain2_block_3/";

/** u/Pr0m3th3on's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bnj8ew/comment/en6delr/";

/**
 * Quizchain2 block 3: the "dirty word" Binance's CEO apologized for, TOMI, his Twitter name and
 * the whole block 76 key of the first run, hashed with MD5 into BIP39 entropy. The block 4
 * winner printed the key. The entropy hash is not printed; it is the post's recipe run on the
 * published solution, and it derives that key.
 */
export const quizchain2Block3 = puzzle({
  id: "quizchain2/3",
  chain: "bitcoin",
  address: "1FsYtK22FBG7Ps3K7KZUYDQRs6gDxXjwQX",
  sourceUrl: THREAD,
  startedAt: "2019-05-12 00:45:26",
  status: Status.Solved,
  pubkey: compressed("02f4db70c3801528c31a79093e72b1bf9e9fe0c1e94e3539e0632eb338166a8701"),
  key: wif("L488KiS3jUut79rDM6gwxUdg7Qm1SXwQnMasKLpzFzb6KrNLsFpT").entropy(
    "5f6870da0f9c9553647e89c89d79f9a6",
    source(THREAD, "MD5 of the word, TOMI, two words and the whole block 76 key of the first run"),
  ),
  prize: 0.007,
  hints: [
    official("Question: dirty word with XA", THREAD, undefined, {
      answer: answer(
        'Solution was "reorg" and TOMI field was "CZ Binance". This used the recent news on the Binance hack and the discussion on doing a BItcoin chain reorg. CZ apologized for using this "dirty word". I have not much to add, except that the "XA" in the question was "CZ" in Atbash code.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI] [link]", THREAD, undefined, {
      answer: answer(
        "reorg TOMI CZ Binance L2e6gPSXnq7KJBfkoD7cHGVZuhRUDARJz2Cc9JcSNLsKRZhH552F",
        PLAYER_COMMENT,
      ),
    }),
    official(
      "Use the private key from block 76 for this again as a link. That private key is L2e6gPSXnq7KJBfkoD7cHGVZuhRUDARJz2Cc9JcSNLsKRZhH552F.",
      THREAD,
    ),
    official("First three digits of MD5 hash are 5f6.", THREAD),
    official("First digit of solution only MD5 hash is 1.", THREAD),
    official("FIrst digit of TOMI only MD5 hash is 0.", THREAD),
  ],
  solvedAt: "2019-05-12 02:12:14",
  solveTime: 5208,
  transactions: [
    funding(
      "5d3b46fa708c477806305e9c9a1dde18d1ed7720177312bc2d2f7b0743a5a089",
      "2019-05-12 00:45:26",
      0.007,
    ),
    claim(
      "581b85ceac835ff89c568fc0981b233864308a9cb3423ad79bb97d719cfbe718",
      "2019-05-12 02:12:14",
      0.0069809,
    ),
  ],
});
