import { describe, expect, it } from "vitest";
import { b1000 } from "../../src/collections/b1000.ts";
import { ballet } from "../../src/collections/ballet.ts";
import { bitaps } from "../../src/collections/bitaps.ts";
import { bitimage } from "../../src/collections/bitimage.ts";
import {
  BitcoinPuzzle,
  bitcoinPuzzle,
  decredPuzzle,
  hex,
  litecoinPuzzle,
  p2pkh,
  p2wpkh,
  seed,
  verifyPuzzle,
  wif,
  type Address,
  type Key,
} from "../../src/index.ts";

/** The fields every synthetic record below shares; the dataset never exercises these branches. */
const synthetic = {
  id: "test/synthetic",
  sourceUrl: "https://example.com",
  startedAt: "2020-01-01 00:00:00",
} as const;

describe("Collection.verify", () => {
  it("verifies a known direct private key", async () => {
    const result = await b1000.verify(1);

    expect(result.verified).toBe(true);
    expect(result.derivedAddress).toBe("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
  });

  it("verifies a record that carries hex, a WIF and a BIP38 payload", async () => {
    const result = await ballet.verify("AA007448");

    expect(result.verified).toBe(true);
    expect(result.derivedAddress).toBe(ballet.require("AA007448").address().value);
  });

  it("returns an expected failure for unavailable secret material", async () => {
    const result = await bitimage.verify("kitten_passphrase");

    expect(result).toMatchObject({ verified: false, unavailable: true });
    expect(result.error).toContain("no private key");
  });

  it("agrees with hasPrivateKey on seed records without a phrase", async () => {
    const puzzle = bitaps.require();

    expect(puzzle.hasPrivateKey()).toBe(false);
    expect(await bitaps.verifyById(puzzle.id())).toMatchObject({
      verified: false,
      unavailable: true,
    });
  });

  it("derives the address from a WIF alone", () => {
    const result = verifyPuzzle(
      bitcoinPuzzle({
        ...synthetic,
        address: p2pkh("1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj"),
        key: wif("5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF"),
      }),
    );

    expect(result).toMatchObject({
      verified: true,
      privateKey: "e9873d79c6d87dc0fb6a5778633389f4453213303da61f20bd67fc233aa33262",
    });
  });

  it("decodes a Litecoin WIF against Litecoin, not Bitcoin", () => {
    const result = verifyPuzzle(
      litecoinPuzzle({
        ...synthetic,
        address: p2pkh("LTVsBSEBS8oCBdpE7b6SwwrguZzMUnjsWr"),
        key: wif("TAsve34b6yMQn1hBGTc472BfW8kvEoct5MhZrxADHEB7oZgBbky4"),
      }),
    );

    expect(result).toMatchObject({
      verified: true,
      derivedAddress: "LTVsBSEBS8oCBdpE7b6SwwrguZzMUnjsWr",
    });
  });

  it("derives the address at a seed's path", () => {
    const result = verifyPuzzle(
      bitcoinPuzzle({
        ...synthetic,
        address: p2pkh("1EHiMwCPzcvMdeGowsowVF2X2PgLo67Qj7"),
        key: seed(
          "since desk thrive carbon zone prison leaf depart hobby practice ivory luggage",
          "m/44'/0'/0'/0/0",
        ),
      }),
    );

    expect(result).toMatchObject({
      verified: true,
      derivedAddress: "1EHiMwCPzcvMdeGowsowVF2X2PgLo67Qj7",
    });
  });

  it("derives a seed whose BIP39 checksum fails, the way the Bitcoin Movie Enigma phrase does", () => {
    /* The phrase, the address and the compressed key it spent with are all on chain. */
    const result = verifyPuzzle(
      bitcoinPuzzle({
        ...synthetic,
        address: p2wpkh("bc1q94ecsn0qk8lap2gefrycnms3ruepy889z969a6"),
        key: seed(
          "path mad alien apology escape spare miss goddess leopard crime visit clock start first blade guard close barrel term screen matrix toy ghost shine",
          "m/84'/0'/0'/0/0",
        ),
      }),
    );

    expect(result).toMatchObject({
      verified: true,
      derivedAddress: "bc1q94ecsn0qk8lap2gefrycnms3ruepy889z969a6",
      privateKey: "c823cde62ae38f9c5c94ccd92c067d9687390d1c5fd148f9d81c67ec70851c3d",
    });
  });

  it("fails a seed with a word outside the BIP39 list", () => {
    const result = verifyPuzzle(
      bitcoinPuzzle({
        ...synthetic,
        address: p2pkh("1EHiMwCPzcvMdeGowsowVF2X2PgLo67Qj7"),
        key: seed(
          "since desk thrive carbon zone prison leaf depart hobby practice ivory nope",
          "m/44'/0'/0'/0/0",
        ),
      }),
    );

    expect(result).toMatchObject({
      verified: false,
      unavailable: false,
      error: "Invalid BIP39 mnemonic",
    });
  });

  it("marks a Decred seed as unavailable, because keys derives no Decred HD wallet", () => {
    const result = verifyPuzzle(
      decredPuzzle({
        ...synthetic,
        address: p2pkh("DsmcYVbP1Nmag2H4AS17UTvmWXmGeA7nLDx"),
        key: seed(
          "since desk thrive carbon zone prison leaf depart hobby practice ivory luggage",
          "m/44'/42'/0'/0/0",
        ),
      }),
    );

    expect(result).toMatchObject({
      verified: false,
      unavailable: true,
      error: "Seed derivation is not supported for decred",
    });
  });

  it("marks encrypted key material as unavailable, not failed", async () => {
    const result = await ballet.verify("AA009926");

    expect(result).toMatchObject({ verified: false, unavailable: true, error: "WIF is encrypted" });
  });

  it("marks a derivation mismatch as a real failure", () => {
    class MismatchPuzzle extends BitcoinPuzzle {
      override id(): string {
        return "test/mismatch";
      }

      override address(): Address {
        return p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
      }

      override sourceUrl(): string {
        return "https://example.com";
      }

      override startedAt(): string {
        return "2020-01-01 00:00:00";
      }

      override key(): Key {
        return hex("0000000000000000000000000000000000000000000000000000000000000002");
      }
    }

    const result = verifyPuzzle(new MismatchPuzzle());

    expect(result).toMatchObject({ verified: false, unavailable: false });
    expect(result.error).toContain("Verification mismatch");
  });
});
