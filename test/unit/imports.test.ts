import { describe, expect, it } from "vite-plus/test";
import { inLine, once } from "../../src/core/imports.ts";

describe("lazy imports", () => {
  it("starts the next import only after the one before it settles", async () => {
    const order: string[] = [];
    const { promise: slow, resolve } = Promise.withResolvers<string>();
    const first = inLine(async () => {
      order.push("first started");
      return slow;
    });
    const second = inLine(async () => {
      order.push("second started");
      return "second";
    });

    await Promise.resolve();
    expect(order).toEqual(["first started"]);
    resolve("first");
    expect(await Promise.all([first, second])).toEqual(["first", "second"]);
    expect(order).toEqual(["first started", "second started"]);
  });

  it("shares one load between callers and retries after a failure", async () => {
    let calls = 0;
    const load = once(async () => {
      calls += 1;
      if (calls === 1) {
        throw new Error("transient");
      }
      return calls;
    });

    await expect(Promise.all([load(), load()])).rejects.toThrow("transient");
    expect(await Promise.all([load(), load()])).toEqual([2, 2]);
    expect(calls).toBe(2);
  });
});
