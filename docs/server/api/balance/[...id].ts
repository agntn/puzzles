import {
  BalanceError,
  chainSymbol,
  PuzzleNotFoundError,
  requirePuzzle,
  UnsupportedChainError,
} from "@agntn/puzzles";
import { defineCachedFunction } from "nitropack/runtime";
import {
  createError,
  defineEventHandler,
  getRouterParam,
  type RequestEvent,
  useRuntimeConfig,
} from "nuxt/server";

/** Seconds a balance stays cached per puzzle, in Nitro and in the header alike. */
const TTL = 300;

/** What the pages render: base units as strings, the whole-unit amount as a decimal string. */
export interface BalanceAnswer {
  readonly id: string;
  readonly chain: string;
  readonly symbol: string;
  readonly confirmed: string;
  readonly unconfirmed: string;
  readonly decimals: number;
  readonly amount: string;
  readonly fetchedAt: string;
}

/**
 * The puzzle identifier from the path. A malformed percent sequence is not a puzzle either,
 * so it takes the same 404 as an unknown identifier instead of a 500 from `URIError`.
 *
 * @param {string} raw - The catch-all route parameter as the router matched it.
 * @returns {string} The decoded identifier, or the raw text when it does not decode.
 */
function decodeId(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * The one network call on this site, made by the worker so the Etherscan key stays a secret and
 * every explorer sees one caller. An explorer failure is a 502 with the library's own message.
 *
 * @param {RequestEvent} _event - For Nitro, which refreshes a stale entry in its `waitUntil`.
 * @param {string} id - The puzzle identifier, decoded.
 * @returns {Promise<BalanceAnswer>} The balance in base units and whole units.
 */
const balanceOf = defineCachedFunction(
  async (_event: RequestEvent, id: string): Promise<BalanceAnswer> => {
    const config = useRuntimeConfig();
    let puzzle;
    try {
      puzzle = await requirePuzzle(id);
    } catch (error) {
      if (error instanceof PuzzleNotFoundError) {
        throw createError({
          status: 404,
          statusText: "Unknown puzzle",
          message: error.message,
        });
      }
      throw error;
    }
    try {
      // The secret is Etherscan's, so no other explorer sees it.
      const etherscan = puzzle.chain() === "ethereum" && config.etherscanApiKey !== "";
      const balance = await puzzle.balance({
        apiKey: etherscan ? config.etherscanApiKey : undefined,
        timeout: 20_000,
      });
      return {
        id: puzzle.id(),
        chain: balance.chain,
        symbol: chainSymbol(balance.chain),
        confirmed: balance.confirmed.toString(),
        unconfirmed: balance.unconfirmed.toString(),
        decimals: balance.decimals,
        amount: balance.totalAmount(),
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof UnsupportedChainError) {
        throw createError({
          status: 422,
          statusText: "No provider",
          message: error.message,
        });
      }
      if (error instanceof BalanceError) {
        throw createError({ status: 502, statusText: error.name, message: error.message });
      }
      throw error;
    }
  },
  { name: "balance", maxAge: TTL, swr: true, getKey: (_event, id) => id },
);

/**
 * The cached balance, with a `Cache-Control` that lets shared caches keep it as long as Nitro does.
 *
 * @param {RequestEvent} event - The request, with the puzzle id in its path.
 * @returns {Promise<BalanceAnswer>} The balance in base units and whole units.
 */
export default defineEventHandler(async (event): Promise<BalanceAnswer> => {
  const balance = await balanceOf(event, decodeId(getRouterParam(event, "id") ?? ""));
  event.res.headers.set("Cache-Control", `s-maxage=${TTL}, stale-while-revalidate`);
  return balance;
});
