import { describe, expect, it } from "vitest";
import { b1000 } from "../../src/collections/b1000.ts";
import { ballet } from "../../src/collections/ballet.ts";
import { bitaps } from "../../src/collections/bitaps.ts";
import { bitimage } from "../../src/collections/bitimage.ts";
import {
  BitcoinPuzzle,
  bitcoinPuzzle,
  compressed,
  decredPuzzle,
  hex,
  litecoinPuzzle,
  p2pkh,
  p2sh,
  p2wpkh,
  p2wsh,
  seed,
  standard,
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

  it("keeps WIF compression when the same key is also recorded as hex", () => {
    const key = wif("5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF");
    const spec = { ...synthetic, address: p2pkh("1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj") };
    const original = verifyPuzzle(bitcoinPuzzle({ ...spec, key }));
    const enriched = verifyPuzzle(
      bitcoinPuzzle({
        ...spec,
        key: key.hex("E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"),
      }),
    );

    expect(original.verified).toBe(true);
    expect(enriched).toMatchObject({
      verified: true,
      derivedAddress: "1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj",
      privateKey: "E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262",
    });
  });

  it("prefers the declared public key format over a matching WIF for hex", () => {
    const result = verifyPuzzle(
      bitcoinPuzzle({
        ...synthetic,
        address: p2pkh("19GuvDvMMUZ8vq84wT79fvnvhMd5MnfTkR"),
        pubkey: compressed("02588d202afcc1ee4ab5254c7847ec25b9a135bbda0f2bc69ee1a714749fd77dc9"),
        key: hex("e9873d79c6d87dc0fb6a5778633389f4453213303da61f20bd67fc233aa33262").wif(
          "5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF",
        ),
      }),
    );

    expect(result).toMatchObject({
      verified: true,
      derivedAddress: "19GuvDvMMUZ8vq84wT79fvnvhMd5MnfTkR",
    });
  });

  it.each(["invalid WIF", "5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF"])(
    "ignores a WIF that cannot describe the hex key: %s",
    (encoded) => {
      const result = verifyPuzzle(
        bitcoinPuzzle({
          ...synthetic,
          address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
          key: hex("0000000000000000000000000000000000000000000000000000000000000001").wif(encoded),
        }),
      );

      expect(result).toMatchObject({
        verified: true,
        derivedAddress: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
        privateKey: "0000000000000000000000000000000000000000000000000000000000000001",
      });
    },
  );

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

  it.each([
    p2sh("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", "b472a266d0bd89c13706a4132ccfb16f7c3b9fcb"),
    standard("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
    p2wsh("bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj"),
  ])("marks unsupported $kind derivation as unavailable", (address) => {
    const result = verifyPuzzle(
      bitcoinPuzzle({
        ...synthetic,
        address,
        key: hex("0000000000000000000000000000000000000000000000000000000000000001"),
      }),
    );

    expect(result).toEqual({
      id: "test/synthetic",
      verified: false,
      privateKey: null,
      expectedAddress: address.value,
      derivedAddress: null,
      unavailable: true,
      error: `Cannot derive a ${address.kind} address from a private key alone`,
    });
  });

  it("keeps invalid private keys as failures", () => {
    const result = verifyPuzzle(
      bitcoinPuzzle({
        ...synthetic,
        address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
        key: hex("0000000000000000000000000000000000000000000000000000000000000000"),
      }),
    );

    expect(result).toMatchObject({
      verified: false,
      unavailable: false,
      derivedAddress: null,
      privateKey: null,
    });
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
