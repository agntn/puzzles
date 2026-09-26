import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  claim,
  compressed,
  fact,
  funding,
  hex,
  increase,
  official,
  p2pkh,
  party,
  PartyKind,
  profile,
} from "../core/parts.ts";
import { bitcoinPuzzle, Status } from "../core/puzzle.ts";

/** The announcement. Rules two weeks early, with a made-up range as the example. */
const ANNOUNCEMENT = "https://bitcointalk.org/index.php?topic=1306983.msg64639847#msg64639847";

/** The post with the address, the real range and the SHA-256 of the solve steps. */
const RANGE = "https://bitcointalk.org/index.php?topic=1306983.msg64691846#msg64691846";

/** The post with the solve steps after the claim, where kTimesG looked back on it. */
const STEPS = "https://bitcointalk.org/index.php?topic=1306983.msg64695204#msg64695204";

/** 80 unknown bits in a 511-bit key, public key only in a pending spend. Taken 39 minutes in. */
export const kTimesG80Bit = bitcoinPuzzle({
  id: "80-bit",
  address: p2pkh("1ECDLP8osCZHBB1LH5PVAUfFegeMgFb52q", "90b881be7044a596b0ac843d84ff31278ba92a12"),
  sourceUrl: RANGE,
  startedAt: "2024-11-01 00:01:53",
  status: Status.Solved,
  pubkey: compressed("03a61fc84b6429f07fc0edf25265ef7a0ced3cd9a0edea85e9f58b50b5d73f66e7"),
  key: hex("b40e7d34265ab9533a64622bd1a188fb8abb8829af545169abad49b46be5fe56"),
  prize: 0.005,
  hints: [
    official(
      "The Hamming length of the range will therefore be 80 contiguous bits, but they may start anywhere.",
      ANNOUNCEMENT,
      undefined,
      { date: "2024-10-16" },
    ),
    official(
      "minKey = 0x659756abf6c17ca70e0000000000000000000140be6ddd93e441f8d4b4a85653b20b4cdcc5c748207a0daa16191d07a425d8080c276f9412472e0429e61bc355 maxKey = 0x659756abf6c17ca70fffffffffffffffffffff40be6ddd93e441f8d4b4a85653b20b4cdcc5c748207a0daa16191d07a425d8080c276f9412472e0429e61bc355",
      RANGE,
      undefined,
      {
        date: "2024-11-01",
        answer: answer(
          "assert shift == 361; elem = shift_inv * (public_key - min_elem); assert idlp_key == 0x2d56cbf370cbeef9e80a; private_key = min_key | (idlp_key << shift); assert private_key % secp256k1.N == 0xb40e7d34265ab9533a64622bd1a188fb8abb8829af545169abad49b46be5fe56",
          STEPS,
          { date: "2024-11-02" },
        ),
      },
    ),
    official(
      "The challenge involves correctly extracting pubkey from the raw TX, otherwise it's a no brainer.",
      RANGE,
      undefined,
      { date: "2024-11-01" },
    ),
  ],
  solvedAt: "2024-11-02 00:37:21",
  solveTime: 88528,
  transactions: [
    funding(
      "e4a2751bf7b936bd7661028799f083376a423aa05582a7f24225763bac43568b",
      "2024-10-28 12:12:51",
      0.0025,
    ),
    increase(
      "a7d8b7f7a8ce7c2a79d9d166c2f96cbd5ff1d3223a707f9d29bf6d091fc5b2f9",
      "2024-10-28 12:58:01",
      0.0025,
    ),
    claim(
      "dc8309f8b588e70c4f91f766108a9bbccd03839e846997cb93fe7dd08d162f36",
      "2024-11-02 00:37:21",
      0.00495,
    ),
  ],
  solver: party(undefined, { addresses: ["14q4SoQwENXXzsVT3GMwDrDUGiW5QZeiDg"] }),
});

/** kTimesG's 80-bit key cracking challenge from Bitcointalk. */
export class EightyBitCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "80-bit";

  /** Who published the puzzles. */
  static readonly author = party("kTimesG", {
    key: "ktimesg",
    kind: PartyKind.Person,
    about:
      "Writes on Bitcointalk about cracking Bitcoin keys. In 2024 offered 0.005 BTC to whoever cracked a key with 80 unknown bits before its transaction confirmed. Someone did, 39 minutes in.",
    profiles: [
      profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=3610370"),
    ],
    facts: [
      fact(
        "Announced the 80-bit challenge two weeks early. Only asked the winner to say how they broke the key.",
        ANNOUNCEMENT,
        { date: "2024-10-16" },
      ),
      fact(
        "Was disappointed it took 39 minutes to replace the spend. With a real 80-bit puzzle, nobody gets 40.",
        STEPS,
        { date: "2024-11-02" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [kTimesG80Bit];

  /** Builds the canonical collection. */
  constructor() {
    super(EightyBitCollection.key, EightyBitCollection.author, EightyBitCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const eightyBit = new EightyBitCollection();
