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

/** Where the question and the funding txid of block 17 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbf7cl/expert_8_mbtc_quizchain_block_17/";

/**
 * Quizchain block 17: the vanity address the author's first Reddit post linked, a space and the
 * last three characters of the block 16 key, hashed with MD5 into BIP39 entropy. The prize was 8
 * mBTC for the lucky number. No source printed the hash or the key.
 */
export const quizchainBlock17 = bitcoinPuzzle({
  id: "quizchain/17",
  address: p2pkh("1FpiJm3JKsgAae5KtJhPDytgmYXrR7sQpY", "a297cab6d0d7b2bdc8fb4cbe9dd1fc27d5602d05"),
  sourceUrl: THREAD,
  startedAt: "2019-04-09 23:42:18",
  status: Status.Solved,
  pubkey: compressed("0244d7cc972d9412cf4aedb15984cb418fd96365bf25751044030101560d7f7156"),
  key: wif("KxqEkwjTQLuYGDwWvMUqEfhhDFB11UXv9sDVZH7M7YcaC9eoVeQh")
    .entropy(
      "f561020d891bc5a248331d866b5ddde2",
      source(
        THREAD,
        "MD5 of the address, a space and the last three characters of the block 16 key",
      ),
    )
    .derived(),
  prize: 0.008,
  hints: [
    official(
      'No hint. And no, "No hint" is not the answer this time. Already used that idea in block 11. Format: [solution] [link], with exactly one space between them.',
      THREAD,
      undefined,
      {
        answer: answer(
          "The correct solution was to go back in my posting history to the first post, which was a link to this Bitcoin address: 1AndrewYangForPresident2o2ozm6Pzd",
          THREAD,
        ),
      },
    ),
    official(
      "I also note that it is 7 days on Reddit for me, so this is another reason to celebrate with an extremely hard block.",
      THREAD,
    ),
    official(
      "Once you have the solution, that solution in turn will be a hint for block 16...",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-10 05:48:52",
  solveTime: 21_994,
  transactions: [
    funding(
      "a7cedbfdf7f6a630f6e666b1a73e3df8ac12bb18a2042d567c35803923662c43",
      "2019-04-09 23:42:18",
      0.008,
    ),
    claim(
      "75e380a09f7f09eb32c51e90758ab3e346629c276ead4bec47bb8b72624b2f71",
      "2019-04-10 05:48:52",
      0.00769453,
    ),
  ],
});
