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

    expect(result.total).toBe(333);
    expect(result.unsolved).toBe(93);
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
    const hints = await json<readonly unknown[]>("hints", "b1000/71", "--json");

    expect(record.hints).toBeUndefined();
    expect(hints).toEqual([
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
    ]);
  });

  it("says so when a puzzle has no hints and exits 0", async () => {
    await expect(puzzles("hints", "gsmg")).resolves.toBe("gsmg: no hints recorded");
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

    expect(result).toHaveLength(11);
    expect(result.map((entry) => entry.key)).toContain("hash_collision");
  });

  it("exports the dataset envelope built from the classes", async () => {
    const result = await json<{
      readonly collections: readonly unknown[];
      readonly data_version: string;
    }>("export", "--compact");

    expect(result.collections).toHaveLength(11);
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
