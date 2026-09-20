import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

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
 * The child has no fetch stub, so the Etherscan key is blanked and the balance case fails before
 * any request.
 */
async function failure(...args: readonly string[]): Promise<Failure> {
  try {
    await execute(process.execPath, ["src/cli.ts", ...args], {
      cwd: process.cwd(),
      env: { ...process.env, ETHERSCAN_API_KEY: "" },
    });
  } catch (error) {
    const { code, stderr, stdout } = error as Failure;
    return { code, stderr, stdout };
  }
  throw new Error(`puzzles ${args.join(" ")} exited 0`);
}

describe.concurrent("puzzles CLI", () => {
  it("prints machine-readable statistics", async () => {
    const result = await json<{ readonly total: number; readonly unsolved: number }>(
      "stats",
      "--json",
    );

    expect(result.total).toBe(340);
    expect(result.unsolved).toBe(94);
  });

  it("shows a puzzle by universal identifier", async () => {
    const result = await json<{ readonly id: string; readonly status: string }>(
      "show",
      "b1000/1",
      "--json",
    );

    expect(result).toMatchObject({ id: "b1000/1", status: "solved" });
  });

  it("prints the hints that hold for a puzzle as the tool does", async () => {
    const output = await puzzles("hints", "warp/challenge_1");

    expect(output.split("\n")).toEqual([
      "warp/challenge_1: 1 hint",
      "hints: 1",
      "\tofficial\t-\tthis passphrase is 2 random alphanumeric characters, such as 'X9'.\tsource: https://keybase.io/warp\tconfirmation: https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html (Wayback capture of the challenge page)",
    ]);
  });

  it("dates a hint the author tweeted and names the page that links it", async () => {
    const output = await puzzles("hints", "zden/demobit_2018");

    expect(output.split("\n")).toEqual([
      "zden/demobit_2018: 1 hint",
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
    const output = await puzzles("hints", "zden/decred_janus");
    const hints = await json<Record<string, unknown>>("hints", "zden/decred_janus", "--json");

    expect(output.split("\n")).toEqual([
      "zden/decred_janus: 1 hint, 1 hint asset",
      "hints: 1",
      "\tofficial\t-\t33*bbb\tsource: https://crypto.haluska.sk/decred_tree_hint.svg\tconfirmation: https://web.archive.org/web/20181219152809/http://crypto.haluska.sk/decred_tree_hint.svg (Wayback capture of the hint SVG)",
      "hint assets: https://raw.githubusercontent.com/agntn/puzzles/main/assets/zden/decred_janus/hint.svg",
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
          file: "decred_janus/hint.svg",
          path: "assets/zden/decred_janus/hint.svg",
          url: "https://raw.githubusercontent.com/agntn/puzzles/main/assets/zden/decred_janus/hint.svg",
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
    }>("show", "zden/1bitcoin_white_paper", "--json");

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
    const output = await puzzles("hints", "zden/1bitcoin_white_paper");
    const hints = await json<Record<string, unknown>>(
      "hints",
      "zden/1bitcoin_white_paper",
      "--json",
    );

    expect(output.split("\n")).toEqual([
      "zden/1bitcoin_white_paper: 1 hint",
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
      "hint assets: https://raw.githubusercontent.com/agntn/puzzles/main/assets/gsmg/follow_the_white_rabbit.png",
    ]);
    expect(hints).toEqual({
      hints: [],
      hintAssets: [
        {
          kind: "hint",
          file: "follow_the_white_rabbit.png",
          path: "assets/gsmg/follow_the_white_rabbit.png",
          url: "https://raw.githubusercontent.com/agntn/puzzles/main/assets/gsmg/follow_the_white_rabbit.png",
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
    await expect(failure("hints", "nope/1")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Puzzle not found: nope/1\n",
    });
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

  it("lists every registered collection", async () => {
    const result = await json<readonly { readonly key: string; readonly total: number }[]>(
      "collections",
      "--json",
    );

    expect(result).toHaveLength(14);
    expect(result.map((entry) => entry.key)).toContain("hash_collision");
  });

  it("prints every status a collection has puzzles in", async () => {
    const rows = (await puzzles("collections")).split("\n");

    expect(rows).toContain(
      "b1000: 256 puzzles, 83 solved, 77 unsolved, 96 swept, by saatoshi_rising",
    );
    expect(rows).toContain(
      "hash_collision: 6 puzzles, 0 solved, 4 unsolved, 2 claimed, by Peter Todd",
    );
    expect(rows).toContain("ballet: 3 puzzles, 1 solved, 2 unsolved, by Bobby Lee");
  });

  it("exports the dataset envelope built from the classes", async () => {
    const result = await json<{
      readonly collections: readonly unknown[];
      readonly data_version: string;
    }>("export", "--compact");

    expect(result.collections).toHaveLength(14);
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
    await expect(failure("show", "nope/1")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Puzzle not found: nope/1\n",
    });
  });

  it("names the accepted statuses when the filter is not one", async () => {
    await expect(failure("list", "--status", "foo")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid status: expected one of claimed, expired, solved, swept, unsolved\n",
    });
  });

  it("reports a balance the library refuses without a stack", async () => {
    await expect(failure("balance", "arweave/weave7")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Ethereum balance lookup requires an Etherscan API key\n",
    });
  });

  it("asks for an id or --all before verifying", async () => {
    await expect(failure("verify")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Invalid id: pass a puzzle identifier or --all\n",
    });
  });

  it("keeps an identifier with a line break and an escape on one line", async () => {
    await expect(failure("show", "nope\n\u001B[31mx")).resolves.toEqual({
      code: 1,
      stdout: "",
      stderr: "Puzzle not found: nope  [31mx\n",
    });
  });
});
