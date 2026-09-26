import {
  answer,
  claim,
  compressed,
  funding,
  hex,
  official,
  p2pkh,
  party,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the public key, the author's hints, the key and the explanation were posted. */
const THREAD = "https://bitcointalk.org/index.php?topic=5526453";

/**
 * Mini-puzzle #4: a public key whose private key k satisfies k·λ = k − 1, so the endomorphism of
 * secp256k1 maps the point to the one just before it. The post prints only the public key and says
 * 0.01 BTC sits on its address; a commenter printed the address, the compressed 1-address of that
 * key, and the funding and the claim went through it.
 */
export const mini4 = bitcoinPuzzle({
  id: "mini/4",
  address: p2pkh("1AH5pRZW4ZofEJhdb3muNZ1q88YNu3Rez7", "65c3cf1b54c179e6a2fee4fa3a148ed9b88b9970"),
  sourceUrl: THREAD,
  startedAt: "2025-01-14 17:22:30",
  status: Status.Solved,
  pubkey: compressed("03c8f139dad58b4786d3649992849733c2a7626f011089e87508ccdf8b0758c493"),
  key: hex("c6768f199574104ae1b75eab82b0cc1d2d2e9ee7d50637a574e27131e9301552"),
  prize: 0.01,
  hints: [
    official(
      "03C8F139DAD58B4786D3649992849733C2A7626F011089E87508CCDF8B0758C493 Hint: It's a strong point so you cannot solve it by kangaroos. But it's a special point, you can solve it easily if you use some feature of secp256k1.",
      `${THREAD}.msg64953111#msg64953111`,
      undefined,
      {
        date: "2025-01-14",
        answer: answer(
          "Another explanation: It's a special point, if you apply endomorphism for it, you will get previous point (Point - G). It's funny to have two points next to each other with same Y, isn't it? And since you know the distance between these two points, you can calculate the private key easily.",
          `${THREAD}.msg64955287#msg64955287`,
          { date: "2025-01-15" },
        ),
      },
    ),
    official(
      "It's not difficult, really. And you don't even need GPUs or fast PC.",
      `${THREAD}.msg64953121#msg64953121`,
      undefined,
      { date: "2025-01-14" },
    ),
    official(
      "ECDSA already was in previous puzzle, so probably I won't use it again",
      `${THREAD}.msg64953401#msg64953401`,
      undefined,
      { date: "2025-01-14" },
    ),
  ],
  solvedAt: "2025-01-15 08:41:05",
  solveTime: 55_115,
  transactions: [
    funding(
      "5353b25012c66b78034dc3690e444b3eac916e1f71eb8af1f2d27a156576ae8c",
      "2025-01-14 17:03:40",
      0.01,
    ),
    claim(
      "3df3a1c6233c1b01c449ef2febeab82bd628bad1bc07f4b4c84a2f9017563007",
      "2025-01-15 08:41:05",
      0.01,
    ),
  ],
  solver: party(undefined, {
    addresses: ["1J9qV9saEgM1UZo7XetLsChmKHPXtTE6uw"],
  }),
});
