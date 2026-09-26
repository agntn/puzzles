import {
  answer,
  claim,
  compressed,
  funding,
  hex,
  increase,
  official,
  p2pkh,
  party,
} from "../../core/parts.ts";
import { bitcoinCashPuzzle, Status } from "../../core/puzzle.ts";

/** Where the signed message, the hints, the author's explanation and the key were posted. */
const THREAD = "https://bitcointalk.org/index.php?topic=5522785";

/**
 * Mini-puzzle #3, for puzzle #130: a message signed with that puzzle's key, whose nonce sits 80
 * bits away from the nonce of a signature the author had published before. privatekeys.pw prints
 * the CashAddr; the post names the puzzle. The key is puzzle #130's own, printed in the thread
 * after the claim.
 */
export const mini3 = bitcoinCashPuzzle({
  id: "mini/3",
  address: p2pkh(
    "bitcoincash:qz3yjg59ypg6jqpwhaxgvjj44jm4hdx0w5wsxw2qez",
    "a24922852051a9002ebf4c864a55acb75bb4cf75",
  ),
  sourceUrl: THREAD,
  startedAt: "2024-12-14 16:22:32",
  status: Status.Solved,
  pubkey: compressed("03633cbe3ec02b9401c5effa144c5b4d22f87940259634858fc7e59b1c09937852"),
  key: hex("000000000000000000000000000000033e7665705359f04f28b88cf897c603c9", 130),
  prize: 1.3,
  hints: [
    official(
      "Message: Anything one man can imagine, other men can make real. Signature: IIONt3uYHbMh+vUnqDBGHP2gGu1Q2Fw0WnsKj05eT9P8KI2kGgPniiPirCd5IeLRnRdxeiehDxxsyn/VujUaX8o=",
      `${THREAD}.msg64847018#msg64847018`,
      undefined,
      {
        date: "2024-12-14",
        answer: answer(
          "Since it seems that the winner is not here, I will explain this riddle. 1. So we have a signature, we should check for weak K1, use kangaroos of course What's the range for search? Use a hint from the message, 80bit. Fails, it seems K1 is strong. 2. Remember that I posted another signature, take K2, may be K1==K2? No. So if we have both strong K1 and K2, what it can be? Remember that ECDSA Signature is vulnerable not only when K1==K2 but also if we know that K1 has some relation with K2, for example, K2=K1+1 (the simplest case). How to check it? Remember that R1=G*K1 and R2=G*K2 and we have these R1 and R2 points in signatures, so we can substract: PntDiff = R1 - R2 (and also try R2 - R1) and check if it's G. It's not G, ok, may be the difference is not 1 but more? We should try to solve PntDiff (both variants) with kangaroos. What's the range? Same, 80bits. And we can solve it, so now we have delta_K. 3. Now calculate, google or ask chatbot to get the formula: pk = ((delta_k * s1 * s2) + (z2 * s1) - (z1 * s2)) / (r1 * s2 - r2 * s1) [mod n] That's all!",
          `${THREAD}.msg64850761#msg64850761`,
          { date: "2024-12-15" },
        ),
      },
    ),
    official("A hint is in the message", `${THREAD}.msg64847038#msg64847038`, undefined, {
      date: "2024-12-14",
    }),
    official(
      "Yes, you should have some understanding of ECDSA signature vulnerabilities.",
      `${THREAD}.msg64847430#msg64847430`,
      undefined,
      { date: "2024-12-14" },
    ),
    official(
      "Same K or weak K would be too easy. This riddle is just one step more complex.",
      `${THREAD}.msg64849365#msg64849365`,
      undefined,
      { date: "2024-12-15" },
    ),
    official(
      "24 hours have passed, here is the first hint: don't take anything from the blockchain.",
      `${THREAD}.msg64850292#msg64850292`,
      undefined,
      { date: "2024-12-15" },
    ),
  ],
  solvedAt: "2024-12-15 17:21:10",
  solveTime: 89_918,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.13,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.17,
    ),
    claim(
      "c237333cdee09fe03b913d857f06ae6aec830f87c9a5f58a94c28bdbce558bf3",
      "2024-12-15 17:21:10",
      1.3,
    ),
  ],
  solver: party(undefined, {
    addresses: ["bitcoincash:qrda29v338en6lkt5s8mv3wls0l778qg0sdxk42358"],
  }),
});
