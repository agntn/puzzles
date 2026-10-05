import { describe, expect, it } from "vite-plus/test";
import { b1000 } from "../../src/collections/b1000.ts";
import { ballet } from "../../src/collections/ballet.ts";
import { bitaps } from "../../src/collections/bitaps.ts";
import { bitimage } from "../../src/collections/bitimage.ts";
import { quizchain } from "../../src/collections/quizchain.ts";
import { warp } from "../../src/collections/warp.ts";
import { zden } from "../../src/collections/zden.ts";
import {
  type Address,
  BitcoinPuzzle,
  compressed,
  hex,
  type Key,
  p2pkh,
  p2sh,
  p2wpkh,
  p2wsh,
  puzzle,
  seed,
  standard,
  technique,
  verify,
  wif,
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

  it("verifies Codex Protocol's key published by Zden", async () => {
    const puzzle = zden.require("codex-protocol");
    expect(puzzle.keyData()).toEqual({
      hex: "5a9674dbee5a9674dbee5a9674dbee5a9674dbee5a9674dbee5a9674dbfcf3ec",
    });
    expect(puzzle.toJSON().key).toEqual({
      hex: "5a9674dbee5a9674dbee5a9674dbee5a9674dbee5a9674dbee5a9674dbfcf3ec",
    });
    expect(puzzle.hasPrivateKey()).toBe(true);
    expect(puzzle.assets()).toMatchObject({
      puzzle: "codex-protocol/puzzle.png",
      solution: "codex-protocol/solution.md",
      hints: ["codex-protocol/hint-1.png", "codex-protocol/hint-2.png"],
      source_url: "https://crypto.haluska.sk/CodexPuzzle.png",
    });
    expect(await zden.verify("codex-protocol")).toEqual({
      id: "zden/codex-protocol",
      verified: true,
      privateKey: "5a9674dbee5a9674dbee5a9674dbee5a9674dbee5a9674dbee5a9674dbfcf3ec",
      expectedAddress: "0x6b2560b34c7469c561a8fce581c88bfb8cce73b2",
      derivedAddress: "0x6b2560b34C7469c561a8FCe581C88BFb8CcE73B2",
      error: null,
    });
  });

  it("returns an expected failure for unavailable secret material", async () => {
    const result = await bitimage.verify("kitten-passphrase");

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

  it("derives the address from a WIF alone", async () => {
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "bitcoin",
        address: p2pkh("1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj"),
        key: wif("5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF"),
      }),
    );

    expect(result).toMatchObject({
      verified: true,
      privateKey: "e9873d79c6d87dc0fb6a5778633389f4453213303da61f20bd67fc233aa33262",
    });
  });

  it("keeps WIF compression when the same key is also recorded as hex", async () => {
    const key = wif("5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF");
    const spec = { ...synthetic, address: p2pkh("1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj") };
    const original = await verify(puzzle({ ...spec, chain: "bitcoin", key }));
    const enriched = await verify(
      puzzle({
        ...spec,
        chain: "bitcoin",
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

  it("prefers the declared public key format over a matching WIF for hex", async () => {
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "bitcoin",
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
    async (encoded) => {
      const result = await verify(
        puzzle({
          ...synthetic,
          chain: "bitcoin",
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

  it("derives a Base key into the same Keccak address Ethereum would, in any case", async () => {
    const one = "0000000000000000000000000000000000000000000000000000000000000001";

    for (const address of [
      "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf",
      "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
    ]) {
      expect(
        await verify(
          puzzle({ ...synthetic, chain: "base", address: standard(address), key: hex(one) }),
        ),
      ).toMatchObject({ verified: true, privateKey: one });
    }
  });

  it("decodes a Litecoin WIF against Litecoin, not Bitcoin", async () => {
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "litecoin",
        address: p2pkh("LTVsBSEBS8oCBdpE7b6SwwrguZzMUnjsWr"),
        key: wif("TAsve34b6yMQn1hBGTc472BfW8kvEoct5MhZrxADHEB7oZgBbky4"),
      }),
    );

    expect(result).toMatchObject({
      verified: true,
      derivedAddress: "LTVsBSEBS8oCBdpE7b6SwwrguZzMUnjsWr",
    });
  });

  it("decodes a Dogecoin WIF against Dogecoin and keeps its compression", async () => {
    const one = "0000000000000000000000000000000000000000000000000000000000000001";

    for (const [key, address] of [
      [
        "QNcdLVw8fHkixm6NNyN6nVwxKek4u7qrioRbQmjxac5TVoTtZuot",
        "DFpN6QqFfUm3gKNaxN6tNcab1FArL9cZLE",
      ],
      ["6J8csdv3eDrnJcpSEb4shfjMh2JTiG9MKzC1Yfge4Y4GyUsjdM6", "DJRU7MLhcPwCTNRZ4e8gJzDebtG1H5M7pc"],
    ] as const) {
      expect(
        await verify(
          puzzle({ ...synthetic, chain: "dogecoin", address: p2pkh(address), key: wif(key) }),
        ),
      ).toMatchObject({ verified: true, derivedAddress: address, privateKey: one });
    }
    /* Bitcoin's WIF of the same key carries another version byte. */
    expect(
      await verify(
        puzzle({
          ...synthetic,
          chain: "dogecoin",
          address: p2pkh("DFpN6QqFfUm3gKNaxN6tNcab1FArL9cZLE"),
          key: wif("KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn"),
        }),
      ),
    ).toMatchObject({ verified: false });
  });

  it("derives a Bitcoin Cash key into CashAddr and reads its WIF the way Bitcoin writes it", async () => {
    /* Puzzle #130's key; the BCH side of its address is where RetiredCoder's mini-puzzle sat. */
    const key = "000000000000000000000000000000033e7665705359f04f28b88cf897c603c9";
    const address = p2pkh("bitcoincash:qz3yjg59ypg6jqpwhaxgvjj44jm4hdx0w5wsxw2qez");

    for (const material of [
      hex(key, 130),
      wif("KwDiBf89QgGbjEhKnhXJuH8DvUBxVmJ3761ahfZuohBr53Zh9M3t"),
    ]) {
      expect(
        await verify(puzzle({ ...synthetic, chain: "bitcoincash", address, key: material })),
      ).toMatchObject({
        verified: true,
        derivedAddress: "bitcoincash:qz3yjg59ypg6jqpwhaxgvjj44jm4hdx0w5wsxw2qez",
        privateKey: key,
      });
    }
  });

  it("derives an eCash seed at Cashtab's path into CashAddr", async () => {
    /* The Proof Of Writing seed, published once the prize was claimed. */
    const phrase = "matter key easily slot maple two visa swamp subject friend robust trip";
    const address = p2pkh("ecash:qq5r308v2mkh6x5mkqpr6wytszz6f9r7qcnfttev0z");

    expect(
      await verify(
        puzzle({ ...synthetic, chain: "ecash", address, key: seed(phrase, "m/44'/1899'/0'/0/0") }),
      ),
    ).toMatchObject({
      verified: true,
      derivedAddress: "ecash:qq5r308v2mkh6x5mkqpr6wytszz6f9r7qcnfttev0z",
    });
    /* The Bitcoin Cash spelling of the same hash is another chain's address. */
    expect(
      await verify(
        puzzle({
          ...synthetic,
          chain: "ecash",
          address: p2pkh("bitcoincash:qq5r308v2mkh6x5mkqpr6wytszz6f9r7qc2ylqzkf4"),
          key: seed(phrase, "m/44'/1899'/0'/0/0"),
        }),
      ),
    ).toMatchObject({ verified: false });
  });

  it("derives the address at a seed's path", async () => {
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "bitcoin",
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

  it("derives a seed whose BIP39 checksum fails, the way the Bitcoin Movie Enigma phrase does", async () => {
    /* The phrase, the address and the compressed key it spent with are all on chain. */
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "bitcoin",
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

  it("fails a seed with a word outside the BIP39 list", async () => {
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "bitcoin",
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
      error: "Invalid BIP39 mnemonic: word 12 is not in the English list",
    });
  });

  it("marks a Decred seed as unavailable, because keys derives no Decred HD wallet", async () => {
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "decred",
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
  ])("marks unsupported $kind derivation as unavailable", async (address) => {
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "bitcoin",
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

  it("keeps invalid private keys as failures", async () => {
    const result = await verify(
      puzzle({
        ...synthetic,
        chain: "bitcoin",
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

  it("marks a derivation mismatch as a real failure", async () => {
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

    const result = await verify(new MismatchPuzzle());

    expect(result).toMatchObject({ verified: false, unavailable: false });
    expect(result.error).toContain("Verification mismatch");
  });
});

describe("recipe verification", () => {
  /** Quizchain block 74's published WIF, the MD5 entropy it came from, and its address. */
  const block74 = {
    wif: "L1myU8V1SzKbAvW51KcEaA6EvfpmffqNuTgMdmY45XpH99VyYMAm",
    entropy: "0a7c902815f9dc9d26057280592b2553",
    address: "1HbUcHKfpkUSssNtcfS3vKzdTMue3EByMQ",
  } as const;

  it("rebuilds an entropy key at the first receive address when the record holds no path", async () => {
    const result = await quizchain.verify(74);

    expect(result.verified).toBe(true);
    expect(result.recipe).toEqual({
      recipe: "bip39-entropy",
      path: "m/44'/0'/0'/0/0",
      verified: true,
      unavailable: false,
      privateKey: result.privateKey,
      derivedAddress: block74.address,
      error: null,
    });
  });

  it("verifies a puzzle through its recipe when no source printed the key", async () => {
    const result = await bitimage.verify("kitten");

    expect(result).toMatchObject({ verified: false, unavailable: true });
    expect(result.recipe).toMatchObject({
      recipe: "bip39-entropy",
      path: "m/84'/0'/0'/0/0",
      verified: true,
      derivedAddress: "bc1q57euh23y3qs2f9d5mtwpax5lqecfvrdkqce82a",
    });
  });

  it("marks an entropy seed with an unknown passphrase as unavailable", async () => {
    const result = await bitimage.verify("kitten-passphrase");

    expect(result.recipe).toMatchObject({ verified: false, unavailable: true });
    expect(result.recipe?.error).toContain("unknown passphrase");
  });

  it("reads WarpWallet off the collection's technique and leaves its scrypt to the data gate", async () => {
    const result = await warp.verify("challenge-1");

    expect(result.verified).toBe(true);
    expect(result.recipe).toMatchObject({
      recipe: "warpwallet",
      verified: false,
      unavailable: true,
    });
    expect(result.recipe?.error).toContain("256 MiB");
  });

  it("rebuilds an entropy key in the uncompressed form its WIF declares", async () => {
    const record = puzzle({
      ...synthetic,
      chain: "bitcoin",
      address: "1NoeGYFocYg2o7Tq5KKdjPwi9iUYB382G",
      key: wif("5JrAAmk3paNtF2ha5c2e4SAoChy8rYTNGxtWbcTyS3T7qAW6yaf").entropy(block74.entropy),
    });

    const result = await verify(record);

    expect(result.verified).toBe(true);
    expect(result.recipe).toMatchObject({
      verified: true,
      derivedAddress: "1NoeGYFocYg2o7Tq5KKdjPwi9iUYB382G",
    });
  });

  it("fails the recipe, not the key, when the entropy was copied wrong", async () => {
    const record = puzzle({
      ...synthetic,
      chain: "bitcoin",
      address: block74.address,
      key: wif(block74.wif).entropy(`${block74.entropy.slice(0, -1)}4`),
    });

    const result = await verify(record);

    expect(result.verified).toBe(true);
    expect(result.recipe).toMatchObject({
      recipe: "bip39-entropy",
      verified: false,
      unavailable: false,
      privateKey: null,
    });
    expect(result.recipe?.error).toContain("Verification mismatch");
  });

  it("fails a brainwallet whose passphrase misses the address", async () => {
    const record = puzzle({
      ...synthetic,
      chain: "bitcoin",
      address: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
      key: hex("0000000000000000000000000000000000000000000000000000000000000002").passphrase(
        "satoshi",
      ),
      techniques: [technique("sha256-brainwallet", "https://example.com")],
    });

    const result = await verify(record);

    expect(result).toMatchObject({ verified: false, unavailable: false });
    expect(result.recipe).toMatchObject({
      recipe: "sha256-brainwallet",
      verified: false,
      unavailable: false,
    });
    expect(result.recipe?.error).toContain("Verification mismatch");
  });

  it("holds a passphrase without a brainwallet technique to no recipe", async () => {
    const record = puzzle({
      ...synthetic,
      chain: "bitcoin",
      address: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
      key: hex("0000000000000000000000000000000000000000000000000000000000000001").passphrase(
        "satoshi",
      ),
    });

    const result = await verify(record);

    expect(result.verified).toBe(true);
    expect(result).not.toHaveProperty("recipe");
  });
});
