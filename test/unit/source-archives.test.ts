import { createHash } from "node:crypto";
import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { datasetCollections } from "../../src/core/dataset.ts";

const root = path.resolve(import.meta.dirname, "../../assets/sources");
const tweetPattern = /https:\/\/(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/g;

const sources = [
  [
    "ballet/bobbyclee-2020-07-31",
    "1289004702122643456",
    "bobbyclee",
    "2020-07-31",
    "2020-07-31T01:33:27Z",
    "confirmed",
  ],
  [
    "bitimage/aantonop-2015-05-27",
    "603701870482300928",
    "aantonop",
    "2015-05-27",
    "2017-09-28T12:09:11Z",
    "confirmed",
  ],
  [
    "zden/zd3n-2018-02-21",
    "966275899757879298",
    "Zd3N",
    "2018-02-21",
    "2025-08-18T09:49:58Z",
    "unverified",
  ],
  [
    "zden/zd3n-2018-12-24",
    "1077146640090316800",
    "Zd3N",
    "2018-12-24",
    "2022-01-29T18:39:39Z",
    "confirmed",
  ],
] as const;

describe("archived source tweets", () => {
  it.each(sources)(
    "keeps provenance and the screenshot for %s",
    (file, id, author, date, archiveDate, archiveContent) => {
      const markdown = readFileSync(path.join(root, `${file}.md`), "utf8");
      const screenshot = readFileSync(path.join(root, `${file}.png`));
      const digest = createHash("sha256").update(screenshot).digest("hex");
      const published = new Date(Number((BigInt(id) >> 22n) + 1288834974657n));
      expect(published.toISOString().slice(0, 10)).toBe(date);
      expect(markdown).toContain(`url: https://x.com/${author}/status/${id}\n`);
      expect(markdown).toContain(`author: "@${author}"\n`);
      expect(markdown).toContain(`date: "${date}"\n`);
      expect(markdown).toMatch(/^archived: "\d{4}-\d{2}-\d{2}"$/m);
      const timestamp = archiveDate.replaceAll(/\D/g, "");
      const archiveUrl = `https://web.archive.org/web/${timestamp}/https://twitter.com/${author}/status/${id}`;
      expect(markdown).toContain(`archive_url: ${archiveUrl}\n`);
      expect(markdown).toContain(`archive_date: "${archiveDate}"\n`);
      expect(markdown).toContain(`archive_content: ${archiveContent}\n`);
      expect(markdown).toContain(`](${archiveUrl})`);
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
      return markdown.match(/^url: https:\/\/x\.com\/\w+\/status\/(\d+)$/m)?.[1];
    });
    expect(files).toHaveLength(sources.length);
    expect(archived).not.toContain(undefined);
    expect(new Set(archived).size).toBe(files.length);
    for (const id of referenced) {
      expect(archived).toContain(id);
    }
  });
});
