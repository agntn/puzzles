import { describe, expect, it } from "vitest";
import { b1000 } from "../../src/collections/b1000.ts";
import { ballet } from "../../src/collections/ballet.ts";
import { bitaps } from "../../src/collections/bitaps.ts";
import { bitimage } from "../../src/collections/bitimage.ts";
import {
  BitcoinPuzzle,
  hex,
  p2pkh,
  verifyPuzzle,
  type Address,
  type Key,
} from "../../src/index.ts";

describe("Collection.verify", () => {
  it("verifies a known direct private key", async () => {
    const result = await b1000.verify(1);

    expect(result.verified).toBe(true);
    expect(result.derivedAddress).toBe("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
  });

  it("verifies a known decrypted WIF", async () => {
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
