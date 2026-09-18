import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh, party } from "../../core/parts.ts";

/** Puzzle `b1000/69`. */
export const b1000Puzzle69 = bitcoinPuzzle({
  id: "b1000/69",
  address: p2pkh("19vkiEajfhuZ8bs8Zu2jgmC6oqZbWqhxhG", "61eb8a50c86b0584bb727dd65bed8d2400d6d5aa"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("024babadccc6cfd5f0e5e7fd2a50aa7d677ce0aa16fdce26a0d0882eed03e7ba53"),
  key: hex("0000000000000000000000000000000000000000000000101d83275fb2bc7e0c", 69).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qefJjCmLAPHbQ4x7D9Qy",
  ),
  prize: 6.9,
  solvedAt: "2025-04-30 14:45:54",
  solveTime: 324679120,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.069,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.621,
    ),
    increase(
      "0401d3fd3016076ac5a81dc51b3b6198375ae70c3e7b63be2f33ae9469b7527e",
      "2022-04-01 06:05:22",
      0.00000547,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      6.21,
    ),
    increase(
      "a9334d335e59aa30832d57641085d0ff4c61a26fc16c4bed22368b0659539463",
      "2023-09-25 15:00:17",
      0.00003768,
    ),
    increase(
      "55571ca5e1f86c11a5ec5837aa1edf4262042b4b18379373585047ce8f8938cf",
      "2024-05-12 00:07:46",
      0.00000546,
    ),
    increase(
      "e4d9ea3521786bc65afaa9150935146d4068c8638bde45e76c9d09462f19da9b",
      "2024-07-21 16:43:01",
      0.000082,
    ),
    increase(
      "598d68ece8df8ca9baf6de361ce8c40bb7956342348d569f219d65e5725b627c",
      "2025-01-28 07:27:07",
      0.000006,
    ),
    claim(
      "a52c5046f3097a8c2bd3b9889df2fb47b104d47a16cc679d3357feec003db753",
      "2025-04-30 14:45:54",
      6.9,
    ),
  ],
  solver: party(undefined, { addresses: ["15g7XHM6u921DvvPrgguxYkxDL8ruPGHXZ"] }),
});
