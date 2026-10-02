import { execFile } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vite-plus/test";
import { collectionKeys } from "../../src/core/registry.ts";
import { ASSETS } from "../support/assets.ts";

const execute = promisify(execFile);

async function puzzles(...args: readonly string[]): Promise<string> {
  const { stdout } = await execute(process.execPath, ["src/cli.ts", ...args], {
    cwd: process.cwd(),
  });
  return stdout.trim();
}

/* The CLI prints JSON it built itself, so the tests trust its shape and only check the values. */
async function json<T>(...args: readonly string[]): Promise<T> {
  return JSON.parse(await puzzles(...args)) as T;
}

interface Failure {
  readonly code: number;
  readonly stderr: string;
  readonly stdout: string;
}

/*
 * A failed command rejects with its streams attached, so the test reads what a script would see.
 * The child has no fetch stub, so none of its commands may reach a balance lookup.
 */
async function failure(...args: readonly string[]): Promise<Failure> {
  try {
    await execute(process.execPath, ["src/cli.ts", ...args], { cwd: process.cwd() });
  } catch (error) {
    const { code, stderr, stdout } = error as Failure;
    return { code, stderr, stdout };
  }
  throw new Error(`puzzles ${args.join(" ")} exited 0`);
}

/*
 * Runs the CLI with `test/support/fetch-stub.ts` in place of the network, so a balance pass is read
 * the way a script reads it: both streams and the exit code, whether it failed or not. The
 * Etherscan key is blanked, so Ethereum asks Blockscout whatever the shell holds.
 */
async function stubbed(failing: string, ...args: readonly string[]): Promise<Failure> {
  try {
    const { stderr, stdout } = await execute(
      process.execPath,
      ["--import", "./test/support/fetch-stub.ts", "src/cli.ts", ...args],
      {
        cwd: process.cwd(),
        env: { ...process.env, ETHERSCAN_API_KEY: "", PUZZLES_FETCH_FAIL: failing },
      },
    );
    return { code: 0, stderr, stdout };
  } catch (error) {
    const { code, stderr, stdout } = error as Failure;
    return { code, stderr, stdout };
  }
}

