import { createHash } from "node:crypto";
import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  archivedSourceCapture,
  citedArchivedSources,
  archivedSources as sources,
  archivedSourceUrl as sourceUrl,
} from "../../src/core/archived-sources.ts";
import { all, datasetCollections, requirePuzzle } from "../../src/core/dataset.ts";
import { requireCollection } from "../../src/core/registry.ts";

const root = path.resolve(import.meta.dirname, "../../assets/sources");
const tweetPattern = /https:\/\/(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/g;

describe("archived sources", () => {
  it.each(sources.map((source) => [source.file, source] as const))(
    "keeps provenance and the screenshot for %s",
    (file, source) => {
      const markdown = readFileSync(path.join(root, `${file}.md`), "utf8");
      const screenshot = readFileSync(path.join(root, `${file}.png`));
      const digest = createHash("sha256").update(screenshot).digest("hex");
      if ("tweet" in source) {
        /* A tweet dates itself: the ID carries the publication time. */
        const published = new Date(Number((BigInt(source.tweet) >> 22n) + 1288834974657n));
        expect(published.toISOString().slice(0, 10)).toBe(source.date);
      }
      expect(markdown).toContain(`url: ${sourceUrl(source)}\n`);
      expect(markdown).toContain(
        `author: "${"tweet" in source ? `@${source.author}` : source.author}"\n`,
      );
      expect(markdown).toContain(`date: "${source.date}"\n`);
      expect(markdown).toMatch(/^archived: "\d{4}-\d{2}-\d{2}"$/m);
      if (!("archive" in source)) {
        /* No capture exists: the entry names the archives it searched instead of inventing one. */
        expect(markdown).not.toContain("archive_");
        expect(markdown).toContain("No capture found.");
      } else {
        const capture = archivedSourceCapture(source);
        expect(capture).toContain(`/web/${source.archive.date.replaceAll(/\D/g, "")}/`);
        expect(markdown).toContain(`archive_url: ${capture}\n`);
        expect(markdown).toContain(`archive_date: "${source.archive.date}"\n`);
        expect(markdown).toContain(`archive_content: ${source.archive.content}\n`);
        expect(markdown).toContain(`](${capture})`);
      }
      expect(markdown).toContain(`screenshot_sha256: ${digest}\n`);
      expect(markdown).toContain(`](${path.basename(file)}.png)`);
      expect(markdown).toMatch(/## Transcript\n\n> /);
      expect(screenshot.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(screenshot.readUInt32BE(16)).toBeGreaterThan(0);
      expect(screenshot.readUInt32BE(20)).toBeGreaterThan(0);
    },
  );

  it("covers every tweet referenced by the collection records", async () => {
    const records = JSON.stringify(await datasetCollections());
    const referenced = new Set([...records.matchAll(tweetPattern)].map((match) => match[1]));
    const files = globSync("*/*.md", { cwd: root });
    const archived = files.map((file) => {
      const markdown = readFileSync(path.join(root, file), "utf8");
      return markdown.match(/^url: (\S+)$/m)?.[1];
    });
    expect(files).toHaveLength(sources.length);
    expect(archived).not.toContain(undefined);
    expect(new Set(archived).size).toBe(files.length);
    const tweets = archived.map((url) => url?.match(/^https:\/\/x\.com\/\w+\/status\/(\d+)$/)?.[1]);
    for (const id of referenced) {
      expect(tweets).toContain(id);
    }
  });

  it("hands every copy to a puzzle that cites its page", async () => {
    const reached = new Set<string>();
    for (const puzzle of await all()) {
      const collection = await requireCollection(puzzle.collection());
      for (const { source } of citedArchivedSources(puzzle, collection)) {
        reached.add(source.file);
      }
    }

    expect(sources.map((source) => source.file).filter((file) => !reached.has(file))).toEqual([]);
  });

  it("matches the URL a record cites, not a page whose URL starts with it", async () => {
    const puzzle = await requirePuzzle("satoshi-birthday-quiz");
    const files = citedArchivedSources(puzzle, await requireCollection(puzzle.collection())).map(
      ({ citedBy, source }) => `${citedBy} ${source.file}`,
    );

    /* The author's comment URL starts with the block 18 thread's, which only quizchain/18 cites. */
    expect(files).toContain("author satoshi-birthday-quiz/aoinakamoto-2019-04-10-ekjcc1k");
    expect(files).not.toContain("puzzle quizchain/aoinakamoto-2019-04-10-bbij0e");
    expect(files).not.toContain("author quizchain/aoinakamoto-2019-04-10-bbij0e");
  });
});
