import {
  answer,
  assets,
  claim,
  community,
  compressed,
  funding,
  official,
  p2pkh,
  party,
  profile,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** The post: a title, a 1 mBTC prize and a link to the GIF, nothing else. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/1thjjq/easy_1mbtc_find_the_private_key_in_this_gif/";

/** Where the GIF was posted. The file under `assets/` is byte for byte the same. */
const GIF = "http://i.imgur.com/7rXofNv.gif";

/**
 * A comment in the thread, by its id.
 *
 * @param {string} id - The comment id Reddit prints after `t1_`.
 * @returns {string} The comment's permalink.
 */
function comment(id: string): string {
  return `https://www.reddit.com/r/bitcoinpuzzles/comments/1thjjq/comment/${id}/`;
}

/** Wickex's comment with the method, posted after the one with the address. */
const METHOD = comment("ce86ejm");

/**
 * A GIF with a ZIP glued on after its last byte. The ZIP holds `MEGAN.txt`, and decoding that
 * with MEGAN-35 and then ATOM-128, two Base64 variants with shuffled alphabets, gives the WIF. The
 * thread never printed the key: Wickex published the address and the recipe, the author confirmed
 * both, and the recipe run on the GIF gives the key recorded here.
 */
export const iAmABananaAmaaGif = bitcoinPuzzle({
  id: "iamabananaamaa/gif",
  address: p2pkh("1DprL7pbKGwjMKoJ4c6BEKrTmtbPB4AiNJ", "8cae3ce6d5497fa7a9b30e085efd2c972c6e0f81"),
  sourceUrl: THREAD,
  startedAt: "2013-12-22 22:35:39",
  status: Status.Solved,
  pubkey: compressed("03987951b3fa4a6f68ba76bd509a8ac4945b3cb1e14be1eadd5d3210f590313024"),
  key: wif("L21s1A2LjTL5WLEfWPJtuKxHKF3PcfJnyiEtjNtPUxwnSdqWBD66"),
  prize: 0.001,
  hints: [
    official(
      "You don't need specialized software, no. However, you will (I believe) most likely need a program that basically anybody on the planet has since it has so many wide uses and public options.",
      comment("ce81be8"),
      undefined,
      {
        date: "2013-12-22",
        answer: answer(
          "images can be 'merged' with ZIP/RAR files, which you can open by renaming the extension of the .gif file to .zip. In there was a file called MEGAN.txt, with a string inside of it.",
          METHOD,
          { date: "2013-12-23" },
        ),
      },
    ),
    official(
      "Hint: Megan may not be a person, but if she was, she'd be 35 years old.",
      comment("ce8257x"),
      undefined,
      {
        date: "2013-12-22",
        answer: answer(
          "referring to MEGAN-35, a kind of hash. By decrypting it (google MEGAN-35 decrypter or something similar) I got another string, which turned out to be an ATOM-128 hash. When decrypted, it gave you the private key!",
          METHOD,
          { date: "2013-12-23" },
        ),
      },
    ),
    official(
      "Just to save you time, the thing in the bottom right is an error on the gif's part. The creator messed something up when creating it.",
      comment("ce825x4"),
      undefined,
      { date: "2013-12-22" },
    ),
    official("The zip file name was ATOM :).", comment("ce86n19"), undefined, {
      date: "2013-12-23",
    }),
    community(
      "Oh right. It is just a compressed file. This is the output of MEGAN.txt = jZXbm2zukIKdShNxcJnrkuXPm2XRSZGY=M1Gku=9gKGJc/9uju1eoJ=ynhfSjuXPddfvc2n4cJyqlMf2dLD4k2Nvi2refuSI",
      comment("ce828ht"),
      undefined,
      { date: "2013-12-22" },
    ),
  ],
  solvedAt: "2013-12-23 01:04:43",
  solveTime: 8944,
  transactions: [
    funding(
      "17975f67f8be43470c3abaa6ba847444de9453dafc817396a2c5383be31a8669",
      "2013-12-22 22:27:31",
      0.001,
    ),
    claim(
      "594f82e1a11a7fbf212715075685d3b3201342d0b26075e0dbd8365fa1eaba50",
      "2013-12-23 01:04:43",
      0.0009,
    ),
  ],
  solver: party("Wickex", {
    profiles: [profile("reddit", "https://www.reddit.com/user/Wickex/")],
  }),
  assets: assets({ puzzle: "gif/puzzle.gif", sourceUrl: GIF }),
});
