import { afterAll, afterEach, describe, expect, it, vi } from "vite-plus/test";
import { bits } from "../../src/collections/bits.ts";
import { zden } from "../../src/collections/zden.ts";
import {
  Balance,
  BalanceProviderError,
  InvalidAddressError,
  p2pkh,
  puzzle,
  type PuzzleSpec,
  standard,
  UnsupportedChainError,
} from "../../src/index.ts";
import type * as Library from "../../src/index.ts";
import type * as Tools from "../../src/tool-operations.ts";

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

const ethereum = puzzle({
  id: "test/ethereum",
  chain: "ethereum",
  address: standard("0x0000000000000000000000000000000000000000"),
  sourceUrl: "https://example.com",
  startedAt: "2020-01-01 00:00:00",
});

const cashAddress = "bitcoincash:qz3yjg59ypg6jqpwhaxgvjj44jm4hdx0w5wsxw2qez";

const bitcoinCash = {
  id: "test/bitcoincash",
  chain: "bitcoincash",
  address: p2pkh(cashAddress),
  sourceUrl: "https://example.com",
  startedAt: "2024-12-14 16:22:32",
} satisfies PuzzleSpec;

/* Blockchair's dashboard for an address it has seen: funded and emptied by the claim. */
function blockchairAddress(): Response {
  return json({
    data: { [cashAddress]: { address: { balance: 0, received: 130000000, spent: 130000000 } } },
    context: { state: 915000 },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Puzzle.balance", () => {
  it("reads confirmed and mempool balances through the Mempool provider", async () => {
    const urls = stubFetch(() =>
      json({
        chain_stats: { funded_txo_sum: 1500, spent_txo_sum: 400 },
        mempool_stats: { funded_txo_sum: 25, spent_txo_sum: 5 },
      }),
    );

    const balance = await bits.balance(1, { baseUrl: "https://example.test" });

    expect(urls).toEqual(["https://example.test/api/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"]);
    expect(balance.confirmed).toBe(1100n);
    expect(balance.unconfirmed).toBe(20n);
    expect(balance.total()).toBe(1120n);
  });

  it("reads a Bitcoin Cash balance through Blockchair", async () => {
    vi.stubEnv("BLOCKCHAIR_API_KEY", undefined);
    const urls = stubFetch(() => blockchairAddress());

    const balance = await puzzle(bitcoinCash).balance({
      baseUrl: "https://example.test",
    });

    expect(urls).toEqual([
      `https://example.test/bitcoin-cash/dashboards/address/${encodeURIComponent(cashAddress)}`,
    ]);
    expect(balance.chain).toBe("bitcoincash");
    expect(balance.confirmed).toBe(0n);
    expect(balance.decimals).toBe(8);
  });

  it("reads an eCash balance through Blockchair in XEC's two decimals", async () => {
    vi.stubEnv("BLOCKCHAIR_API_KEY", undefined);
    const address = "ecash:qq5r308v2mkh6x5mkqpr6wytszz6f9r7qcnfttev0z";
    const urls = stubFetch(() =>
      json({
        data: { [address]: { address: { balance: 546, received: 3006800640, spent: 3006800094 } } },
        context: { state: 967400 },
      }),
    );

    const balance = await puzzle({
      ...bitcoinCash,
      chain: "ecash",
      address: p2pkh(address),
    }).balance({
      baseUrl: "https://example.test",
    });

    expect(urls).toEqual([
      `https://example.test/ecash/dashboards/address/${encodeURIComponent(address)}`,
    ]);
    expect(balance.chain).toBe("ecash");
    expect(balance.confirmed).toBe(546n);
    expect(balance.decimals).toBe(2);
  });

  it("reads a Dogecoin balance through Blockchair", async () => {
    vi.stubEnv("BLOCKCHAIR_API_KEY", undefined);
    const address = "DRMqy4bGAnWpaShBFtTUoHEiBWj4HoiSfq";
    const urls = stubFetch(() =>
      json({
        data: {
          [address]: { address: { balance: 0, received: 1000000000000, spent: 1000000000000 } },
        },
        context: { state: 6397254 },
      }),
    );

    const balance = await puzzle({
      ...bitcoinCash,
      chain: "dogecoin",
      address: p2pkh(address),
    }).balance({
      baseUrl: "https://example.test",
    });

    expect(urls).toEqual([`https://example.test/dogecoin/dashboards/address/${address}`]);
    expect(balance.chain).toBe("dogecoin");
    expect(balance.confirmed).toBe(0n);
    expect(balance.decimals).toBe(8);
  });

  it("names BLOCKCHAIR_API_KEY when Blockchair blocks a keyless caller", async () => {
    vi.stubEnv("BLOCKCHAIR_API_KEY", undefined);
    stubFetch(() =>
      json(
        { data: null, context: { code: 430, error: "Your IP address is temporary blacklisted" } },
        430,
      ),
    );

    const failure = puzzle(bitcoinCash).balance();

    await expect(failure).rejects.toBeInstanceOf(BalanceProviderError);
    await expect(failure).rejects.toThrow("BLOCKCHAIR_API_KEY");
  });

  it("keeps Decred's unconfirmed delta separate from the confirmed balance", async () => {
    const address = zden.require("decred-janus").address().value;
    const urls = stubFetch(() =>
      json({
        addrStr: address,
        balanceSat: 1000,
        totalReceivedSat: 5000,
        totalSentSat: 4000,
        unconfirmedBalanceSat: -50,
      }),
    );

    const balance = await zden.balance("decred-janus", { baseUrl: "https://example.test/api" });

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

    const balance = await bits.balance(1, { baseUrl: "https://example.test" });

    expect(balance.totalAmount()).toBe("0.0000112");
    expect(balance.confirmedAmount()).toBe("0.000011");
    expect(new Balance("bitcoin", 200_000_000n, 0n).totalAmount()).toBe("2");
  });

  it("signs a total a mempool delta pushes below zero", () => {
    expect(new Balance("decred", 0n, -50n).totalAmount()).toBe("-0.0000005");
  });

  it("rejects malformed provider data as a provider error", async () => {
    stubFetch(() => json({ chain_stats: null, mempool_stats: {} }));

    await expect(bits.balance(1)).rejects.toBeInstanceOf(BalanceProviderError);
  });

  it("maps a rejected address onto InvalidAddressError", async () => {
    stubFetch(() => new Response("Invalid Bitcoin address", { status: 400 }));

    await expect(bits.balance(1)).rejects.toBeInstanceOf(InvalidAddressError);
  });

  it.each([
    ["gets no response", () => Promise.reject(new TypeError("fetch failed"))],
    ["answers 503", () => new Response("Service Unavailable", { status: 503 })],
  ])("asks Blockstream once when mempool.space %s", async (_, failure) => {
    const urls = stubFetch((url) =>
      url.startsWith("https://mempool.space/")
        ? failure()
        : json({
            chain_stats: { funded_txo_sum: 1500, spent_txo_sum: 400 },
            mempool_stats: { funded_txo_sum: 0, spent_txo_sum: 0 },
          }),
    );

    const balance = await bits.balance(1);

    expect(urls).toEqual([
      "https://mempool.space/api/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
      "https://blockstream.info/api/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
    ]);
    expect(balance.confirmed).toBe(1100n);
  });

  it("asks Blockstream after the retries mempool.space's own rate limit takes", async () => {
    const urls = stubFetch((url) =>
      url.startsWith("https://mempool.space/")
        ? new Response("Too Many Requests", { status: 429, headers: { "retry-after": "0" } })
        : json({
            chain_stats: { funded_txo_sum: 1500, spent_txo_sum: 400 },
            mempool_stats: { funded_txo_sum: 0, spent_txo_sum: 0 },
          }),
    );

    const balance = await bits.balance(1);

    expect(urls.filter((url) => url.startsWith("https://mempool.space/"))).toHaveLength(3);
    expect(urls.at(-1)).toBe(
      "https://blockstream.info/api/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
    );
    expect(balance.confirmed).toBe(1100n);
  });

  it("asks Blockstream first for ten minutes after mempool.space misses", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const urls = stubFetch((url) =>
      url.startsWith("https://mempool.space/")
        ? Promise.reject(new TypeError("fetch failed"))
        : json({
            chain_stats: { funded_txo_sum: 1500, spent_txo_sum: 400 },
            mempool_stats: { funded_txo_sum: 0, spent_txo_sum: 0 },
          }),
    );

    await bits.balance(1);
    await bits.balance(2);
    vi.advanceTimersByTime(10 * 60 * 1000);
    await bits.balance(3).catch(() => undefined);
    vi.useRealTimers();

    expect(urls).toEqual([
      "https://mempool.space/api/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
      "https://blockstream.info/api/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
      "https://blockstream.info/api/address/1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb",
      "https://mempool.space/api/address/19ZewH8Kk1PDbSNdJ97FP4EiCjTRaZMZQA",
      "https://blockstream.info/api/address/19ZewH8Kk1PDbSNdJ97FP4EiCjTRaZMZQA",
    ]);
  });

  it("goes back to mempool.space as soon as Blockstream gets no answer through", async () => {
    let down = "https://mempool.space/";
    const urls = stubFetch((url) =>
      url.startsWith(down)
        ? Promise.reject(new TypeError("fetch failed"))
        : json({
            chain_stats: { funded_txo_sum: 1500, spent_txo_sum: 400 },
            mempool_stats: { funded_txo_sum: 0, spent_txo_sum: 0 },
          }),
    );

    await bits.balance(1);
    down = "https://blockstream.info/";
    await bits.balance(2);
    await bits.balance(3);

    expect(urls.slice(2)).toEqual([
      "https://blockstream.info/api/address/1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb",
      "https://mempool.space/api/address/1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb",
      "https://mempool.space/api/address/19ZewH8Kk1PDbSNdJ97FP4EiCjTRaZMZQA",
    ]);
  });

  it("names both hosts when the fallback fails too", async () => {
    stubFetch(() => Promise.reject(new TypeError("fetch failed")));

    const failure = bits.balance(1);

    await expect(failure).rejects.toBeInstanceOf(BalanceProviderError);
    await expect(failure).rejects.toThrow(
      /^Balance lookup failed: No response from mempool .*mempool\.space.*; then No response from blockstream .*blockstream\.info/u,
    );
  });

  it("keeps a rejected address and malformed data to the first provider", async () => {
    const urls = stubFetch(() => new Response("Invalid Bitcoin address", { status: 400 }));
    await expect(bits.balance(1)).rejects.toBeInstanceOf(InvalidAddressError);
    expect(urls).toHaveLength(1);

    urls.length = 0;
    stubFetch((url) => {
      urls.push(url);
      return json({ chain_stats: null, mempool_stats: {} });
    });
    await expect(bits.balance(1)).rejects.toBeInstanceOf(BalanceProviderError);
    expect(urls).toHaveLength(1);
  });

  it("asks no fallback when a baseUrl names the endpoint", async () => {
    const urls = stubFetch(() => Promise.reject(new TypeError("fetch failed")));

    await expect(bits.balance(1, { baseUrl: "https://example.test" })).rejects.toBeInstanceOf(
      BalanceProviderError,
    );
    expect(urls).toEqual(["https://example.test/api/address/1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"]);
  });

  it("leaves Litecoin with its one provider", async () => {
    const urls = stubFetch(() => Promise.reject(new TypeError("fetch failed")));

    await expect(zden.balance("litecoin-segwit")).rejects.toBeInstanceOf(BalanceProviderError);
    expect(urls).toHaveLength(1);
  });

  it("rejects unsupported chains without touching the network", async () => {
    const urls = stubFetch(() => json({}));
    const monero = puzzle({
      id: "test/monero",
      chain: "monero",
      address: standard(
        "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
      ),
      sourceUrl: "https://example.com",
      startedAt: "2020-01-01 00:00:00",
    });

    await expect(monero.balance()).rejects.toThrow("Unsupported balance chain: monero");
    await expect(monero.balance()).rejects.toBeInstanceOf(UnsupportedChainError);
    expect(urls).toEqual([]);
  });

  it("reads an Ethereum balance through Blockscout when there is no key", async () => {
    const urls = stubFetch(() => json({ coin_balance: "1234567890123456789" }));

    const balance = await ethereum.balance();

    expect(urls).toEqual([
      "https://eth.blockscout.com/api/v2/addresses/0x0000000000000000000000000000000000000000",
    ]);
    expect(balance.confirmed).toBe(1234567890123456789n);
    expect(balance.unconfirmed).toBe(0n);
  });

  it("reads a Base balance through Blockscout and keeps any key away from it", async () => {
    const base = puzzle({
      id: "test/base",
      chain: "base",
      address: standard("0x0000000000000000000000000000000000000000"),
      sourceUrl: "https://example.com",
      startedAt: "2025-01-17 00:00:00",
    });
    const urls = stubFetch(() => json({ coin_balance: "552000000000000000" }));

    const balance = await base.balance({ apiKey: "etherscan-key" });

    /* Etherscan V2 serves Base only on paid plans, so a key does not move the lookup there. */
    expect(urls).toEqual([
      "https://base.blockscout.com/api/v2/addresses/0x0000000000000000000000000000000000000000",
    ]);
    expect(balance.confirmed).toBe(552000000000000000n);
    expect(balance.decimals).toBe(18);
  });

  it("adds the escrow's balance to the target's", async () => {
    const escrowed = puzzle({
      id: "test/escrowed",
      chain: "ethereum",
      address: standard("0x0000000000000000000000000000000000000000"),
      escrow: standard("0x0000000000000000000000000000000000000001"),
      sourceUrl: "https://example.com",
      startedAt: "2025-01-10 18:56:07",
    });
    const urls = stubFetch((url) =>
      json({ coin_balance: url.endsWith("0001") ? "553000000000000000" : "6404376568548341" }),
    );

    const balance = await escrowed.balance();

    expect(urls.toSorted()).toEqual([
      "https://eth.blockscout.com/api/v2/addresses/0x0000000000000000000000000000000000000000",
      "https://eth.blockscout.com/api/v2/addresses/0x0000000000000000000000000000000000000001",
    ]);
    expect(balance.confirmed).toBe(559404376568548341n);
  });

  it("fails the whole lookup when the escrow fails, instead of printing half the prize", async () => {
    const escrowed = puzzle({
      id: "test/escrowed",
      chain: "ethereum",
      address: standard("0x0000000000000000000000000000000000000000"),
      escrow: standard("0x0000000000000000000000000000000000000001"),
      sourceUrl: "https://example.com",
      startedAt: "2025-01-10 18:56:07",
    });
    stubFetch((url) =>
      url.endsWith("0001") ? json({ message: "down" }, 503) : json({ coin_balance: "5" }),
    );

    await expect(escrowed.balance()).rejects.toBeInstanceOf(BalanceProviderError);
  });

  it("takes an empty key as no key", async () => {
    const urls = stubFetch(() => json({ coin_balance: null }));

    const balance = await ethereum.balance({ apiKey: "" });

    expect(urls[0]).toMatch(/^https:\/\/eth\.blockscout\.com\//u);
    expect(balance.confirmed).toBe(0n);
  });

  it("sends a keyless Ethereum lookup to the given base URL", async () => {
    const urls = stubFetch(() => json({ coin_balance: "5" }));

    await ethereum.balance({ baseUrl: "https://blockscout.example.test" });

    expect(urls).toEqual([
      "https://blockscout.example.test/api/v2/addresses/0x0000000000000000000000000000000000000000",
    ]);
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

describe("balanceTool", () => {
  /* Registering a fixture mutates the registry, so it runs on a fresh module graph. */
  afterAll(() => {
    vi.resetModules();
  });

  /* The tools load the dataset lazily, so the fixture joins the same fresh graph they read. */
  async function cashTools(): Promise<typeof Tools> {
    vi.resetModules();
    const lib: typeof Library = await import("../../src/index.ts");
    const tools: typeof Tools = await import("../../src/tool-operations.ts");
    lib.registerCollection(
      new lib.NamedCollection("fixture", lib.party("Fixture"), [
        lib.puzzle({ ...bitcoinCash, id: "fixture/cash" }),
      ]),
    );
    return tools;
  }

  it("names the coin, as puzzles balance does", async () => {
    const tools = await cashTools();
    stubFetch(() => blockchairAddress());

    const result = await tools.balanceTool("fixture/cash");

    expect(result.content[0]?.text).toBe("fixture/cash: 0 BCH");
  });

  it("sends ETHERSCAN_API_KEY to Ethereum only, never to Blockchair", async () => {
    const tools = await cashTools();
    vi.stubEnv("ETHERSCAN_API_KEY", "etherscan-secret");
    vi.stubEnv("BLOCKCHAIR_API_KEY", undefined);
    const urls = stubFetch(() => blockchairAddress());

    await tools.balanceTool("fixture/cash");

    expect(urls).toHaveLength(1);
    expect(urls[0]).not.toContain("etherscan-secret");
  });

  it("passes BLOCKCHAIR_API_KEY as the key, so an echo of it is redacted", async () => {
    const tools = await cashTools();
    vi.stubEnv("BLOCKCHAIR_API_KEY", "blockchair-secret");
    const urls = stubFetch(() =>
      json({ data: null, context: { code: 402, error: "bad key blockchair-secret" } }, 402),
    );

    const failure = tools.balanceTool("fixture/cash");

    await expect(failure).rejects.toThrow("REDACTED");
    await expect(failure).rejects.not.toThrow("blockchair-secret");
    expect(urls[0]).toContain("key=blockchair-secret");
  });

  it("reads doges-gambit/doge with BLOCKCHAIR_API_KEY and answers in DOGE", async () => {
    vi.resetModules();
    const tools: typeof Tools = await import("../../src/tool-operations.ts");
    vi.stubEnv("BLOCKCHAIR_API_KEY", "blockchair-secret");
    const urls = stubFetch(() =>
      json({
        data: { DRMqy4bGAnWpaShBFtTUoHEiBWj4HoiSfq: { address: { balance: 0 } } },
        context: { state: 6397254 },
      }),
    );

    const result = await tools.balanceTool("doges-gambit/doge");

    expect(result.content[0]?.text).toBe("doges-gambit/doge: 0 DOGE");
    expect(urls).toHaveLength(1);
    expect(urls[0]).toContain("/dogecoin/dashboards/address/DRMqy4bGAnWpaShBFtTUoHEiBWj4HoiSfq");
    expect(urls[0]).toContain("key=blockchair-secret");
  });
});
