import { describe, expect, it } from "vite-plus/test";
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
      ids: ["warp/challenge-2", "warp/challenge-3"],
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

  it("narrows to one chain, across collections and together with the other filters", async () => {
    const chain = await listTool({ chain: "ethereum" });
    const narrowed = await listTool({ chain: "ethereum", status: "solved" });
    const crossed = await listTool({ chain: "ethereum", collection: "b1000" });

    expect(chain.details).toMatchObject({
      matched: 12,
      returned: 12,
      ids: [
        "arweave/weave7",
        "arweave/weave9",
        "arweave/weave11",
        "arweave/weave13",
        "mineshop",
        "teikhos/0",
        "teikhos/1",
        "teikhos/2",
        "teikhos/3",
        "teikhos/4",
        "zden/xixoio",
        "zden/codex-protocol",
      ],
    });
    expect(narrowed.details["ids"]).toEqual(["teikhos/4", "zden/xixoio", "zden/codex-protocol"]);
    expect(crossed.details).toMatchObject({ matched: 0, returned: 0, ids: [] });
  });

  it("finds the puzzle behind an address, whatever case it arrives in", async () => {
    const base58 = await listTool({ address: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH" });
    const checksummed = await listTool({ address: "0x5D663791E869Ca70C71E0A5F4cfD707f596265aa" });
    const shouted = await listTool({ address: "BC1Q94ECSN0QK8LAP2GEFRYCNMS3RUEPY889Z969A6" });

    expect(base58.details).toMatchObject({ matched: 1, returned: 1, ids: ["b1000/1"] });
    expect(checksummed.details["ids"]).toEqual(["zden/xixoio"]);
    expect(shouted.details["ids"]).toEqual(["movie-enigma"]);
    expect(base58.content[0]?.text).toContain("1 matching puzzles");
  });

  it("answers an address no puzzle pays to with an empty page, not an error", async () => {
    const stranger = await listTool({
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    });
    const recased = await listTool({ address: "1bggz9tcn4rm9kbzdn7kprqz87sz26samh" });

    expect(stranger.details).toMatchObject({ matched: 0, returned: 0, ids: [] });
    expect(stranger.content[0]?.text).toContain("(none)");
    expect(recased.details["ids"]).toEqual([]);
  });

  it("combines the address with the other filters instead of overriding them", async () => {
    const wrongChain = await listTool({
      address: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
      chain: "ethereum",
    });
    const rightCollection = await listTool({
      address: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
      collection: "b1000",
    });

    expect(wrongChain.details).toMatchObject({ matched: 0, ids: [] });
    expect(rightCollection.details["ids"]).toEqual(["b1000/1"]);
  });

  it.each([-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid offset %s even without host validation",
    async (offset) => {
      await expect(listTool({ collection: "gsmg", offset })).rejects.toThrow(/offset/);
    },
  );
});
