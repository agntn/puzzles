import { describe, expect, it } from "vitest";
import { listTool } from "../../src/tool-operations.ts";

const nextPage = "Next page: offset=50. Keep the same filters.";

describe("puzzle list pagination", () => {
  it("keeps the default first page and tells the model where to continue", async () => {
    const result = await listTool({ collection: "b1000" });

    expect(result.details).toEqual({
      matched: 256,
      returned: 50,
      offset: 0,
      nextOffset: 50,
      ids: Array.from({ length: 50 }, (_, index) => `b1000/${index + 1}`),
    });
    expect(result.content[0]?.text).toMatch(/^50 of 256 matching puzzles:/);
    expect(result.content[0]?.text.endsWith(nextPage)).toBe(true);
  });

  it("walks every record once without growing the page size", async () => {
    const ids: unknown[] = [];
    for (let offset = 0; offset < 256; offset += 50) {
      const result = await listTool({ collection: "b1000", offset, limit: 50 });
      const pageIds = result.details["ids"];
      expect(Array.isArray(pageIds)).toBe(true);
      if (Array.isArray(pageIds)) {
        for (const id of pageIds) ids.push(id);
      }
      expect(result.details["nextOffset"]).toBe(offset < 250 ? offset + 50 : undefined);
      expect(result.content[0]?.text.includes("Next page:")).toBe(offset < 250);
    }
    expect(ids).toEqual(Array.from({ length: 256 }, (_, index) => `b1000/${index + 1}`));
  });

  it("applies the offset after every filter, including a collection alias", async () => {
    const result = await listTool({
      collection: "warpwallet",
      status: "solved",
      withPubkey: true,
      offset: 1,
      limit: 2,
    });
    expect(result.details).toEqual({
      matched: 4,
      returned: 2,
      offset: 1,
      nextOffset: 3,
      ids: ["warp/challenge_2", "warp/challenge_3"],
    });
    expect(result.content[0]?.text).toMatch(/^2 of 4 matching puzzles \(offset 1\):/);
    expect(result.content[0]?.text).toContain("Next page: offset=3. Keep the same filters.");
  });

  it.each([1, 2, Number.MAX_SAFE_INTEGER])("ends cleanly at offset %s", async (offset) => {
    const result = await listTool({ collection: "gsmg", offset });
    expect(result.details).toEqual({ matched: 1, returned: 0, offset, ids: [] });
    expect(result.content[0]?.text).toBe(`0 of 1 matching puzzles (offset ${offset}):\n(none)`);
  });

  it("has no continuation for an empty filter or a complete first page", async () => {
    const empty = await listTool({ collection: "gsmg", status: "solved" });
    const complete = await listTool({ collection: "gsmg" });
    expect(empty.details).toEqual({ matched: 0, returned: 0, offset: 0, ids: [] });
    expect(empty.content[0]?.text).toBe("0 matching puzzles:\n(none)");
    expect(complete.details).toEqual({ matched: 1, returned: 1, offset: 0, ids: ["gsmg"] });
    expect(complete.content[0]?.text).not.toContain("Next page:");
  });

  it.each([-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid offset %s even without host validation",
    async (offset) => {
      await expect(listTool({ collection: "gsmg", offset })).rejects.toThrow(/offset/);
    },
  );
});
