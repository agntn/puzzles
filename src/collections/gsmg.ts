import { SingletonCollection } from "../core/collection.ts";
import {
  assets,
  decrease,
  fact,
  funding,
  p2pkh,
  party,
  PartyKind,
  profile,
  uncompressed,
} from "../core/parts.ts";
import { bitcoinPuzzle } from "../core/puzzle.ts";

/** GSMG.IO multi-phase cryptographic challenge. */
export const gsmgPuzzle = bitcoinPuzzle({
  id: "gsmg",
  address: p2pkh("1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe", "a9553269572a317e39f0f518cb87c1a0ee1dbae4"),
  sourceUrl: "https://gsmg.io/puzzle",
  startedAt: "2019-04-13 16:32:40",
  pubkey: uncompressed(
    "04f4d1bbd91e65e2a019566a17574e97dae908b784b388891848007e4f55d5a4649c73d25fc5ed8fd7227cab0be4e576c0c6404db5aa546286563e4be12bf33559",
  ),
  prize: 1.25364181,
  transactions: [
    funding(
      "73e48ff571a7e9a4387574a50cf2fcb7b21b6ea5702c777a035664df57cbce02",
      "2019-04-13 16:32:40",
      5,
    ),
    decrease(
      "2aa9a4a90be819d5122d70c993280785a0508f163521e7b38cebb4db0b071b13",
      "2020-05-11 20:02:50",
      2.5,
    ),
    decrease(
      "88cdb3cdca12b471551b1b26188508a14ca5fd8a415223ffb7c190381c9b9df3",
      "2024-04-24 21:47:27",
      1.25,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.png",
    hints: ["follow_the_white_rabbit.png"],
    sourceUrl: "https://gsmg.io/puzzle",
  }),
});

/** GSMG.IO multi-phase cryptographic challenge. */
export class GsmgCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "gsmg";

  /** Who published the puzzles. */
  static readonly author = party("GSMG.io", {
    key: "gsmg",
    kind: PartyKind.Organization,
    about:
      "A crypto trading bot platform that ran from 2017 to 2026 and left a multi phase puzzle behind. The site now shows the lights off and one mystery left.",
    addresses: ["1EtbTvVB8QTGN4mduSdy7n4cZQm4iYTpQ1", "17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa"],
    profiles: [
      profile("website", "https://gsmg.io/puzzle"),
      profile("website", "https://gsmg.io/"),
    ],
    facts: [
      fact(
        "The front page says: A fully automated crypto trading bot. 2017 to 2026. The lights are off. Nine years of chaos ended. One mystery remains. Follow the white rabbit.",
        "https://gsmg.io/",
      ),
      fact(
        "Funded the puzzle address with 5 BTC on 2019-04-13.",
        "https://blockstream.info/tx/73e48ff571a7e9a4387574a50cf2fcb7b21b6ea5702c777a035664df57cbce02",
        { date: "2019-04-13" },
      ),
      fact(
        "Halved the prize at the 2020 halving and again in April 2024, moving 2.5 BTC and then 1.25 BTC to 17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa.",
        "https://blockstream.info/tx/88cdb3cdca12b471551b1b26188508a14ca5fd8a415223ffb7c190381c9b9df3",
        { date: "2024-04-24" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [gsmgPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(GsmgCollection.key, GsmgCollection.author, GsmgCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const gsmg = new GsmgCollection();
