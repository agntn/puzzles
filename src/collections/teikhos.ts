import { NumericCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { teikhos1 } from "./teikhos/1.ts";
import { teikhos2 } from "./teikhos/2.ts";
import { teikhos3 } from "./teikhos/3.ts";
import { teikhos4 } from "./teikhos/4.ts";

/**
 * Johan Nygren's TeikhosBounty contracts: each pays whoever submits the public key its stored
 * proof was masked with. Numbered in deployment order, leaving out the one that cannot pay.
 */
export class TeikhosCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "teikhos";

  /** Deployed and funded every contract from one address in 2018. */
  static readonly author = party("Johan Nygren", {
    key: "johan-nygren",
    kind: PartyKind.Person,
    aliases: ["resilience-me", "bipedaljoe"],
    about:
      "Proof-of-personhood tinkerer who named a proof of public key scheme Teikhos and put ETH behind five contracts to show it holds.",
    addresses: ["0x4c5d24a7ca972aea90cc040da6770a13fc7d4d9a"],
    profiles: [profile("github", "https://github.com/resilience-me")],
    facts: [
      fact(
        "Signs the Bitpeople whitepaper in the resilience-me panarchy repository as Johan Nygren.",
        "https://github.com/resilience-me/panarchy/blob/main/documentation/bitpeople.md",
      ),
      fact(
        "Published ProofOfSymmetricKey.sol as a gist with the same stored proofs as teikhos/2, deployed 48 minutes later.",
        "https://gist.github.com/resilience-me/be11a0ed3575dddca10df8263b53cc1d",
        { date: "2018-02-27" },
      ),
      fact(
        'Proposed proof_of_public_key = keccak256(nextPublicKey) on the EIPs tracker and named it Teikhos, from the Greek for "wall" or "fortification".',
        "https://github.com/ethereum/EIPs/issues/935",
        { date: "2018-03-19" },
      ),
    ],
  });

  /** Every paying contract, in deployment order. */
  static readonly puzzles = [teikhos1, teikhos2, teikhos3, teikhos4];

  /** Builds the canonical collection. */
  constructor() {
    super(TeikhosCollection.key, TeikhosCollection.author, TeikhosCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const teikhos = new TeikhosCollection();
