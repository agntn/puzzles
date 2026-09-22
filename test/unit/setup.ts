import { afterEach, beforeEach, vi } from "vite-plus/test";

/* Unit tests never reach the network. A provider call without a stub fails here. Live roundtrips live in test/live. */
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("Unexpected network request in unit test");
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});
