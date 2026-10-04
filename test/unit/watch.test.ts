import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { b1000 } from "../../src/collections/b1000.ts";
import { teikhos } from "../../src/collections/teikhos.ts";
import { InvalidArgumentError } from "../../src/index.ts";
import type * as Watch from "../../src/core/watch.ts";
import { formatWatchReport, watcher } from "../../src/core/watch.ts";
import { watchTool } from "../../src/tool-operations.ts";

const target = "1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU";

/* Made up: a top-up of b1000/71 the record doesn't list. */
const deposit = {
  txid: "e".repeat(64),
  fee: 66,
  status: { confirmed: true, block_height: 969500, block_time: 1790900000 },
  vin: [{ prevout: { scriptpubkey_address: "18GD2392ZAQEBv3FHGxQ9Zk3RR7yyVcRLN", value: 19146 } }],
  vout: [
    { scriptpubkey_address: target, value: 666 },
    { scriptpubkey_address: "18GD2392ZAQEBv3FHGxQ9Zk3RR7yyVcRLN", value: 18414 },
  ],
};
/* A transaction mempool.space returned for b1000/71, trimmed to the fields the provider reads. */
const recorded = {
  txid: "a2808acb455f636dc988186219d025e6507bd80640b0056b46583232aee7cfa5",
  fee: 1581,
  status: { confirmed: true, block_height: 927901, block_time: 1765747997 },
  vin: [
    {
      prevout: { scriptpubkey_address: "bc1qtr5kjwc4l6cuzs4j87xx950qf62weq43evmdly", value: 12979 },
    },
  ],
  vout: [
    { scriptpubkey_address: target, value: 1 },
    { scriptpubkey_address: "1PWo3JeB9jrGwfJqVT99iRyva6kzmAaxTh", value: 1 },
    { scriptpubkey_address: "bc1qs0psa2j30hr2k45kama92kpsh7qt0j3kltez7p", value: 11396 },
  ],
};
/* Made up: the prize leaving for another address, still in the mempool. */
const spend = {
  txid: "f".repeat(64),
  fee: 1000,
  status: { confirmed: false },
  vin: [{ prevout: { scriptpubkey_address: target, value: 710191680 } }],
  vout: [{ scriptpubkey_address: "18GD2392ZAQEBv3FHGxQ9Zk3RR7yyVcRLN", value: 710190680 }],
};

/* `size` made up transactions on the target that move nothing, newest first. */
function empty(size: number) {
  return Array.from({ length: size }, (_, index) => ({
    ...recorded,
    txid: index.toString(16).padStart(64, "0"),
    vout: [{ scriptpubkey_address: target, value: 0 }],
  }));
}

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
}

