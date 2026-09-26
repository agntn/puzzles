import { setTimeout as sleep } from "node:timers/promises";

/*
 * Loaded with `node --import` into a CLI child, which a test cannot stub from the outside. Every
 * address answers a funded Esplora record, except the one in `PUZZLES_FETCH_FAIL`, whose requests
 * fail the way an unreachable host does, at mempool.space and at Blockstream alike. Every URL is
 * logged to stderr in request order, and a request sent while another is still open is logged as
 * `overlap`.
 */
const failing = process.env["PUZZLES_FETCH_FAIL"];
let open = 0;

globalThis.fetch = async (input: unknown) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : String(input);
  process.stderr.write(open > 0 ? `overlap ${url}\n` : `fetch ${url}\n`);
  open += 1;
  await sleep(20);
  open -= 1;
  if (failing !== undefined && url.endsWith(`/${failing}`)) {
    throw new TypeError("fetch failed");
  }
  return new Response(
    JSON.stringify({
      chain_stats: { funded_txo_sum: 1500, spent_txo_sum: 400 },
      mempool_stats: { funded_txo_sum: 0, spent_txo_sum: 0 },
    }),
    { headers: { "content-type": "application/json" } },
  );
};
