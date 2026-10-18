import {
  answer,
  assets,
  claim,
  digest,
  funding,
  hex,
  official,
  party,
  uncompressed,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Part 1 of the statement, twenty seconds. */
const PART_1 = "https://www.youtube.com/watch?v=3l1jFa3Mw0s";

/** Part 2 of the statement, with the prize in its description. */
const PART_2 = "https://www.youtube.com/watch?v=hX-pOBj8VsI";

/** The author's solution video, the key on screen for its last seconds. */
const SOLVED = "https://www.youtube.com/watch?v=0jJ6XadOAWk";

/** Two short videos, one answer: the raw private key of an address funded with 0.05 ETH. */
export const cryptoPuzzles1 = puzzle({
  id: "crypto-puzzles/1",
  chain: "ethereum",
  address: "0xc99A54EEA6036115f913A13D6606e935bcA47a8f",
  sourceUrl: PART_1,
  startedAt: "2018-07-25 06:43:23",
  status: Status.Solved,
  pubkey: uncompressed(
    "046f39574f5df1a4e66b8a81f963847483d3436d2dae753fc517bd30895d7690751724d525b1d5840d20b8fdd541369dc2cbb2a692d654be5c0a4e11f66a3e5734",
  ),
  key: hex("4487fc620ad0c4c67e80be342b2ea1f5a3dc482be6fb9c2451007322ea8be35f"),
  prize: 0.05,
  solvedAt: "2018-07-26 14:03:08",
  solveTime: 112785,
  solver: party(undefined, { addresses: ["0xc9089cb949ddb182692f29cd57dfe8c3404c8171"] }),
  hints: [
    official(
      "Part 1 of the crypto puzzle. Good luck. Part 2 includes the final part.",
      PART_1,
      undefined,
      {
        date: "2018-07-25",
      },
    ),
    official(
      "2 parts, 1 answer. Do you have the ability to solve the crypto puzzle? Just be the first and you'll win 0.05 Ethereum.",
      PART_2,
      undefined,
      {
        date: "2018-07-26",
        answer: answer(
          "THE SOLUTION: 4487FC620AD0C4C67E80BE342B2EA1F5A3DC482BE6FB9C2451007322EA8BE35F, the private key of the prize address.",
          SOLVED,
          { date: "2018-08-01" },
        ),
      },
    ),
  ],
  transactions: [
    funding(
      "0xa8de9727e5166795b2a2e8d7b61762418dfaf3841dd9055769996bcaff74da46",
      "2018-07-19 05:26:53",
      0.05,
    ),
    claim(
      "0xab150c5d7a8c1cbf96ac10c259a5d861fa12526d13d2b1b55eecaf6b633dca39",
      "2018-07-26 14:03:08",
      0.049682,
    ),
    claim(
      "0xaf47c9c39f600c114a9778eef9ef2cdc544b3c86b1b246fdac0c6eaf2738face",
      "2018-07-26 20:03:16",
      0.000171,
    ),
  ],
  assets: assets({
    solution: "1/solution.png",
    sourceUrl: SOLVED,
    digests: [
      digest(
        "1/solution.png",
        "107ec596f29e2d9b33eb8f0fbd8beb2e142ae9c95a625155e56cd0f062bf5ae3",
        104_406,
      ),
    ],
  }),
});
