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

/** Where the question, the funding txid, both hints, the solution and the private key were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bb1ajr/easy_7_mbtc_quizchain_block_10/";

/**
 * Quizchain block 10: four words with the last three characters of the block 9 key appended,
 * hashed with SHA-256 into BIP39 entropy. The line break that broke block 9 got copied into this
 * hash too, as the post's final update admits. The post names the funding transaction, not the
 * address, and a player's comment prints the address, the public key and the WIF. The entropy
 * hash is not printed; it is the recipe run on the published solution with that line break, and
 * it derives that WIF.
 */
export const quizchainBlock10 = bitcoinPuzzle({
  id: "quizchain/10",
  address: p2pkh("14zuee5qyQwypAcAjyexpTNZqaxY8K9NWj", "2bdc094b716e622d5547709afe7bae97f0ca2828"),
  sourceUrl: THREAD,
  startedAt: "2019-04-09 00:18:53",
  status: Status.Solved,
  pubkey: compressed("022170ce8d3a1e8387ab5a362f7724ccf07c3b608d69dcf5561f172e07a7accdeb"),
  key: wif("L28sMk6rGrZeYMKeXKVnkLgAU4Zc9igbwKcPUo8N6NjnSgSx6peH").entropy(
    "024220f061e3ae0e072687bb40999847d6910bd6bda8b157fe00f91a1c14880d",
    source(
      THREAD,
      "SHA-256 of the solution with the last three characters of the block 9 key appended and the line break the author says was copied with it",
    ),
  ),
  prize: 0.007,
  hints: [
    official(
      'Question: Four words within Einstein. Format: "word1 word2 word3 word4.fnw". The last three digits from the broken link in block 9 are set as fnw for this block. German words allowed.',
      THREAD,
      undefined,
      {
        answer: answer(
          'Solution was "Moonwalking with ein Stein.fnw". Explanation: Four words within is two words with and two words in. The two words with are those from the famous book titile that shows up in a Google search, the two words in are just "ein Stein" (a stone in German). Final Update and apology: As several people noted, my mistake in hashing block 9 happened in this block too. Again a line break at the end from copypasting from a draft in a wordprocessor.',
          THREAD,
        ),
      },
    ),
    official('Break up "within" into "with" and "in".', THREAD),
    official('Google "with Einstein".', THREAD),
  ],
  solvedAt: "2019-04-10 01:42:12",
  solveTime: 91_399,
  transactions: [
    funding(
      "18c5191722eb13326322300205c24d229cfc45bfb0c29af30ee8c22c9c8fecb7",
      "2019-04-09 00:18:53",
      0.007,
    ),
    claim(
      "4fb23044d123eef5193e0157751dfbded8bd7354bfec2d9195e2ae2a0c786292",
      "2019-04-10 01:42:12",
      0.00679456,
    ),
  ],
});
