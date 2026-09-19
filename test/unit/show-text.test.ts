import { describe, expect, it } from "vitest";
import {
  BitcoinPuzzle,
  bitcoinPuzzle,
  community,
  confirmation,
  official,
  p2pkh,
  seed,
} from "../../src/index.ts";
import { formatPuzzleRecord } from "../../src/core/utils.ts";
import { showTool } from "../../src/tool-operations.ts";

/*
 * MCP hands a model `content[0].text` and nothing else, so the record's own fields have to be in
 * it. Every check here is against a bundled record, so a data fix that moves one shows up.
 */
async function lines(id: string): Promise<string[]> {
  return (await showTool(id)).content[0]?.text.split("\n") ?? [];
}

describe("puzzles_show text", () => {
  it("prints the key, the solve and every transaction of a solved puzzle", async () => {
    const text = await lines("b1000/1");

    expect(text).toContain("hash160: 751e76e8199196d454941c45d1b3a323f1433bd6");
    expect(text).toContain(
      "private key: 0000000000000000000000000000000000000000000000000000000000000001 (hex)",
    );
    expect(text).toContain("wif: KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn");
    expect(text).toContain("solved: 2013-01-10 02:54:44 (14h 55m)");
    expect(text).toContain("transactions: 2");
    expect(text.filter((line) => /^\t(funding|claim)\t/u.test(line))).toHaveLength(2);
    expect(text.some((line) => line.startsWith("claim: https://blockstream.info/tx/"))).toBe(true);
    expect(text).toContain("key range: 1..1 (hex, 1 bit)");
  });

  it("prints the hint every b1000 record inherits from its author", async () => {
    const text = await lines("b1000/71");

    expect(text).toContain("collection hints: 1");
    expect(text).toContain(
      "\tofficial\t2017-04-27 06:41:08\tThere is no pattern. It is just consecutive keys from a deterministic wallet (masked with leading 000...0001 to set difficulty).\tsource: https://bitcointalk.org/index.php?topic=1306983.msg18765941#msg18765941\tconfirmation: https://web.archive.org/web/20200509045914/https://bitcointalk.org/index.php?topic=1306983.msg18765941 (Wayback capture of the thread page)",
    );
    expect(text.some((line) => line.startsWith("hints:"))).toBe(false);
  });

  it("says what it doesn't know and lists the assets", async () => {
    const text = await lines("gsmg");

    expect(text).toContain("private key: unknown");
    expect(text).toContain(
      "asset: https://raw.githubusercontent.com/agntn/puzzles/main/assets/gsmg/puzzle.png",
    );
    expect(text).toContain(
      "hint assets: https://raw.githubusercontent.com/agntn/puzzles/main/assets/gsmg/follow_the_white_rabbit.png",
    );
    expect(text.some((line) => line.startsWith("solved:"))).toBe(false);
    expect(text.some((line) => line.startsWith("hints:"))).toBe(false);
  });

  it("prints every hint with its kind, its source and what confirms it", async () => {
    const text = await lines("warp/warp_challenge_2");

    expect(text).toContain("hints: 1");
    expect(text).toContain(
      "\tofficial\t-\tthis passphrase is 8 characters long, only alphanumerics. For example, 'b234FEzz'. the salt is a@b.c\tsource: https://keybase.io/warp\tconfirmation: https://web.archive.org/web/20160305003531/https://keybase.io/warp/warp_1.0.8_SHA256_5111a723fe008dbf628237023e6f2de72c7953f8bb4265d5c16fc9fd79384b7a.html (Wayback capture of the challenge page)",
    );
  });

  it("dates a hint and leaves out a confirmation note it does not have", () => {
    const puzzle = bitcoinPuzzle({
      id: "fixture/hinted",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      hints: [
        community(
          "The top is a decoy.",
          "https://example.com/thread",
          confirmation("https://archive.ph/thread"),
          { date: "2026-01-03 12:00:00" },
        ),
      ],
    });
    const text = formatPuzzleRecord(puzzle).split("\n");

    expect(text).toContain("hints: 1");
    expect(text).toContain(
      "\tcommunity\t2026-01-03 12:00:00\tThe top is a decoy.\tsource: https://example.com/thread\tconfirmation: https://archive.ph/thread",
    );
    expect(text.some((line) => line.startsWith("collection hints:"))).toBe(false);
  });

  it("prints the hints a collection shares under their own label", () => {
    const puzzle = bitcoinPuzzle({
      id: "fixture/plain",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
    });
    const shared = official(
      "Start at the top.",
      "https://example.com/puzzle",
      confirmation("https://web.archive.org/web/2026/https://example.com/puzzle"),
    );
    const text = formatPuzzleRecord(puzzle, [shared]).split("\n");

    expect(text).toContain("collection hints: 1");
    expect(text.some((line) => line.startsWith("hints:"))).toBe(false);
    expect(text.indexOf("collection hints: 1")).toBeLessThan(
      text.findIndex((line) => line.startsWith("explorer:")),
    );
  });

  it("links the solver's notes of a puzzle that ships no image", async () => {
    const text = await lines("movie_enigma");

    expect(text).toContain(
      "solver asset: https://raw.githubusercontent.com/agntn/puzzles/main/assets/movie_enigma/solution.md",
    );
    expect(text.some((line) => line.startsWith("asset:"))).toBe(false);
  });

  it("prints every key representation a record carries", async () => {
    const ballet = await lines("ballet/AA007448");
    const bitaps = await lines("bitaps");
    const movieEnigma = await lines("movie_enigma");

    expect(ballet).toContain(
      "encrypted wif: 6PnWfKaBfDW6mFFhhFsbNRHnVgojUhdf2b5NXP3FfwXiQ69MxEzVK2J4cH (bip38)",
    );
    expect(ballet).toContain("passphrase: 335Y-K745-C8WT-4D2W-80WP");
    expect(bitaps).toContain("derivation path: m/84'/0'/0'/0/0");
    expect(bitaps.some((line) => line.startsWith("xpub: zpub"))).toBe(true);
    expect(bitaps.some((line) => line.startsWith("shares: 2 of 5 published, 3 needed:"))).toBe(
      true,
    );
    expect(movieEnigma.some((line) => line.startsWith("private key: path mad alien"))).toBe(true);
    expect(movieEnigma.some((line) => line.endsWith("ghost shine (seed phrase)"))).toBe(true);
    expect(movieEnigma).toContain("derivation path: m/84'/0'/0'/0/0");
  });

  it("keeps the seed phrase when a WIF outranks it", () => {
    const puzzle = bitcoinPuzzle({
      id: "fixture/seed",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      key: seed("abandon abandon about", "m/0").wif(
        "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn",
      ),
    });
    const text = formatPuzzleRecord(puzzle).split("\n");

    expect(text).toContain(
      "private key: KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn (wif)",
    );
    expect(text).toContain("seed phrase: abandon abandon about");
    expect(text).toContain("derivation path: m/0");
  });

  it("prints a range a handwritten puzzle computes without declaring bits", () => {
    class Ranged extends BitcoinPuzzle {
      override id(): string {
        return "fixture/ranged";
      }

      override address() {
        return p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH");
      }

      override sourceUrl(): string {
        return "https://example.com/puzzle";
      }

      override startedAt(): string {
        return "2026-01-01";
      }

      override keyRange(): readonly [bigint, bigint] {
        return [10n, 20n];
      }
    }

    expect(formatPuzzleRecord(new Ranged()).split("\n")).toContain("key range: a..14 (hex)");
  });
});