/* mempool.space for b1000/71: 25 transactions a page like Esplora, 400 from `broken` on. */
function stubBitcoin(
  history: readonly Readonly<{ txid: string }>[],
  held: number,
  broken = Number.POSITIVE_INFINITY,
): string[] {
  const urls: string[] = [];
  vi.stubGlobal("fetch", async (input: unknown) => {
    const url = String(input);
    urls.push(url);
    if (url.endsWith(`/address/${target}/txs`)) return json(history.slice(0, 25));
    const after = url.split(`/address/${target}/txs/chain/`)[1];
    if (after !== undefined) {
      const start = history.findIndex(({ txid }) => txid === after) + 1;
      return start >= broken
        ? new Response("Bad Request", { status: 400 })
        : json(history.slice(start, start + 25));
    }
    return json({
      chain_stats: { funded_txo_sum: held, spent_txo_sum: 0 },
      mempool_stats: { funded_txo_sum: 0, spent_txo_sum: 0 },
    });
  });
  return urls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("watcher", () => {
  it("lists a deposit the record misses and the prize it moved", async () => {
    stubBitcoin([deposit, recorded], 710191680 + 666);

    const report = await watcher()(b1000.require(71));

    expect(report.errors).toEqual([]);
    expect(report.findings).toEqual([
      {
        kind: "deposit",
        txid: deposit.txid,
        address: target,
        amount: 666n,
        date: "2026-10-02T00:13:20.000Z",
        direction: "in",
        pending: false,
      },
      { kind: "balance", balance: 710192346n, prize: "7.1019168" },
    ]);
    expect(formatWatchReport(report)).toEqual([
      `DEPOSIT\tb1000/71\t${deposit.txid} 0.00000666 BTC 2026-10-02T00:13:20.000Z at ${target}`,
      "BALANCE\tb1000/71\t7.10192346 BTC held, 7.1019168 BTC recorded as the prize",
    ]);
  });

  it("puts an unconfirmed spend last and reads OK when nothing else differs", async () => {
    stubBitcoin([recorded], 710191680);
    expect(formatWatchReport(await watcher()(b1000.require(71)))).toEqual(["OK\tb1000/71"]);

    stubBitcoin([spend, deposit, recorded], 710191680);
    const { findings } = await watcher()(b1000.require(71));
    expect(findings.map((finding) => finding.kind)).toEqual(["deposit", "spend"]);
    expect(findings[1]).toMatchObject({ pending: true, direction: "out" });
  });

  it("reads past the first 100 transactions to a deposit the record misses", async () => {
    stubBitcoin([...empty(149), deposit], 710191680 + 666);

    const { findings, truncated } = await watcher()(b1000.require(71));

    expect(truncated).toEqual([]);
    expect(findings.map((finding) => finding.kind)).toEqual(["deposit", "balance"]);
    expect(findings[0]).toMatchObject({ txid: deposit.txid, amount: 666n });
  });

  it("keeps the pages it read when a later one fails", async () => {
    const history = empty(150);
    history.splice(50, 1, deposit);
    stubBitcoin(history, 710191680 + 666, 100);

    const report = await watcher()(b1000.require(71));

    expect(report.truncated).toEqual([]);
    expect(report.findings.map((finding) => finding.kind)).toEqual(["deposit", "balance"]);
    expect(formatWatchReport(report).at(-1)).toBe(
      `FAIL\tb1000/71\tTransaction history lookup failed: HTTP 400 from https://mempool.space/api/address/${target}/txs/chain/${history[99]?.txid}: Bad Request, past the newest 100 transactions at ${target}`,
    );
  });

  it("names an address busier than 1000 transactions instead of calling it OK", async () => {
    stubBitcoin(empty(1000), 710191680);
    expect(formatWatchReport(await watcher()(b1000.require(71)))).toEqual([
      `PARTIAL\tb1000/71\tonly the newest 1000 transactions at ${target} read, older ones unchecked`,
    ]);

    stubBitcoin(empty(999), 710191680);
    expect(formatWatchReport(await watcher()(b1000.require(71)))).toEqual(["OK\tb1000/71"]);
  });

  it("leaves out a contract call that moves no coin in and a deposit that reverted", async () => {
    const contract = teikhos.require(0).address().value;
    vi.stubGlobal("fetch", async (input: unknown) => {
      const url = String(input);
      if (url.includes("/transactions")) {
        return json({
          items: [
            {
              hash: `0x${"a".repeat(64)}`,
              block_number: 5000000,
              timestamp: "2018-02-26T01:51:37.000000Z",
              from: { hash: "0xB171Cd18DECC9715e91998E0E33f4e0a2bc7EB79" },
              to: { hash: contract },
              value: "0",
              status: "ok",
              method: "authenticate",
              transaction_types: ["contract_call"],
            },
            {
              hash: "0xdeabfc901da5066796edbfc2f3a942b3310ef0bf7f67ad13b63434851c3a9348",
              block_number: 5157041,
              timestamp: "2018-02-26T01:54:00.000000Z",
              from: { hash: "0x4c5d24a7ca972aea90cc040da6770a13fc7d4d9a" },
              to: { hash: contract },
              value: "100000000000000000",
              status: "error",
              method: null,
              transaction_types: ["coin_transfer"],
            },
          ],
          next_page_params: null,
        });
      }
      return json({ coin_balance: "1000012026000000000" });
    });

    const report = await watcher()(teikhos.require(0));

    expect(report).toMatchObject({ errors: [], findings: [] });
  });

  it("turns a failed lookup into an error and still checks the balance", async () => {
    vi.stubGlobal("fetch", async (input: unknown) => {
      if (String(input).includes("/txs")) throw new TypeError("fetch failed");
      return json({
        chain_stats: { funded_txo_sum: 710191680, spent_txo_sum: 0 },
        mempool_stats: { funded_txo_sum: 0, spent_txo_sum: 0 },
      });
    });

    const report = await watcher()(b1000.require(71));

    expect(report.findings).toEqual([]);
    expect(report.errors).toEqual([
      expect.stringMatching(/^Transaction history lookup failed: No response from mempool /u),
    ]);
    expect(formatWatchReport(report)[0]).toMatch(/^FAIL\tb1000\/71\tTransaction history/u);
  });

  it("rejects a since it can't read before any lookup", () => {
    for (const since of ["2026-13-01", "2026-02-30", "yesterday", "2026-09-01 12:00"]) {
      expect(() => watcher({ since })).toThrow(InvalidArgumentError);
    }
    expect(() => watcher({ since: "2026-09-01T12:00:00Z" })).not.toThrow();
  });
});

describe("watcher with since", () => {
  /* `watch.ts` imports `sources.ts` on demand, so a fresh module graph lets a stub take its place. */
  async function withSources(
    sourceChange: (...args: readonly unknown[]) => Promise<unknown>,
  ): Promise<typeof Watch> {
    vi.resetModules();
    vi.doMock("../../src/core/sources.ts", () => ({ sourceChange }));
    return import("../../src/core/watch.ts");
  }

  afterEach(() => {
    vi.doUnmock("../../src/core/sources.ts");
    vi.resetModules();
  });

  it("reads a source page that two puzzles share once per pass", async () => {
    stubBitcoin([recorded], 710191680);
    const change = {
      url: "https://privatekeys.pw/puzzles/bitcoin-puzzle-tx",
      before: { timestamp: "2026-08-01T00:00:00Z", snapshot: "https://web.archive.org/web/1/x" },
      after: { timestamp: "2026-09-20T00:00:00Z", snapshot: "https://web.archive.org/web/2/x" },
      additions: 3,
      deletions: 1,
      partial: false,
    };
    const sourceChange = vi.fn(async () => change);
    const { watcher: fresh } = await withSources(sourceChange);
    const { b1000: fresh1000 } = await import("../../src/collections/b1000.ts");
    const check = fresh({ since: "2026-09-01" });

    const first = await check(fresh1000.require(71));
    await check(fresh1000.require(71));

    expect(sourceChange).toHaveBeenCalledTimes(1);
    expect(sourceChange).toHaveBeenCalledWith(
      fresh1000.require(71).sourceUrl(),
      new Date("2026-09-01T00:00:00Z"),
      undefined,
    );
    expect(first.findings).toEqual([{ kind: "source", ...change }]);
  });

  it("reports an archive failure as an error, not a finding", async () => {
    stubBitcoin([recorded], 710191680);
    const { watcher: fresh } = await withSources(async () => {
      const { SourceLookupError } = await import("../../src/core/errors.ts");
      throw new SourceLookupError("Source lookup failed: no capture");
    });
    const { b1000: fresh1000 } = await import("../../src/collections/b1000.ts");

    const report = await fresh({ since: "2026-09-01" })(fresh1000.require(71));

    expect(report).toMatchObject({ findings: [], errors: ["Source lookup failed: no capture"] });
  });
});

describe("puzzles_watch", () => {
  it("leads with the counts and says when the source page was left out", async () => {
    stubBitcoin([deposit, recorded], 710191680 + 666);

    const result = await watchTool("b1000/71");

    expect(result.content[0]?.text.split("\n")).toEqual([
      "b1000/71: 2 differences from the record",
      `DEPOSIT\tb1000/71\t${deposit.txid} 0.00000666 BTC 2026-10-02T00:13:20.000Z at ${target}`,
      "BALANCE\tb1000/71\t7.10192346 BTC held, 7.1019168 BTC recorded as the prize",
      "Source page not checked; pass since to compare its archive captures.",
    ]);
    expect(result.details).toMatchObject({
      id: "b1000/71",
      findings: [
        { kind: "deposit", amount: "666" },
        { kind: "balance", balance: "710192346" },
      ],
      errors: [],
      truncated: [],
    });
    expect(JSON.stringify(result.details)).toContain('"amount":"666"');
  });

  it("rejects a since outside its limits as an argument error", async () => {
    await expect(watchTool("b1000/71", "2026")).rejects.toThrow(InvalidArgumentError);
    await expect(watchTool("b1000/71", "2026-13-01")).rejects.toThrow(
      "Invalid since: expected YYYY-MM-DD or an ISO 8601 date and time",
    );
  });
});
