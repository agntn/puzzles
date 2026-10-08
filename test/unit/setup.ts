import { afterEach, beforeEach, vi } from "vite-plus/test";
import { forgetFailedHosts } from "../../src/core/providers.ts";

/* Unit tests never reach the network. A provider call without a stub fails here. Live roundtrips live in test/live. */
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("Unexpected network request in unit test");
    }),
  );
});

/* A test that sent mempool.space to the bench would hand Blockstream the next test's first read. */
afterEach(() => {
  vi.unstubAllGlobals();
  forgetFailedHosts();
});
