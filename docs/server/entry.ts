import preset from "nitropack/presets/cloudflare/runtime/cloudflare-module";

/** What this file needs from the preset's worker, whose types want `@cloudflare/workers-types`. */
interface Worker {
  fetch(request: Request, env: unknown, context: unknown): Promise<Response>;
}

const worker = preset as unknown as Worker;

/** A missing file is a moment, not a fact. No 404 keeps its path's year-long `immutable`. */
export default {
  ...worker,
  /**
   * The preset's handler, with `no-store` on a failed answer that the asset rules marked immutable.
   *
   * @param {Request} request - The incoming request.
   * @param {unknown} env - The worker's bindings.
   * @param {unknown} context - The execution context.
   * @returns {Promise<Response>} The answer, safe for the Workers Cache to keep.
   */
  async fetch(request: Request, env: unknown, context: unknown): Promise<Response> {
    const response = await worker.fetch(request, env, context);
    if (response.status < 400 || !response.headers.get("cache-control")?.includes("immutable")) {
      return response;
    }
    const miss = new Response(response.body, response);
    miss.headers.set("cache-control", "no-store");
    return miss;
  },
};
