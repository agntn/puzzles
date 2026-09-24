import {
  answer,
  claim,
  community,
  funding,
  increase,
  official,
  p2pkh,
  party,
  profile,
  sweep,
  uncompressed,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** The post: the address, 1 mBTC and a line of hex to start from. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/1ti0uw/medium_1mbtc_find_the_private_key/";

/**
 * A comment in the thread, by its id.
 *
 * @param {string} id - The comment id Reddit prints after `t1_`.
 * @returns {string} The comment's permalink.
 */
function comment(id: string): string {
  return `https://www.reddit.com/r/bitcoinpuzzles/comments/1ti0uw/comment/${id}/`;
}

/** IAMABananaAMAA's four steps, posted after the prize was gone the second time. */
const METHOD = comment("ce87ss1");

/**
 * The hex spells a YouTube link. The video holds Morse code, the Morse spells a bit.ly path in
 * capitals, and that leads to a second video whose spectrogram shows a string. The string is a
 * brainwallet passphrase. The thread never printed it, only its ends, and the first video is
 * private now, so the record has no key. The public key comes from the claims' input scripts.
 * IAMABananaAMAA swept first and sent the prize back in the same block. Someone took it again
 * nineteen minutes later, and the thread never says who.
 */
export const wickexYouTube = bitcoinPuzzle({
  id: "wickex/youtube",
  address: p2pkh("1LhQZc57j9i3xofj5poayd6PnakN7xHwDA", "d80eb27236847fae88418ce952444a4657092259"),
  sourceUrl: THREAD,
  startedAt: "2013-12-23 02:22:43",
  status: Status.Solved,
  pubkey: uncompressed(
    "04f84646d641306db5209da72a4f7ce6386404fb4035a296b38467a39406a6bac7b85b541eab98b8b217245a7ba0f9dfca5549a659470d69abb3544d7772d5c684",
  ),
  prize: 0.001,
  hints: [
    official(
      "I'll start you all off with the following code: 68 74 74 70 3a 2f 2f 77 77 77 2e 79 6f 75 74 75 62 65 2e 63 6f 6d 2f 77 61 74 63 68 3f 76 3d 71 59 78 38 46 76 58 39 69 62 30",
      THREAD,
      undefined,
      {
        date: "2013-12-23",
        answer: answer("Hex -> Text -> Youtube URL", METHOD, { date: "2013-12-23" }),
      },
    ),
    official("The morse-output should be all-caps by the way!", comment("ce86ukc"), undefined, {
      date: "2013-12-23",
      answer: answer(
        "I personally loaded the Youtube video into Audacity to make it more clear, but it was morse code -> text.",
        METHOD,
        { date: "2013-12-23" },
      ),
    }),
    official("It's case-sensitive and all caps.", comment("ce86v8h"), undefined, {
      date: "2013-12-23",
      answer: answer(
        "That was a bit.ly which went to the second video. That video was loaded into Sonic Visualiser and that had a string encoded into the sound.",
        METHOD,
        { date: "2013-12-23" },
      ),
    }),
    official(
      "The image is meaningless. You're one step away, Brainwallet.org!",
      comment("ce86xa9"),
      undefined,
      {
        date: "2013-12-23",
        answer: answer("That string in Brainwallet.org was the private key.", METHOD, {
          date: "2013-12-23",
        }),
      },
    ),
    community(
      'Any hint on the image? I have the text (I dont want to spoil it here, but "STI...I5Z") but I don\'t know about that.',
      comment("ce86vnj"),
      undefined,
      { date: "2013-12-23" },
    ),
  ],
  solvedAt: "2013-12-23 03:08:58",
  solveTime: 2775,
  transactions: [
    funding(
      "57252340e3fa7f4480c4e578fa81da48fd1f7a4dc0c640b43b651a2ebfbd9c8c",
      "2013-12-23 02:22:25",
      0.001,
    ),
    claim(
      "5575a2365c3473d1e2ecdc7735fe8550942640de62cafcfe406914a99e0fd28b",
      "2013-12-23 03:08:58",
      0.0009,
    ),
    increase(
      "8c0dad07879ca7e87d4e6c6b65a669394d79466c09ea31533d5bcee2e4a70072",
      "2013-12-23 03:08:58",
      0.001,
    ),
    claim(
      "d800bb1584c0258907c0790251ea1e8585ec3077e0ee3eb2d4b6642f0ef5e785",
      "2013-12-23 03:27:40",
      0.0009,
    ),
    increase(
      "53326fec15eead49002ddc811b3275e276dd3b488efb77a19196f06cda938a3d",
      "2014-02-01 04:53:39",
      0.00027486,
    ),
    sweep(
      "730ee0ff5dff3f8a296beabab0f06b02b76362f10cbce560f2e58d9522129d9d",
      "2014-02-01 04:53:39",
      0.00017486,
    ),
  ],
  solver: party("IAMABananaAMAA", {
    profiles: [profile("reddit", "https://www.reddit.com/user/IAMABananaAMAA/")],
  }),
});
