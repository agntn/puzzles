import { describe, expect, it, vi } from "vite-plus/test";
import {
  answer,
  assets,
  BitcoinPuzzle,
  community,
  confirmation,
  funding,
  hex,
  increase,
  official,
  p2pkh,
  puzzle,
  seed,
  standard,
} from "../../src/index.ts";
import {
  formatHintReport,
  formatPrize,
  formatPrizeTotals,
  formatPuzzleRecord,
} from "../../src/core/utils.ts";
import { facts, hintsTool, showTool, stagesTool } from "../../src/tool-operations.ts";
import { ASSETS } from "../support/assets.ts";

const ASSETS_TOOL = facts.tools.assets.name;

/*
 * MCP hands a model `content[0].text` and nothing else, so the record's own fields have to be in
 * it. Every check here is against a bundled record, so a data fix that moves one shows up.
 */
async function lines(id: string, allTransactions?: boolean): Promise<string[]> {
  return (await showTool(id, allTransactions)).content[0]?.text.split("\n") ?? [];
}

describe("puzzles_show text", () => {
  it("labels published answers separately in show and hints output", async () => {
    const published = (await lines("luckylurker/vault-1")).join("\n");
    expect(published).toContain("\tWord #1: Presence without permanence.\tsource:");
    expect(published).toContain(
      "\tanswer: visit\tanswer source: https://luckylurker.com/bitcoin-vault/",
    );
    expect(published).not.toContain("answer date:");
    const hint = official(
      "Original clue",
      "https://example.com/clue",
      confirmation("https://archive.ph/clue"),
      {
        answer: answer("Published answer", "https://example.com/answer", { date: "2026-04-01" }),
      },
    );
    const record = puzzle({
      id: "fixture/answer",
      chain: "bitcoin",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/clue",
      startedAt: "2026-01-01",
      hints: [hint],
    });
    for (const text of [formatPuzzleRecord(record), formatHintReport(record, []).join("\n")]) {
      expect(text).toContain("\tOriginal clue\tsource: https://example.com/clue");
      expect(text).toContain(
        "\tanswer: Published answer\tanswer source: https://example.com/answer\tanswer date: 2026-04-01",
      );
    }
  });
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

  it("folds a run of dust into one line and keeps the author's top ups on their own", async () => {
    const text = await lines("b1000/71");
    const start = text.indexOf("transactions: 69, 66 small increases folded") + 1;
    const rows = text.slice(start, start + 5);

    expect(start).toBeGreaterThan(0);
    expect(rows).toEqual([
      "\tfunding\t2015-01-15 18:07:14\t0.071 BTC\t08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "\tincrease\t2017-07-11 05:00:53\t0.639 BTC\t5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "\tincrease\t2023-04-16 06:29:48\t6.39 BTC\t12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "\t66 small increases\t2023-09-25 15:00:17 to 2026-09-29 22:18:51\t0.0019168 BTC",
      "collection techniques: 1",
    ]);
  });

  it("lists every transaction with its txid when asked", async () => {
    const text = await lines("b1000/71", true);

    expect(text).toContain("transactions: 69");
    expect(text.filter((line) => /^\t(funding|increase)\t/u.test(line))).toHaveLength(69);
    expect(text.join("\n")).not.toContain("small increases");
  });

  it("lists three small increases in a row, folding starts at four", () => {
    const deposits = (count: number) =>
      Array.from({ length: count }, (_, index) =>
        increase(index.toString(16).padStart(64, "0"), `2026-01-0${index + 1}`, 0.00000546),
      );
    const record = (count: number) =>
      formatPuzzleRecord(
        puzzle({
          id: "fixture/dust",
          chain: "bitcoin",
          address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
          sourceUrl: "https://example.com/dust",
          startedAt: "2026-01-01",
          transactions: [funding("f".repeat(64), "2026-01-01", 1), ...deposits(count)],
        }),
      );

    expect(record(3)).toContain("transactions: 4\n");
    expect(record(4)).toContain(
      "transactions: 5, 4 small increases folded\n\tfunding\t2026-01-01\t1 BTC\t",
    );
    expect(record(4)).toContain("\t4 small increases\t2026-01-01 to 2026-01-04\t0.00002184 BTC");
  });

  it("folds a history too long to spread into Math.max", () => {
    const flood = Array.from({ length: 200_000 }, (_, index) =>
      increase(index.toString(16).padStart(64, "0"), "2026-01-02", 0.00000546),
    );
    const text = formatPuzzleRecord(
      puzzle({
        id: "fixture/flood",
        chain: "bitcoin",
        address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
        sourceUrl: "https://example.com/flood",
        startedAt: "2026-01-01",
        transactions: [funding("f".repeat(64), "2026-01-01", 1), ...flood],
      }),
    );

    expect(text).toContain("\t200000 small increases\t2026-01-02 to 2026-01-02\t1.092 BTC");
  });

  it("prints a dust amount as a decimal, not an exponent", async () => {
    const text = (await lines("b1000/71", true)).join("\n");

    expect(text).toContain("\tincrease\t2025-05-19 18:56:09\t0.00000001 BTC\t076d820e");
    expect(text).not.toMatch(/\de-\d/u);
    expect(formatPrize(2e-7, "BTC")).toBe("0.0000002 BTC");
    expect(formatPrizeTotals({ ETH: 1.5e-18, BTC: 1064.08158961 })).toBe(
      "0.0000000000000000015 ETH, 1064.08158961 BTC",
    );
  });

  it("builds the amount formatter on the first amount, not on import", async () => {
    const NumberFormat = Intl.NumberFormat;
    let built = 0;
    Intl.NumberFormat = class extends NumberFormat {
      constructor(locales?: string, options?: Readonly<Intl.NumberFormatOptions>) {
        super(locales, options);
        built += 1;
      }
    } as typeof NumberFormat;
    vi.resetModules();
    try {
      const fresh = await import("../../src/core/utils.ts");
      await import("../../src/index.ts");
      expect(built).toBe(0);

      expect(fresh.formatPrize(1e-8, "BTC")).toBe("0.00000001 BTC");
      expect(fresh.formatPrizeTotals({ BTC: 1.5 })).toBe("1.5 BTC");
      expect(built).toBe(1);
    } finally {
      Intl.NumberFormat = NumberFormat;
      vi.resetModules();
    }
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
    expect(text).toContain("asset: assets/gsmg/puzzle.png");
    expect(text).toContain("hint assets: assets/gsmg/follow-the-white-rabbit.png");
    expect(text.some((line) => line.startsWith("solved:"))).toBe(false);
    expect(text.some((line) => line.startsWith("hints:"))).toBe(false);
  });

  it("lists every stage with its description, artifacts, copies and published answer", async () => {
    const text = await lines("gsmg");
    const choice =
      "https://gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself";
    const copy = `assets/gsmg`;
    const salphaseion =
      "https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32";
    const start = text.indexOf("stages: 7");
    const block = text.slice(start + 1).filter((line) => line.startsWith("\t"));

    expect(start).toBeGreaterThan(-1);
    expect(
      block.filter((line) => /^\t[^\t]/u.test(line)).map((line) => line.split("\t")[1]),
    ).toEqual([
      "phase 1",
      "phase 2",
      "phase 3",
      "phase 3.2.1",
      "phase 3.2.2",
      "SalPhaseIon",
      "Cosmic Duality",
    ]);
    expect(block).toContain(`\t\tpuzzle image\thttps://gsmg.io/puzzle\t${copy}/puzzle.png`);
    expect(block).toContain("\t\tthe seed is planted\thttps://gsmg.io/theseedisplanted");
    expect(block).toContain(`\t\tciphertext\t${choice}\t${copy}/phase3.txt`);
    expect(block).toContain(`\t\tciphertext\t${salphaseion}\t${copy}/cosmic-duality.txt`);
    expect(block.filter((line) => line.startsWith("\t\tanswer: "))).toHaveLength(5);
    expect(block.find((line) => line.startsWith("\t\tanswer: causality"))).toMatch(
      /\tanswer source: https:\/\/github\.com\/puzzlehunt\/.+\tanswer date: 2020-04-26$/u,
    );
  });

  it("prints no stage block for a puzzle that runs in one", async () => {
    expect((await lines("zden/litecoin-segwit")).some((line) => line.startsWith("stages:"))).toBe(
      false,
    );
  });

  it("lists every hint file a record ships on one line", async () => {
    const text = await lines("zden/litecoin-segwit");

    expect(text).toContain(
      "hint assets: assets/zden/litecoin-segwit/hint-1.svg, assets/zden/litecoin-segwit/hint-2.svg, assets/zden/litecoin-segwit/hint-3.svg",
    );
    expect(text.some((line) => line.startsWith("hints:"))).toBe(false);
  });

  it("prints every hint with its kind, its source and what confirms it", async () => {
    const text = await lines("warp/warp-challenge-2");

    expect(text).toContain("hints: 1");
    expect(text).toContain(
      "\tofficial\t-\tthis passphrase is 8 characters long, only alphanumerics. For example, 'b234FEzz'. the salt is a@b.c\tsource: https://keybase.io/warp\tconfirmation: https://web.archive.org/web/20160305003531/https://keybase.io/warp/warp_1.0.8_SHA256_5111a723fe008dbf628237023e6f2de72c7953f8bb4265d5c16fc9fd79384b7a.html (Wayback capture of the challenge page)",
    );
  });

  it("prints hints without confirmations and keeps their dates and answers", () => {
    const shared = official("Start at the top.", "https://example.com/rules");
    const record = puzzle({
      id: "fixture/hinted",
      chain: "bitcoin",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      hints: [
        community("The top is a decoy.", "https://example.com/thread", undefined, {
          date: "2026-01-03",
          answer: answer("Start below.", "https://example.com/answer"),
        }),
      ],
    });
    const expected = [
      "collection hints: 1",
      "\tofficial\t-\tStart at the top.\tsource: https://example.com/rules",
      "hints: 1",
      "\tcommunity\t2026-01-03\tThe top is a decoy.\tsource: https://example.com/thread\tanswer: Start below.\tanswer source: https://example.com/answer",
    ];
    expect(formatHintReport(record, [shared])).toEqual(["fixture/hinted: 2 hints", ...expected]);
    const text = formatPuzzleRecord(record, [shared]);
    expect(text).toContain(expected.join("\n"));
    expect(text).not.toContain("confirmation:");
  });

  it("dates a hint and leaves out a confirmation note it does not have", () => {
    const record = puzzle({
      id: "fixture/hinted",
      chain: "bitcoin",
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
    const text = formatPuzzleRecord(record).split("\n");

    expect(text).toContain("hints: 1");
    expect(text).toContain(
      "\tcommunity\t2026-01-03 12:00:00\tThe top is a decoy.\tsource: https://example.com/thread\tconfirmation: https://archive.ph/thread",
    );
    expect(text.some((line) => line.startsWith("collection hints:"))).toBe(false);
  });

  it("prints the hints a collection shares under their own label", () => {
    const record = puzzle({
      id: "fixture/plain",
      chain: "bitcoin",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
    });
    const shared = official(
      "Start at the top.",
      "https://example.com/puzzle",
      confirmation("https://web.archive.org/web/2026/https://example.com/puzzle"),
    );
    const text = formatPuzzleRecord(record, [shared]).split("\n");

    expect(text).toContain("collection hints: 1");
    expect(text.some((line) => line.startsWith("hints:"))).toBe(false);
    expect(text.indexOf("collection hints: 1")).toBeLessThan(
      text.findIndex((line) => line.startsWith("explorer:")),
    );
  });

  it("names the solution of a puzzle that ships no image", async () => {
    const text = await lines("movie-enigma");

    expect(text).toContain("solution asset: assets/movie-enigma/solution.md");
    expect(text.some((line) => line.startsWith("asset:"))).toBe(false);
  });

  it("names the solution image next to the puzzle image", async () => {
    const text = await lines("zden/level-1");

    expect(text).toContain("asset: assets/zden/level-1/puzzle.png");
    expect(text).toContain("solution asset: assets/zden/level-1/solver.png");
  });

  it("sends a model to puzzles_assets instead of a download link", async () => {
    const answers = await Promise.all([
      showTool("gsmg"),
      stagesTool("gsmg"),
      hintsTool("gsmg"),
      hintsTool("quizchain2/34"),
    ]);
    const texts = answers.map((answer) => answer.content[0]?.text ?? "");

    for (const text of texts) {
      expect(text).not.toContain(ASSETS);
    }
    expect(texts.slice(0, 3).map((text) => text.split("\n").at(-1))).toEqual(
      Array.from(
        { length: 3 },
        () =>
          `files: 6 files, 0 archived sources; ${ASSETS_TOOL} lists them and reads one by its path`,
      ),
    );
    expect(texts[3]?.split("\n").at(-1)).toBe(
      `files: 0 files, 3 archived sources; ${ASSETS_TOOL} lists them and reads one by its path`,
    );
    for (const answer of [
      await hintsTool("ballet/AA007448"),
      await stagesTool("ballet/AA007448"),
    ]) {
      const text = answer.content[0]?.text.split("\n") ?? [];
      expect(text).toHaveLength(2);
      expect(text[1]).toBe(
        `files: 1 file, 1 archived source; ${ASSETS_TOOL} lists them and reads one by its path`,
      );
    }
    expect((await lines("b1000/71")).some((line) => line.startsWith("files:"))).toBe(false);
    expect((await stagesTool("b1000/71")).content[0]?.text).toBe("b1000/71: no stages recorded");
    expect(facts.tools.show.promptSnippet).toContain(ASSETS_TOOL);
  });

  it("prints every key representation a record carries", async () => {
    const ballet = await lines("ballet/AA007448");
    const bitaps = await lines("bitaps");
    const movieEnigma = await lines("movie-enigma");

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
    const record = puzzle({
      id: "fixture/seed",
      chain: "bitcoin",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      key: seed("abandon abandon about", "m/0").wif(
        "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn",
      ),
    });
    const text = formatPuzzleRecord(record).split("\n");

    expect(text).toContain(
      "private key: KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn (wif)",
    );
    expect(text).toContain("seed phrase: abandon abandon about");
    expect(text).toContain("derivation path: m/0");
  });

  it("says when the record derived the private key instead of quoting it", () => {
    const record = puzzle({
      id: "fixture/derived",
      chain: "bitcoin",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      key: hex("1".padStart(64, "0")).derived(),
    });

    expect(record.hasDerivedKey()).toBe(true);
    expect(formatPuzzleRecord(record).split("\n")).toContain(
      `private key: ${"1".padStart(64, "0")} (hex, derived from the published recipe)`,
    );
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

describe("puzzles_hints text", () => {
  it("counts the hints and the hint files apart and prints the files last", () => {
    const shared = official(
      "Start at the top.",
      "https://example.com/puzzle",
      confirmation("https://web.archive.org/web/2026/https://example.com/puzzle"),
    );
    const record = puzzle({
      id: "fixture/both",
      chain: "bitcoin",
      address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"),
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
      assets: assets({ puzzle: "both.png", hints: ["hint-1.png", "hint-2.svg"] }),
      hints: [
        community(
          "The top is a decoy.",
          "https://example.com/thread",
          confirmation("https://archive.ph/thread"),
        ),
      ],
    });

    expect(formatHintReport(record, [shared])).toEqual([
      "fixture/both: 2 hints, 2 hint assets",
      "collection hints: 1",
      "\tofficial\t-\tStart at the top.\tsource: https://example.com/puzzle\tconfirmation: https://web.archive.org/web/2026/https://example.com/puzzle",
      "hints: 1",
      "\tcommunity\t-\tThe top is a decoy.\tsource: https://example.com/thread\tconfirmation: https://archive.ph/thread",
      `hint assets: ${ASSETS}/assets/fixture/hint-1.png, ${ASSETS}/assets/fixture/hint-2.svg`,
    ]);
  });

  it("prints the escrow under the target and serializes it next to the address", () => {
    const escrow = standard("0x0000000000000000000000000000000000000001");
    const record = puzzle({
      id: "fixture/escrowed",
      chain: "ethereum",
      address: standard("0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf"),
      escrow,
      sourceUrl: "https://example.com/puzzle",
      startedAt: "2026-01-01",
    });

    expect(formatPuzzleRecord(record).split("\n").slice(1, 3)).toEqual([
      "chain: ethereum  address kind: standard",
      "escrow: 0x0000000000000000000000000000000000000001",
    ]);
    expect(record.toJSON().escrow).toEqual(escrow);
  });
});
