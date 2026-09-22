import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { b1000 } from "../../src/collections/b1000.ts";
import { zden } from "../../src/collections/zden.ts";
import {
  Balance,
  BalanceProviderError,
  ethereumPuzzle,
  InvalidAddressError,
  moneroPuzzle,
  standard,
  UnsupportedChainError,
} from "../../src/index.ts";

/* The providers read `globalThis.fetch` at call time, so a stub stands in for the network. */
function stubFetch(reply: (url: string) => Response | Promise<Response>): string[] {
  const urls: string[] = [];
  /* `URL` and `Request` carry mutable members, so the stub narrows from `unknown` instead. */
  vi.stubGlobal("fetch", async (input: unknown) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : undefined;
    if (url === undefined) {
      throw new TypeError("the providers are expected to fetch by URL string");
    }
    urls.push(url);
    return reply(url);
  });
  return urls;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const ethereum = ethereumPuzzle({
  id: "test/ethereum",
  address: standard("0x0000000000000000000000000000000000000000"),
  sourceUrl: "https://example.com",
  startedAt: "2020-01-01 00:00:00",
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Puzzle.balance", () => {
  it("reads confirmed and mempool balances through the Mempool provider", async () => {
    const urls = stubFetch(() =>
      json({
        chain_stats: { funded_txo_sum: 1500, spent_txo_sum: 400 },
        mempool_stats: { funded_txo_sum: 25, spent_txo_sum: 5 },
      }),
    );

    const balance = await b1000.balance(1, { baseUrl: "https://example.test" });

    expect(urls).toEqual(["https://example.test/api/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"]);
    expect(balance.confirmed).toBe(1100n);
    expect(balance.unconfirmed).toBe(20n);
    expect(balance.total()).toBe(1120n);
  });

  it("keeps Decred's unconfirmed delta separate from the confirmed balance", async () => {
    const address = zden.require("decred_janus").address().value;
    const urls = stubFetch(() =>
      json({
        addrStr: address,
        balanceSat: 1000,
        totalReceivedSat: 5000,
        totalSentSat: 4000,
        unconfirmedBalanceSat: -50,
      }),
    );

    const balance = await zden.balance("decred_janus", { baseUrl: "https://example.test/api" });

    expect(urls).toEqual([`https://example.test/api/addr/${address}?noTxList=1`]);
    expect(balance.confirmed).toBe(1000n);
    expect(balance.unconfirmed).toBe(-50n);
    expect(balance.total()).toBe(950n);
  });

  it("reads an Ethereum balance with the API key on the query", async () => {
    const urls = stubFetch(() => json({ status: "1", message: "OK", result: "123" }));

    const balance = await ethereum.balance({ apiKey: "top-secret" });

    expect(urls[0]).toContain("apikey=top-secret");
    expect(urls[0]).toContain("address=0x0000000000000000000000000000000000000000");
    expect(balance.confirmed).toBe(123n);
    expect(balance.unconfirmed).toBe(0n);
  });

  it("reports a wei precise Ethereum balance without rounding it", async () => {
    stubFetch(() => json({ status: "1", message: "OK", result: "1234567890123456789" }));

    const balance = await ethereum.balance({ apiKey: "top-secret" });

    expect(balance.totalAmount()).toBe("1.234567890123456789");
    expect(balance.confirmedAmount()).toBe("1.234567890123456789");
    /* The double drops the last digits, which is why the amount methods exist. */
    expect(String(balance.totalUnits())).toBe("1.2345678901234567");
  });

  it("writes a dust Ethereum balance in full instead of an exponent", async () => {
    stubFetch(() => json({ status: "1", message: "OK", result: "1" }));

    const balance = await ethereum.balance({ apiKey: "top-secret" });

    expect(balance.totalAmount()).toBe("0.000000000000000001");
    expect(String(balance.totalUnits())).toBe("1e-18");
  });

  it("trims a Bitcoin amount to its significant places and keeps a whole one whole", async () => {
    stubFetch(() =>
      json({
        chain_stats: { funded_txo_sum: 1500, spent_txo_sum: 400 },
        mempool_stats: { funded_txo_sum: 25, spent_txo_sum: 5 },
      }),
    );

    const balance = await b1000.balance(1, { baseUrl: "https://example.test" });

    expect(balance.totalAmount()).toBe("0.0000112");
    expect(balance.confirmedAmount()).toBe("0.000011");
    expect(new Balance("bitcoin", 200_000_000n, 0n).totalAmount()).toBe("2");
  });

  it("signs a total a mempool delta pushes below zero", () => {
    expect(new Balance("decred", 0n, -50n).totalAmount()).toBe("-0.0000005");
  });

  it("rejects malformed provider data as a provider error", async () => {
    stubFetch(() => json({ chain_stats: null, mempool_stats: {} }));

    await expect(b1000.balance(1)).rejects.toBeInstanceOf(BalanceProviderError);
  });

  it("maps a rejected address onto InvalidAddressError", async () => {
    stubFetch(() => new Response("Invalid Bitcoin address", { status: 400 }));

    await expect(b1000.balance(1)).rejects.toBeInstanceOf(InvalidAddressError);
  });

  it("rejects unsupported chains without touching the network", async () => {
    const urls = stubFetch(() => json({}));
    const monero = moneroPuzzle({
      id: "test/monero",
      address: standard(
        "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
      ),
      sourceUrl: "https://example.com",
      startedAt: "2020-01-01 00:00:00",
    });

    await expect(monero.balance()).rejects.toBeInstanceOf(UnsupportedChainError);
    expect(urls).toEqual([]);
  });

  it("requires an API key for Ethereum before any request", async () => {
    const urls = stubFetch(() => json({}));

    await expect(ethereum.balance()).rejects.toThrow(/API key/);
    expect(urls).toEqual([]);
  });

  it("redacts API keys from transport failures", async () => {
    stubFetch(() => {
      throw new Error("offline");
    });

    const failure = ethereum.balance({ apiKey: "top-secret" });

    await expect(failure).rejects.toBeInstanceOf(BalanceProviderError);
    await expect(failure).rejects.not.toThrow("top-secret");
  });

  it("redacts API keys echoed by a provider", async () => {
    stubFetch(() => json({ status: "0", message: "NOTOK", result: "rejected top-secret" }));

    const failure = ethereum.balance({ apiKey: "top-secret" });

    await expect(failure).rejects.toThrow("REDACTED");
    await expect(failure).rejects.not.toThrow("top-secret");
  });
});
