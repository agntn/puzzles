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

    expect(result.total).toBe(332);
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

    expect(result).toHaveLength(10);
    expect(result.map((entry) => entry.key)).toContain("hash_collision");
  });

  it("exports the dataset envelope built from the classes", async () => {
    const result = await json<{
      readonly collections: readonly unknown[];
      readonly data_version: string;
    }>("export", "--compact");

    expect(result.collections).toHaveLength(10);
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
});
