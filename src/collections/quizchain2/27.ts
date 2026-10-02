import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 27 thread, with the question, the funding txid, the hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bwaepa/9_mbtc_quizchain2_block_27/";

/** u/userm1010110's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bwaepa/comment/epz3gy9/";

/** Quizchain2 block 27: `UTXO`, the edges of `FOG COOL` after Atbash, for 9 mBTC. */
export const quizchain2Block27 = puzzle({
  id: "quizchain2/27",
  chain: "bitcoin",
  address: "1Gc176jA3F7pxiDNtxmRRFSPAsYkud9TMD",
  sourceUrl: THREAD,
  startedAt: "2019-06-03 10:31:46",
  status: Status.Solved,
  pubkey: compressed("02b97742a7a347de722b898b5f47b89c4a8451b6fa4d8bf707d3aaf07df51a9e2d"),
  key: wif("L3peUVwFP586E5eEjWmPdW988CrB3iQBmwCnnijhWxN8TMhUPqah")
    .entropy(
      "c3d0d5687b469a0e449f396f0ca975d7",
      source(THREAD, "MD5 of the acronym, TOMI and three words"),
    )
    .derived(),
  prize: 0.009,
  hints: [
    official("FOG COOL", THREAD, undefined, {
      answer: answer(
        'Atbash on the question results in ULT XLLO. From there on it is only a question of noting that the letters at the edges form UTXO, which is the solution. TOMI field was just "unspent transaction output", which follows clearly and uniquely from the solution.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("UTXO TOMI unspent transaction output", PLAYER_COMMENT),
    }),
    official(
      "First 3 digits of MD5 hash is c3d. I do not indicate first digit of solution only and TOMI field only MD5 hash, since the TOMI field follows clearly and uniquely from the solution.",
      THREAD,
    ),
    official("Update: First digit of solution only MD5 hash is a.", THREAD),
    official("Update two (hint one): Atbash.", THREAD),
  ],
  solvedAt: "2019-06-04 13:59:06",
  solveTime: 98_840,
  transactions: [
    funding(
      "00c41fb1d17837ff51e0def00f115c18da709db3034453542618ef0adbc65a2f",
      "2019-06-03 10:31:46",
      0.009,
    ),
    claim(
      "8d543b4b443dd2ce7f557905f6320d517818395c572b3deaf01f69c3c85b1350",
      "2019-06-04 13:59:06",
      0.00844992,
    ),
  ],
});
