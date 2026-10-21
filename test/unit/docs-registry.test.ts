import { describe, expect, it } from "vite-plus/test";
import { registryCounts, registryText, registryView } from "../../docs/shared/registry.ts";
import { all, collections, Status } from "../../src/index.ts";

describe("registry app rows", () => {
  it("lists every puzzle once, the largest collection first, with the site's title", async () => {
    const view = registryView(await collections(), [
      { key: "bits", title: "Bitcoin puzzle transaction" },
    ]);
    const puzzles = await all();

    expect(view.collections.flatMap((row) => row.puzzles.map((puzzle) => puzzle.id))).toEqual(
      expect.arrayContaining(puzzles.map((puzzle) => puzzle.id())),
    );
    expect(view.collections.reduce((sum, row) => sum + row.puzzles.length, 0)).toBe(puzzles.length);
    const sizes = view.collections.map((row) => row.puzzles.length);
    expect(sizes).toEqual(sizes.toSorted((a, b) => b - a));

    const bits = view.collections.find((row) => row.key === "bits");
    expect(bits?.title).toBe("Bitcoin puzzle transaction");
    expect(bits?.puzzles.find((puzzle) => puzzle.id === "bits/71")).toEqual({
      id: "bits/71",
      name: "71",
      status: Status.Unsolved,
      prize: expect.stringMatching(/^[\d.]+ BTC$/u) as unknown,
    });
    const untitled = view.collections.find((row) => row.key !== "bits");
    expect(untitled?.title).toBe(untitled?.key);
  });

  it("hands the model the totals and leaves the rows to the app", async () => {
    const view = registryView(await collections(), []);
    const puzzles = await all();
    const counts = registryCounts(view);

    expect(counts).toEqual({
      collections: (await collections()).length,
      puzzles: puzzles.length,
      open: puzzles.filter((puzzle) => puzzle.status() === Status.Unsolved).length,
    });
    expect(registryText(counts)).toBe(
      `The registry is open for the user: ${counts.collections} collections, ${counts.puzzles} puzzles, ${counts.open} still unsolved. To read one record, call puzzles_show.`,
    );
  });
});
