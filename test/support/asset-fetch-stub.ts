import { readFileSync } from "node:fs";

/*
 * Loaded with `node --import` for `assets --live`: `PUZZLES_ASSET_REPLY` is `file:<path>`,
 * `status:<code>` or `error`, and every URL is logged to stderr.
 */
const reply = process.env["PUZZLES_ASSET_REPLY"] ?? "error";

globalThis.fetch = async (input: unknown) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : String(input);
  process.stderr.write(`fetch ${url}\n`);
  if (reply.startsWith("file:")) {
    return new Response(readFileSync(reply.slice("file:".length)));
  }
  if (reply.startsWith("status:")) {
    return new Response(null, { status: Number(reply.slice("status:".length)) });
  }
  throw new TypeError("fetch failed");
};
