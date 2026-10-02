import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 53 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bf6fya/7_mbtc_quizchain_block_53/";

/** u/Mykhailo11's comment of April 20, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bf6fya/comment/elcgmts/";

/** The author's comment of April 20, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bf6fya/comment/elcgsif/";

/**
 * Quizchain block 53: a name and the word inside it, TOMI, a fixed text and the last seven
 * characters of the block 52 key, hashed with MD5 into BIP39 entropy. The first funding went to a
 * hash with the wrong key's link and an empty TOMI field, so twelve hours later the author funded
 * this address. The first 7 mBTC went by private message to the first correct comment. No source
 * printed the hash or the key of this address.
 */
export const quizchainBlock53 = puzzle({
  id: "quizchain/53",
  chain: "bitcoin",
  address: "1MtpindsWeZF4PT8haVzYjA47c7ucX2tv7",
  sourceUrl: THREAD,
  startedAt: "2019-04-20 12:47:04",
  status: Status.Solved,
  pubkey: compressed("034973a15c080b07d999514b69b54d23018e1e550b0e185675723e0829b95881e4"),
  key: wif("L5TB9H3gYAaFVqHgeiTjtfjmWiq8Jocfc2e3pHnKEskL5NRqEsd7")
    .entropy(
      "937b0cee7290377abc12c3050511b247",
      source(
        AUTHOR_COMMENT,
        "MD5 of the name and word, TOMI, the fixed text and the last seven characters of the block 52 key, as the author confirmed in the comments",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Question: You are looking for one word and one name. The word is contained in the name.",
      THREAD,
      undefined,
      {
        answer: answer("Satoshi's stash TOMI I hope you like this block. Y1ui6qG", PLAYER_COMMENT),
      },
    ),
    official(
      "Format:  [solution] TOMI I hope you like this block. [link] [solution] is [name word], with the word lower case and the name in normal capitalization.",
      THREAD,
    ),
    official(
      "Update: Just sent another 7 mbtc, this time to correct hash, first three digits are 937 LInk from block 52 is Y1ui6qG.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-20 12:54:15",
  solveTime: 431,
  transactions: [
    funding(
      "ba01e9c0de866749c6c4b94599aab1c8e4ddeded257ac1262c218dadc08c5a20",
      "2019-04-20 12:47:04",
      0.007,
    ),
    claim(
      "092b097ef871842f17ace72e701296d50bb5f64636641a38f711f93d2179355c",
      "2019-04-20 12:54:15",
      0.00682182,
    ),
  ],
});
