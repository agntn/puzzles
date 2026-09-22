import {
  BalanceError,
  chainSymbol,
  PuzzleNotFoundError,
  requirePuzzle,
  UnsupportedChainError,
} from "@agntn/puzzles";

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
 * every explorer sees one caller. Answers are cached five minutes per puzzle. An explorer failure
 * is a 502 with the library's own message.
 *
 * @param {import("h3").H3Event} event - The request, with the puzzle id in its path.
 * @returns {Promise<BalanceAnswer>} The balance in base units and whole units.
 */
export default defineCachedEventHandler(
  async (event): Promise<BalanceAnswer> => {
    const config = useRuntimeConfig(event);
    let puzzle;
    try {
      puzzle = await requirePuzzle(decodeId(getRouterParam(event, "id") ?? ""));
    } catch (error) {
      if (error instanceof PuzzleNotFoundError) {
        throw createError({
          statusCode: 404,
          statusMessage: "Unknown puzzle",
          message: error.message,
        });
      }
      throw error;
    }
    try {
      const balance = await puzzle.balance({
        apiKey: config.etherscanApiKey === "" ? undefined : config.etherscanApiKey,
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
          statusCode: 422,
          statusMessage: "No provider",
          message: error.message,
        });
      }
      if (error instanceof BalanceError) {
        throw createError({ statusCode: 502, statusMessage: error.name, message: error.message });
      }
      throw error;
    }
  },
  {
    maxAge: 300,
    swr: true,
    getKey: (event) => `balance:${getRouterParam(event, "id") ?? ""}`,
  },
);
