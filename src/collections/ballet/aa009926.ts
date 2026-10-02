import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { assets, digest, encryptedWif, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `ballet/AA009926`. */
export const balletPuzzleAA009926 = bitcoinPuzzle({
  id: "ballet/AA009926",
  address: p2pkh("1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m", "c4fa091d1f5a598d5362f1bc78ef3892ca37357f"),
  sourceUrl: "https://x.com/bobbyclee/status/1289004702122643456",
  startedAt: "2020-07-24 05:46:12",
  key: encryptedWif("6PnQmAyBky9ZXJyZBv9QSGRUXkKh9HfnVsZWPn4YtcwoKy5vufUgfA3Ld7"),
  prize: 1.00003481,
  transactions: [
    funding(
      "3771eac625e0ac4eb60bab31ea73424634b068ac4e724af0cd87330311837933",
      "2020-07-24 05:46:12",
      1,
    ),
    increase(
      "5037ba0edc3ea80df73f38eb4d3ab4c0e395433807d58a4c8289bec11e677bd7",
      "2022-01-30 13:11:20",
      0.00001,
    ),
    increase(
      "ddd79c2a6f1772359e9b6c8ab2140275e9005d0dee8bce566e6b8d52a9a3921c",
      "2024-05-17 17:34:48",
      0.00002481,
    ),
  ],
  assets: assets({
    puzzle: "AA009926/puzzle.jpg",
    hints: ["AA009926/revealed.jpg"],
    sourceUrl: "https://x.com/bobbyclee/status/1289004702122643456",
    digests: [
      digest(
        "AA009926/puzzle.jpg",
        "574c68aebff7673fa29024d0765056b8b204d27ff8d4bfc22aabd42bc7977560",
        1566737,
        { url: "https://pbs.twimg.com/media/EeNwTlWU8AAYeMl.jpg?name=orig" },
      ),
      digest(
        "AA009926/revealed.jpg",
        "78d4c2b748d66e68c2d6226ecf8df338d6b15fb2141f4d57fe74424de44eb859",
        217605,
        {
          url: "https://pbs.twimg.com/media/EeNyXh-UwAAToEr.jpg",
          archive:
            "https://web.archive.org/web/20210506201027id_/https://pbs.twimg.com/media/EeNyXh-UwAAToEr.jpg",
        },
      ),
    ],
  }),
});
