import { describe, expect, it } from "vitest";
import { collectionWindow } from "../../docs/app/utils/flow.ts";
import { listCommandLine } from "../../docs/app/utils/format.ts";
import { collectionKeys } from "../../src/index.ts";

describe("hero collection window", () => {
  it.each([1, 7, 13, 100])(
    "keeps every active collection in a bounded window of %i keys",
    (count) => {
      const keys = Array.from({ length: count }, (_, index) => `collection_${index}`);
      for (const active of keys) {
        const visible = collectionWindow(keys, active);
        expect(visible.keys).toContain(active);
        expect(visible.keys).toHaveLength(Math.min(7, count));
      }
    },
  );

  it.each([
    [0, 0],
    [1, 0],
    [3, 0],
    [4, 1],
    [6, 3],
    [9, 6],
    [12, 6],
  ])("places active row %i in the window starting at %i", (active, expectedStart) => {
    const keys = Array.from({ length: 13 }, (_, index) => `collection_${index}`);
    expect(collectionWindow(keys, keys[active]!)).toEqual({
      start: expectedStart,
      keys: keys.slice(expectedStart, expectedStart + 7),
    });
  });

  it("shows the current manifest through the last collection instead of truncating it", () => {
    const keys = collectionKeys();
    const visible = collectionWindow(keys, keys.at(-1)!);
    expect(visible.start).toBe(keys.length - 7);
    expect(visible.keys).toEqual(keys.slice(-7));
  });

  it("handles an empty manifest or a stale active key", () => {
    expect(collectionWindow([], "missing")).toEqual({ start: 0, keys: [] });
    expect(collectionWindow(["one", "two"], "missing")).toEqual({ start: 0, keys: ["one", "two"] });
  });
});

describe("playground CLI line", () => {
  it("carries every list argument the tool call carries", () => {
    expect(
      listCommandLine({ collection: "b1000", status: "unsolved", withPubkey: true, limit: "50" }),
    ).toBe("puzzles list b1000 --status unsolved --with-pubkey --limit 50");
  });

  it("leaves out what the form does not set", () => {
    expect(listCommandLine({ collection: "", status: "", withPubkey: false, limit: "" })).toBe(
      "puzzles list",
    );
  });

  it("quotes a collection key that is not a plain word", () => {
    expect(
      listCommandLine({ collection: "a key", status: "", withPubkey: false, limit: " 5 " }),
    ).toBe("puzzles list 'a key' --limit 5");
  });
});