describe.concurrent("puzzles CLI", () => {
  it("prints machine-readable statistics", async () => {
    const result = await json<{ readonly total: number; readonly unsolved: number }>(
      "stats",
      "--json",
    );

    expect(result.total).toBe(479);
    expect(result.unsolved).toBe(105);
  });

  it("shows a puzzle by universal identifier", async () => {
    const result = await json<{ readonly id: string; readonly status: string }>(
      "show",
      "b1000/1",
      "--json",
    );

    expect(result).toMatchObject({ id: "b1000/1", status: "solved" });
  });

  it("prints the whole record of a puzzle as the tool does", async () => {
    const { showTool } = await import("../../src/tool-operations.ts");
    const derived = await puzzles("show", "quizchain/6");
    const inherited = await puzzles("show", "b1000/71");

    expect(derived.trimEnd()).toBe((await showTool("quizchain/6")).content[0]?.text);
    expect(derived).toContain("(wif, derived from the published recipe)");
    expect(inherited.trimEnd()).toBe((await showTool("b1000/71")).content[0]?.text);
    expect(inherited).toContain("collection hints: 1");
  });

  it("prints the stages of a puzzle as the tool does", async () => {
    const { stagesTool } = await import("../../src/tool-operations.ts");
    const output = await puzzles("stages", "gsmg");
    const staged = await json<{ readonly stages: readonly { readonly name: string }[] }>(
      "stages",
      "gsmg",
      "--json",
    );

    expect(output.trimEnd()).toBe((await stagesTool("gsmg")).content[0]?.text);
    expect(staged.stages.map((stage) => stage.name)).toEqual([
      "phase 1",
      "phase 2",
      "phase 3",
      "phase 3.2.1",
      "phase 3.2.2",
      "SalPhaseIon",
      "Cosmic Duality",
    ]);
    expect((await puzzles("stages", "b1000/71")).trim()).toBe("b1000/71: no stages recorded");
  });

  it("lists the files a puzzle ships with the digests the record pins", async () => {
    const { get } = await import("../../src/core/dataset.ts");
    const listed = await json<{ readonly assets: readonly { readonly sha256: string }[] }>(
      "assets",
      "gsmg",
      "--json",
    );

    const image = (await get("gsmg"))?.assetLinks()[0];

    expect((await puzzles("assets", "gsmg")).split("\n")[0]).toBe(
      `puzzle\tpuzzle.png\t29931\t38125bbdf1ea58b9b30b075bc6bf71e4089d04bba37098317e47097e2f2a1830\t${image?.url}`,
    );
    expect(listed.assets).toEqual((await get("gsmg"))?.assetLinks());
    expect(await puzzles("assets", "b1000/71")).toBe("b1000/71: no assets recorded");
  });

  it("checks the repository's own copies and exits 0 when every file matches", async () => {
    /* execFile rejects on a non-zero exit, so resolving proves the check passed. */
    const output = await puzzles("assets", "zden/level-1", "--check", "assets/zden");

    expect(output.split("\n").map((line) => line.split("\t")[0])).toEqual(["MATCH", "MATCH"]);
  });

  it("reports a changed or missing local copy and exits 1", async () => {
    const directory = mkdtempSync(join(tmpdir(), "puzzles-assets-"));
    try {
      copyFileSync("assets/gsmg/puzzle.png", join(directory, "puzzle.png"));
      writeFileSync(join(directory, "phase2.txt"), "not the page\n");
      const result = await failure("assets", "gsmg", "--check", directory, "--json");
      const checked = JSON.parse(result.stdout) as {
        readonly assets: readonly {
          readonly actual?: { readonly bytes: number };
          readonly file: string;
          readonly status: string;
        }[];
      };

      expect(result.code).toBe(1);
      expect(checked.assets.map(({ file, status }) => `${status} ${file}`)).toEqual([
        "MATCH puzzle.png",
        "MISSING follow-the-white-rabbit.png",
        "MISMATCH phase2.txt",
        "MISSING phase3.txt",
        "MISSING salphaseion.txt",
        "MISSING cosmic-duality.txt",
      ]);
      expect(checked.assets.map((asset) => asset.actual?.bytes)).toEqual([
        undefined,
        undefined,
        13,
        undefined,
        undefined,
        undefined,
      ]);
    } finally {
      rmSync(directory, { recursive: true });
    }
  });

  it("fetches each file from the author's URL with --live and keeps a failed fetch apart", async () => {
    const live = async (reply: string, ...extra: readonly string[]): Promise<Failure> => {
      try {
        const { stderr, stdout } = await execute(
          process.execPath,
          [
            "--import",
            "./test/support/asset-fetch-stub.ts",
            "src/cli.ts",
            "assets",
            "zden/level-4",
            "--live",
            ...extra,
          ],
          { cwd: process.cwd(), env: { ...process.env, PUZZLES_ASSET_REPLY: reply } },
        );
        return { code: 0, stderr, stdout };
      } catch (error) {
        const { code, stderr, stdout } = error as Failure;
        return { code, stderr, stdout };
      }
    };
    const statuses = (result: Failure): string[] =>
      result.stdout
        .trim()
        .split("\n")
        .map((line) => line.split("\t").slice(0, 2).join(" "));

    const same = await live("file:assets/zden/level-4/puzzle.png");
    const changed = await live("file:assets/zden/level-4/solution.md", "--json");
    const gone = await live("status:404");
    const down = await live("error");

    expect(same.stderr).toBe("fetch https://crypto.haluska.sk/crypto4.png\n");
    expect([same.code, ...statuses(same)]).toEqual([0, "MATCH puzzle", "NO_ORIGIN solution"]);
    expect(changed.code).toBe(1);
    expect(
      (JSON.parse(changed.stdout) as { readonly assets: readonly { readonly actual?: unknown }[] })
        .assets[0]?.actual,
    ).toEqual({
      sha256: "5cdb68b30249f057ecc71a4858200a6f15580846407daa6422b089cd9676c447",
      bytes: 916,
    });
    expect([gone.code, ...statuses(gone)]).toEqual([0, "UNREACHABLE puzzle", "NO_ORIGIN solution"]);
    expect(gone.stdout).toContain("HTTP 404");
    expect(down.stdout).toContain("fetch failed");
  });

  it("refuses --check together with --live", async () => {
    const result = await failure("assets", "gsmg", "--check", "assets/gsmg", "--live");

    expect(result.code).toBe(1);
    expect(result.stderr.trim()).toBe("Invalid check: pass either --check or --live, not both");
  });

  it("prints the hints that hold for a puzzle as the tool does", async () => {
    const output = await puzzles("hints", "warp/challenge-1");

    expect(output.split("\n")).toEqual([
      "warp/challenge-1: 1 hint",
      "hints: 1",
      "\tofficial\t-\tthis passphrase is 2 random alphanumeric characters, such as 'X9'.\tsource: https://keybase.io/warp\tconfirmation: https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html (Wayback capture of the challenge page)",
    ]);
  });

  it("dates a hint the author tweeted and names the page that links it", async () => {
    const output = await puzzles("hints", "zden/demobit-2018");

    expect(output.split("\n")).toEqual([
      "zden/demobit-2018: 1 hint",
      "hints: 1",
      "\tofficial\t2018-02-21 11:38:21\tHint #1 for the unsolved Demobit puzzle is the hash of inner data block with lines overlap. It is not the hash of the private key! SHA-256: 1c10494cf872ac2b896f52b2c93f58c23049f5be9455fef3ed4f9d9bf84fe600\tsource: https://twitter.com/Zd3N/status/966275899757879298\tconfirmation: https://web.archive.org/web/20180316114954/http://crypto.haluska.sk/ (Wayback capture of the puzzle page, which links Hint #1 to this tweet)",
    ]);
  });

  it("hands a script the collection's hint, which the record alone leaves out", async () => {
    const record = await json<{ readonly hints?: readonly unknown[] }>(
      "show",
      "b1000/71",
      "--json",
    );
    const hints = await json<Record<string, unknown>>("hints", "b1000/71", "--json");

    expect(record.hints).toBeUndefined();
    expect(hints).toEqual({
      hints: [
        {
          kind: "official",
          date: "2017-04-27 06:41:08",
          text: "There is no pattern. It is just consecutive keys from a deterministic wallet (masked with leading 000...0001 to set difficulty).",
          source: "https://bitcointalk.org/index.php?topic=1306983.msg18765941#msg18765941",
          confirmation: {
            url: "https://web.archive.org/web/20200509045914/https://bitcointalk.org/index.php?topic=1306983.msg18765941",
            description: "Wayback capture of the thread page",
          },
        },
      ],
      hintAssets: [],
    });
  });

  it("prints the comment in the Janus hint SVG, then the file", async () => {
    const output = await puzzles("hints", "zden/decred-janus");
    const hints = await json<Record<string, unknown>>("hints", "zden/decred-janus", "--json");

    expect(output.split("\n")).toEqual([
      "zden/decred-janus: 1 hint, 1 hint asset",
      "hints: 1",
      "\tofficial\t-\t33*bbb\tsource: https://crypto.haluska.sk/decred_tree_hint.svg\tconfirmation: https://web.archive.org/web/20181219152809/http://crypto.haluska.sk/decred_tree_hint.svg (Wayback capture of the hint SVG)",
      `hint assets: ${ASSETS}/assets/zden/decred-janus/hint.svg`,
    ]);
    expect(hints).toEqual({
      hints: [
        {
          kind: "official",
          text: "33*bbb",
          source: "https://crypto.haluska.sk/decred_tree_hint.svg",
          confirmation: {
            url: "https://web.archive.org/web/20181219152809/http://crypto.haluska.sk/decred_tree_hint.svg",
            description: "Wayback capture of the hint SVG",
          },
        },
      ],
      hintAssets: [
        {
          kind: "hint",
          file: "decred-janus/hint.svg",
          path: "assets/zden/decred-janus/hint.svg",
          url: `${ASSETS}/assets/zden/decred-janus/hint.svg`,
          sha256: "3f518b69e8c447565a8560edb87855d0a186ecc5f99b8c5811f366e51c81efc1",
          bytes: 22761,
          origin: "https://crypto.haluska.sk/decred_tree_hint.svg",
          archive:
            "https://web.archive.org/web/20181219152809id_/http://crypto.haluska.sk/decred_tree_hint.svg",
        },
      ],
    });
  });

  it("does not treat the 1bitcoin 777 sat notarization as the claim", async () => {
    const record = await json<{
      readonly solve_date?: string;
      readonly solve_time?: number;
      readonly transactions?: readonly {
        readonly tx_type: string;
        readonly txid: string;
        readonly date: string;
        readonly amount: number;
      }[];
    }>("show", "zden/1bitcoin-white-paper", "--json");

    expect(record.solve_date).toBe("2021-05-19 18:42:33");
    expect(record.solve_time).toBe(3344162);
    expect(record.transactions).toEqual([
      {
        tx_type: "funding",
        txid: "063a1913256940e72237419cada939694f4f361d6a1bd2461c5b8387d1b77cb3",
        date: "2021-04-11 01:46:31",
        amount: 0.00117578,
      },
      {
        tx_type: "decrease",
        txid: "252f49ac38fd858d74baea65e98e44b882d98e794e91426dcc91e62f80d33b56",
        date: "2021-05-15 05:35:18",
        amount: 0.00000777,
      },
      {
        tx_type: "increase",
        txid: "40138a9fbdbd160df3538efc6a574b7dfc1a98426c3e6046cda0a5892bf17cf6",
        date: "2021-05-15 23:54:05",
        amount: 0.00661489,
      },
      {
        tx_type: "claim",
        txid: "40b500597aa1d6904db01d36945871a55c5b3a400c4218992d3fbe901cd414b3",
        date: "2021-05-19 18:42:33",
        amount: 0.00732196,
      },
    ]);
  });

  it("quotes the 1bitcoin notarization sentence the author published", async () => {
    const output = await puzzles("hints", "zden/1bitcoin-white-paper");
    const hints = await json<Record<string, unknown>>(
      "hints",
      "zden/1bitcoin-white-paper",
      "--json",
    );

    expect(output.split("\n")).toEqual([
      "zden/1bitcoin-white-paper: 1 hint",
      "hints: 1",
      "\tofficial\t-\tArtwork is also notarized on the Bitcoin blockchain by a transaction of 777 Satoshis from the puzzle's address. The SHA-256 fingerprint from this image creates the private key of the notarization wallet.\tsource: https://crypto.haluska.sk/\tconfirmation: https://web.archive.org/web/20210729030148/https://crypto.haluska.sk/ (Wayback capture of the puzzle page)",
    ]);
    expect(hints).toEqual({
      hints: [
        {
          kind: "official",
          text: "Artwork is also notarized on the Bitcoin blockchain by a transaction of 777 Satoshis from the puzzle's address. The SHA-256 fingerprint from this image creates the private key of the notarization wallet.",
          source: "https://crypto.haluska.sk/",
          confirmation: {
            url: "https://web.archive.org/web/20210729030148/https://crypto.haluska.sk/",
            description: "Wayback capture of the puzzle page",
          },
        },
      ],
      hintAssets: [],
    });
  });

  it("lists the hint files a record ships, in text and in JSON", async () => {
    const output = await puzzles("hints", "gsmg");
    const hints = await json<Record<string, unknown>>("hints", "gsmg", "--json");

    expect(output.split("\n")).toEqual([
      "gsmg: 1 hint asset",
      `hint assets: ${ASSETS}/assets/gsmg/follow-the-white-rabbit.png`,
    ]);
    expect(hints).toEqual({
      hints: [],
      hintAssets: [
        {
          kind: "hint",
          file: "follow-the-white-rabbit.png",
          path: "assets/gsmg/follow-the-white-rabbit.png",
          url: `${ASSETS}/assets/gsmg/follow-the-white-rabbit.png`,
          sha256: "5e8d84b88f8f829428df5d2a8bf36c7268346f169b799ac7570b6223990d204f",
          bytes: 1958,
          origin: "https://gsmg.io/img/follow_the_white_rabbit.png",
          archive:
            "https://web.archive.org/web/20201115074715id_/https://gsmg.io/img/follow_the_white_rabbit.png",
        },
      ],
    });
  });

  it("says so when a puzzle has no hints and exits 0", async () => {
    await expect(puzzles("hints", "arweave/weave1")).resolves.toBe(
      "arweave/weave1: no hints recorded",
    );
  });

  it("exits 1 on an unknown puzzle like show does", async () => {
    const result = await failure("hints", "nope/1");

    expect(result.code).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(
      /^Puzzle not found: nope\/1\. Known collections: 80-bit, arweave, /u,
    );
  });

  it("lists a single collection filtered by status", async () => {
    const result = await json<readonly { readonly id: string; readonly status: string }[]>(
      "list",
      "zden",
      "--status",
      "solved",
      "--json",
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((puzzle) => puzzle.status === "solved")).toBe(true);
    expect(result.every((puzzle) => puzzle.id.startsWith("zden/"))).toBe(true);
  });

  it("lists the puzzles of one chain, wherever their collection puts them", async () => {
    const result = await json<readonly { readonly id: string; readonly chain: string }[]>(
      "list",
      "--chain",
      "ethereum",
      "--json",
    );

    expect(result.every((puzzle) => puzzle.chain === "ethereum")).toBe(true);
    expect(result.map((puzzle) => puzzle.id)).toEqual([
      "arweave/weave7",
      "arweave/weave9",
      "arweave/weave11",
      "arweave/weave13",
      "doges-gambit/eth",
      "mineshop",
      "teikhos/0",
      "teikhos/1",
      "teikhos/2",
      "teikhos/3",
      "teikhos/4",
      "zden/xixoio",
      "zden/codex-protocol",
    ]);
  });

  it("takes a chain by symbol and narrows it further by status", async () => {
    const result = await json<readonly { readonly id: string; readonly status: string }[]>(
      "list",
      "--chain",
      "BTC",
      "--status",
      "expired",
      "--json",
    );

    expect(result.map((puzzle) => puzzle.id)).toEqual([
      "book-quiz",
      "warp/warp-challenge-1",
      "warp/warp-challenge-2",
    ]);
  });

  it("names the supported chains when the filter is not one", async () => {
    await expect(failure("list", "--chain", "solana")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr:
        "Invalid chain: expected one of arweave, base, bitcoin, bitcoincash, decred, dogecoin, ecash, ethereum, litecoin, monero\n",
    });
  });

  it("names the puzzle an address belongs to, in the case the chain fixes", async () => {
    const base58 = await json<readonly { readonly id: string }[]>(
      "list",
      "--address",
      "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
      "--json",
    );
    const checksummed = await json<readonly { readonly id: string }[]>(
      "list",
      "--address",
      "0x5D663791E869Ca70C71E0A5F4cfD707f596265aa",
      "--json",
    );

    expect(base58.map((puzzle) => puzzle.id)).toEqual(["b1000/1"]);
    expect(checksummed.map((puzzle) => puzzle.id)).toEqual(["zden/xixoio"]);
  });

  it("pages a long collection the way the list tool pages it", async () => {
    const page = await puzzles("list", "b1000", "--limit", "2", "--offset", "70");
    const records = await json<readonly { readonly id: string }[]>(
      "list",
      "b1000",
      "--limit",
      "2",
      "--offset",
      "70",
      "--json",
    );

    expect(page.split("\n").map((line) => line.split("\t")[0])).toEqual(["b1000/71", "b1000/72"]);
    expect(records.map((puzzle) => puzzle.id)).toEqual(["b1000/71", "b1000/72"]);
  });

  it("keeps every match when neither flag is given, and ends cleanly past the last one", async () => {
    const all = await puzzles("list", "b1000");
    const past = await puzzles("list", "gsmg", "--offset", "9999");

    expect(all.split("\n")).toHaveLength(256);
    expect(past).toBe("");
  });

  it.each([
    ["--limit", "0", "Invalid limit: expected an integer of 1 or more"],
    ["--limit", "two", "Invalid limit: expected an integer of 1 or more"],
    ["--limit", "1.5", "Invalid limit: expected an integer of 1 or more"],
    ["--offset", "-1", "Invalid offset: expected an integer of 0 or more"],
  ])("refuses %s %s instead of paging by NaN", async (flag, value, message) => {
    await expect(failure("list", "b1000", flag, value)).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: `${message}\n`,
    });
  });

  it("prints nothing for an address outside the dataset", async () => {
    const result = await puzzles("list", "--address", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");

    expect(result).toBe("");
  });

  it("lists every registered collection", async () => {
    const result = await json<readonly { readonly key: string; readonly total: number }[]>(
      "collections",
      "--json",
    );

    expect(result).toHaveLength(36);
    expect(result.map((entry) => entry.key)).toContain("hash-collision");
  });

  it("lists authors and shows one, by author key or collection key", async () => {
    const rows = (await puzzles("authors")).split("\n");
    expect(rows).toHaveLength(33);
    expect(rows).toContain("zden: Zden (person), 1 collection: zden, 16 puzzles");

    const record = (await puzzles("authors", "warp")).split("\n");
    expect(record[0]).toBe("keybase\tKeybase\torganization");
    expect(record).toContain("collections: warp (6 puzzles)");
    expect(rows).toContain("gsmg: GSMG.io (organization), 1 collection: gsmg, 1 puzzle");
    expect((await puzzles("authors", "gsmg")).split("\n")).toContain(
      "collections: gsmg (1 puzzle)",
    );

    const entry = await json<{ readonly key: string; readonly puzzles: number }>(
      "authors",
      "peter-todd",
      "--json",
    );
    expect(entry).toMatchObject({ key: "peter-todd", puzzles: 6 });

    const missing = await failure("authors", "nobody");
    expect(missing.code).toBe(1);
    expect(missing.stderr).toMatch(/^Unknown author: nobody\. Known authors: ktimesg, tiamat, /u);
  });

  it("lists solvers and shows one, by solver key or puzzle identifier", async () => {
    const rows = (await puzzles("solvers")).split("\n");
    expect(rows).toContain(
      "retired-coder: RetiredCoder (person), 4 solves: b1000/120, b1000/125, b1000/130, b1000/135, author of mini",
    );
    expect(rows).toContain(
      "wickex: Wickex (person), 1 solve: iamabananaamaa/gif, author of wickex",
    );

    const record = (await puzzles("solvers", "b1000/135")).split("\n");
    expect(record[0]).toBe("retired-coder\tRetiredCoder\tperson");
    expect(record).toContain("\tb1000/130\tsolved\t2024-09-23 08:13:37\t13 BTC");

    const entry = await json<{ readonly key: string; readonly authored: readonly string[] }>(
      "solvers",
      "iamabananaamaa",
      "--json",
    );
    expect(entry).toMatchObject({ key: "iamabananaamaa", authored: ["iamabananaamaa"] });

    const missing = await failure("solvers", "b1000/66");
    expect(missing.code).toBe(1);
    expect(missing.stderr).toMatch(
      /^Unknown solver: b1000\/66\. b1000\/66 knows its solver by address only\. Known solvers: pogo, /u,
    );
  });

  it("prints every status a collection has puzzles in", async () => {
    const rows = (await puzzles("collections")).split("\n");

    expect(rows).toContain(
      "b1000: 256 puzzles, 83 solved, 77 unsolved, 96 swept, by saatoshi_rising",
    );
    expect(rows).toContain("gsmg: 1 puzzle, 0 solved, 1 unsolved, by GSMG.io");
    expect(rows).toContain(
      "hash-collision: 6 puzzles, 0 solved, 4 unsolved, 2 claimed, by Peter Todd",
    );
    expect(rows).toContain("ballet: 3 puzzles, 1 solved, 2 unsolved, by Bobby Lee");
  });

  it("exports the dataset envelope built from the classes", async () => {
    const result = await json<{
      readonly collections: readonly unknown[];
      readonly data_version: string;
    }>("export", "--compact");

    expect(result.collections).toHaveLength(36);
    expect(result.data_version).toMatch(/^[a-f0-9]{12}$/);
  });

  it("verifies a solved puzzle", async () => {
    const output = await puzzles("verify", "b1000/1");

    expect(output).toContain("OK\tb1000/1");
  });

  it("exits zero when only unverifiable puzzles remain unchecked", async () => {
    /* execFile rejects on a non-zero exit, so resolving proves the CI gate stays green. */
    await expect(puzzles("verify", "--all", "--quiet")).resolves.toBe("");
  });

  it("prints an unknown puzzle as one line and exits 1", async () => {
    const result = await failure("show", "nope/1");

    expect(result.code).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr.split("\n")).toHaveLength(2);
    expect(result.stderr).toContain("Puzzle not found: nope/1.");
  });

  it("names the collections a caller could have asked for instead", async () => {
    const result = await failure("show", "135");

    expect(result.code).toBe(1);
    expect(result.stderr.trim()).toBe(
      `Puzzle not found: 135. Did you mean b1000/135? Known collections: ${collectionKeys().join(", ")}`,
    );
  });

  it("says what the collection holds when only the puzzle is wrong", async () => {
    const result = await failure("show", "b1000/99999");

    expect(result.code).toBe(1);
    expect(result.stderr.trim()).toMatch(
      /^Puzzle not found: b1000\/99999\. Collection b1000 holds \d+ puzzles, for example b1000\/1$/u,
    );
  });

  it("names the known collections when a filter is not one", async () => {
    const result = await failure("list", "--collection", "bitcoin");

    expect(result.code).toBe(1);
    expect(result.stderr.trim()).toBe(
      `Unknown collection: bitcoin. Known collections: ${collectionKeys().join(", ")}`,
    );
  });

  it("quotes an empty collection filter instead of losing it in the sentence", async () => {
    const result = await failure("list", "--collection", "");

    expect(result.code).toBe(1);
    expect(result.stderr.trim()).toBe(
      `Unknown collection: "". Known collections: ${collectionKeys().join(", ")}`,
    );
  });

  it("refuses an option the command does not take instead of running without it", async () => {
    await expect(failure("verify", "b1000/1", "--key", "abc")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid option: unknown --key, expected one of --all, --quiet, --json\n",
    });
    await expect(failure("show", "b1000/1", "--jsn")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid option: unknown --jsn, expected one of --json\n",
    });
    await expect(failure("stats", "-x")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid option: unknown -x, expected one of --json\n",
    });
  });

  it("names a misspelled flag rather than the value it left behind", async () => {
    const result = await failure("list", "--limitt", "3");

    expect(result.code).toBe(1);
    expect(result.stderr).toMatch(/^Invalid option: unknown --limitt, expected one of /u);
  });

  it("refuses a positional argument the command has no place for", async () => {
    await expect(failure("show", "b1000/1", "b1000/2")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: 'Invalid argument: unexpected "b1000/2", show takes ID\n',
    });
    await expect(failure("stats", "b1000")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: 'Invalid argument: unexpected "b1000", stats takes no positional argument\n',
    });
  });

  it("still takes every spelling citty accepts for a declared option", async () => {
    await expect(puzzles("verify", "b1000/1", "-q")).resolves.toBe("");
    await expect(puzzles("verify", "b1000/1", "--no-json")).resolves.toBe("OK\tb1000/1");
    await expect(
      json<readonly unknown[]>("list", "--withPubkey", "--limit=1", "--json"),
    ).resolves.toHaveLength(1);
  });

  it("names the accepted statuses when the filter is not one", async () => {
    await expect(failure("list", "--status", "foo")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid status: expected one of claimed, expired, solved, swept, unsolved\n",
    });
  });

  it("reports a failed balance lookup without a stack", async () => {
    const address = "0x13f968d3bb996f39838ade86109b8150ba890d7e";
    const url = `https://eth.blockscout.com/api/v2/addresses/${address}`;

    await expect(stubbed(address, "balance", "arweave/weave7")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: `fetch ${url}\nBalance lookup failed: No response from blockscout (fetch failed): ${url}\n`,
    });
  });

  it("reads Ethereum through Blockscout without a key and through Etherscan with one", async () => {
    const run = async (key: string): Promise<string> => {
      const { stderr } = await execute(
        process.execPath,
        ["--import", "./test/support/fetch-stub.ts", "src/cli.ts", "balance", "arweave/weave7"],
        { cwd: process.cwd(), env: { ...process.env, ETHERSCAN_API_KEY: key } },
      ).catch((error: unknown) => error as Failure);
      return stderr;
    };

    expect(await run("")).toMatch(/^fetch https:\/\/eth\.blockscout\.com\/api\/v2\/addresses\//u);
    const keyed = await run("etherscan-secret");
    expect(keyed).toMatch(/^fetch https:\/\/api\.etherscan\.io\//u);
    expect(keyed).not.toContain("blockscout");
  });

  it("checks every filtered puzzle in turn and keeps going past a failed lookup", async () => {
    const result = await stubbed(
      "1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m",
      "balance",
      "--collection",
      "ballet",
    );

    expect(result.code).toBe(1);
    expect(result.stdout).toBe(
      [
        "OK\tballet/AA007448\t0.000011 BTC",
        "FAIL\tballet/AA009926\tBalance lookup failed: No response from mempool (fetch failed): https://mempool.space/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m; then No response from blockstream (fetch failed): https://blockstream.info/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m",
        "OK\tballet/AA012381\t0.000011 BTC",
        "",
      ].join("\n"),
    );
    expect(result.stderr).toBe(
      [
        "fetch https://mempool.space/api/address/1LL6Xy92LwGDRfQP9fBU7f1477cEKctr7c",
        "fetch https://mempool.space/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m",
        "fetch https://blockstream.info/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m",
        "fetch https://mempool.space/api/address/1QGtbKxx6FKDD66LwnrzHCAHmyZ7mDHqC4",
        "",
      ].join("\n"),
    );
  });

  it("hands each chain the key of its own variable", async () => {
    const run = await execute(
      process.execPath,
      ["--import", "./test/support/fetch-stub.ts", "src/cli.ts", "balance", "mini/3"],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          ETHERSCAN_API_KEY: "etherscan-secret",
          BLOCKCHAIR_API_KEY: "blockchair-secret",
        },
      },
    ).catch((error: unknown) => error as Failure);

    const [request] = run.stderr.split("\n");
    expect(request).toMatch(/^fetch https:\/\/api\.blockchair\.com\/bitcoin-cash\//u);
    expect(request).toContain("key=blockchair-secret");
    expect(run.stderr).not.toContain("etherscan-secret");
  });

  it("prints a filtered pass as one JSON array", async () => {
    const result = await stubbed(
      "1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m",
      "balance",
      "--collection",
      "ballet",
      "--status",
      "unsolved",
      "--json",
    );

    expect(result.code).toBe(1);
    expect(JSON.parse(result.stdout)).toEqual([
      {
        id: "ballet/AA009926",
        chain: "bitcoin",
        error:
          "Balance lookup failed: No response from mempool (fetch failed): https://mempool.space/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m; then No response from blockstream (fetch failed): https://blockstream.info/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m",
      },
      {
        id: "ballet/AA012381",
        chain: "bitcoin",
        confirmed: "1100",
        unconfirmed: "0",
        decimals: 8,
      },
    ]);
  });

  it("watches a pass and exits 1 on a finding, beside a failed lookup", async () => {
    const result = await stubbed(
      "1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m",
      "watch",
      "--collection",
      "ballet",
    );

    expect(result.code).toBe(1);
    expect(result.stdout.split("\n")).toEqual([
      "OK\tballet/AA007448",
      "FAIL\tballet/AA009926\tTransaction history lookup failed: No response from mempool (fetch failed): https://mempool.space/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m/txs; then No response from blockstream (fetch failed): https://blockstream.info/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m/txs",
      "FAIL\tballet/AA009926\tBalance lookup failed: No response from mempool (fetch failed): https://mempool.space/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m; then No response from blockstream (fetch failed): https://blockstream.info/api/address/1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m",
      "BALANCE\tballet/AA012381\t0.000011 BTC held, 1.00003877 BTC recorded as the prize",
      "",
    ]);
  });

  it("exits 0 when the chain matches the record and 2 when only lookups failed", async () => {
    const failing = "1JxWyNrkgYvgsHu8hVQZqTXEB9RftRGP5m";

    await expect(stubbed(failing, "watch", "ballet/AA007448")).resolves.toMatchObject({
      code: 0,
      stdout: "OK\tballet/AA007448\n",
    });
    const failed = await stubbed(failing, "watch", "ballet/AA009926");
    expect(failed.code).toBe(2);
    expect(failed.stdout).toMatch(/^FAIL\tballet\/AA009926\tTransaction history lookup failed: /u);
  });

  it("exits 0 on a complete eligibility record and 1 while a field is missing", async () => {
    const complete = await stubbed("unused", "eligibility", "gsmg");
    expect(complete.code).toBe(0);
    expect(complete.stdout).toMatch(
      /^live\t1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe 0\.000011 BTC confirmed, 0 BTC unconfirmed, received 0\.000015 BTC, spent 0\.000004 BTC, read from mempool at /mu,
    );
    expect(complete.stdout).not.toMatch(/^missing\t/mu);

    const bare = await stubbed(
      "unused",
      "eligibility",
      "1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
      "--json",
    );
    expect(bare.code).toBe(1);
    expect(JSON.parse(bare.stdout)).toMatchObject({
      chain: "bitcoin",
      kind: "p2pkh",
      live: [{ confirmed: "1100", funded: "1500", spent: "400" }],
    });
  });

  it("rejects a since date before any lookup", async () => {
    await expect(failure("watch", "bitaps", "--since", "2026-13-01")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid since: expected YYYY-MM-DD or an ISO 8601 date and time\n",
    });
  });

  it("asks for an id or a filter before checking balances", async () => {
    await expect(failure("balance")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid id: pass a puzzle identifier or a filter such as --status\n",
    });
  });

  it("refuses an id and a filter together", async () => {
    await expect(failure("balance", "b1000/71", "--status", "unsolved")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid id: pass a puzzle identifier or filters, not both\n",
    });
  });

  it("asks for an id or --all before verifying", async () => {
    await expect(failure("verify")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid id: pass a puzzle identifier or --all\n",
    });
  });

  it("prints the usage and citty's errors without colors into a pipe", async () => {
    const switches = new Set(["CI", "FORCE_COLOR", "NO_COLOR", "NODE_DISABLE_COLORS", "TEST"]);
    const env = {
      ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !switches.has(key))),
      TERM: "xterm-256color",
    };
    const run = async (...args: readonly string[]): Promise<Failure> => {
      try {
        const { stderr, stdout } = await execute(process.execPath, ["src/cli.ts", ...args], {
          cwd: process.cwd(),
          env,
        });
        return { code: 0, stderr, stdout };
      } catch (error) {
        const { code, stderr, stdout } = error as Failure;
        return { code, stderr, stdout };
      }
    };

    const help = await run("--help");
    const usage = await run("verify", "--help");
    const unknown = await run("nope");

    expect(help.stdout).toContain("USAGE puzzles assets|authors|balance|");
    expect(usage.stdout).toContain("--all    Verify every puzzle");
    expect(unknown).toMatchObject({ code: 1, stderr: "Unknown command nope\n" });
    for (const output of [help, usage, unknown]) {
      expect(output.stdout + output.stderr).not.toContain("\u001B");
    }
  });

  it("keeps an identifier with a line break and an escape on one line", async () => {
    await expect(failure("show", "nope\n\u001B[31mx")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: `Puzzle not found: nope  [31mx. Known collections: ${collectionKeys().join(", ")}\n`,
    });
  });
});
