import { puzzle, Status } from "../../core/puzzle.ts";
import {
  assets,
  claim,
  compressed,
  decrease,
  digest,
  fact,
  funding,
  increase,
  party,
  PartyKind,
  profile,
} from "../../core/parts.ts";

/** Puzzle `zden/decred-autonomy`, whose archived page links the reward address. */
export const zdenPuzzleDecredAutonomy = puzzle({
  id: "zden/decred-autonomy",
  chain: "decred",
  address: "DseEpHK49hHrTJhxwop3B86K1dryv4CYz8N",
  sourceUrl: "https://web.archive.org/web/20170430210807/https://decred.org/autonomy_puzzle/",
  startedAt: "2017-04-25",
  status: Status.Solved,
  pubkey: compressed("02daa17dcb78cd7befd6986e3af1cc49acdd924f557990680c0b7ffe05ae03e960"),
  prize: 355.85470498,
  solvedAt: "2017-04-29 23:08:26",
  transactions: [
    funding(
      "9b23f474436acaa04c9564b52b5f25e9827ae0aebb3987940b7a3d09d256a530",
      "2017-04-06 04:35:18",
      500,
    ),
    decrease(
      "5120bdacb3bc40fdcb973e83f8f668cacbc023c98d2bb0d3488c37d7328972a7",
      "2017-04-11 18:06:54",
      499.9978,
    ),
    increase(
      "f47ed5fd145f13ab1c854ec1e40e562e2a1d84f8b8f7fc567bdd6460f08d192b",
      "2017-04-20 13:15:02",
      502.86217698,
    ),
    decrease(
      "4e09053c57c2ff223a32c0519a2d3eef09c453bb71de5b4208deed3c508a0456",
      "2017-04-25 15:04:44",
      502.85997698,
    ),
    increase(
      "e969b6cdeba0daae02b3c8a19e97fe5f3caf54c6ea32d6b1e1f9f57beb46b503",
      "2017-04-25 15:28:27",
      502.85777698,
    ),
    increase(
      "aeae3668012def4a28685a17f41994d6e2ed6ec945b212e7fed4f197e6db9846",
      "2017-04-25 17:15:57",
      3,
    ),
    decrease(
      "29ad35305d855ffbdf33db1289503f96ee13e77ff30cc1a081f8c368485b6420",
      "2017-04-26 17:00:53",
      100,
    ),
    decrease(
      "c36bff544080b6bb277cc7cf83ae52d01d354be08732c61170d5f8979518023d",
      "2017-04-27 17:01:06",
      50,
    ),
    decrease(
      "47ad4bdc2b1fd0c04b310458e16f421b138156604ba4e6270909b89afed30483",
      "2017-04-28 17:05:15",
      25,
    ),
    increase(
      "8e524803da794906fa597a1300c79dac2342ffddbbcd6a820d730bebb298e5af",
      "2017-04-29 17:14:03",
      25,
    ),
    claim(
      "26315309817926ba860b0b50bd334cadd314b0fd495862bafa85e7597a8d77e2",
      "2017-04-29 23:08:26",
      355,
    ),
    claim(
      "345c8e45365a358e74e743d446404164317ce0d236fdda98bf5c8fd8b4e50cab",
      "2017-04-29 23:08:26",
      0.85389698,
    ),
  ],
  solver: party("BlockCrushr Labs", {
    key: "blockcrushr-labs",
    kind: PartyKind.Organization,
    about: "Blockchain development lab whose Medium publication carries the Autonomy walk-through.",
    profiles: [
      profile(
        "solution",
        "https://medium.com/blockcrushr-labs/solving-decreds-autonomy-puzzle-aedac18f18f3",
      ),
      profile("medium", "https://medium.com/blockcrushr-labs"),
    ],
    facts: [
      fact(
        "Scott Burke wrote the walk-through for the publication: gears measured in pixels, a Gandhi quote as the Vigenère key, a 33-word seed.",
        "https://medium.com/blockcrushr-labs/solving-decreds-autonomy-puzzle-aedac18f18f3",
        { date: "2017-05-08" },
      ),
    ],
  }),
  assets: assets({
    puzzle: "decred-autonomy/puzzle.jpg",
    sourceUrl: "https://crypto.haluska.sk/gate_full.jpg",
    digests: [
      digest(
        "decred-autonomy/puzzle.jpg",
        "71a594766a6dfd8f11159ccc1555bedc675632af22ec3d9878c85e4eca606dc8",
        8489474,
        {
          url: "https://crypto.haluska.sk/gate_full.jpg",
          archive:
            "https://web.archive.org/web/20250929202710id_/https://crypto.haluska.sk/gate_full.jpg",
        },
      ),
    ],
  }),
});
