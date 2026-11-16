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

  it("keeps the GIF thread's 63 distinct comments and expanded method spoiler", () => {
    const markdown = readFileSync(
      path.join(root, "iamabananaamaa/iamabananaamaa-2013-12-22.md"),
      "utf8",
    );
    const ids = [...markdown.matchAll(/^\*\*.+, \[(\w+)\]\(/gm)].map((match) => match[1]);
    expect(ids).toHaveLength(63);
    expect(new Set(ids).size).toBe(63);
    expect(markdown.match(/^> \[deleted\]$/gm)).toHaveLength(6);
    expect(ids).toContain("ce82k33");
    expect(ids).toContain("ce84vn6");
    const method = markdown.split("[ce86ejm]")[1]?.split("\n**")[0];
    expect(method).toContain("images can be 'merged' with ZIP/RAR files");
    expect(method).toContain("a file called MEGAN.txt, with a string inside of it");
    expect(method).toContain("referring to MEGAN-35, a kind of hash");
    expect(method).toContain("which turned out to be an ATOM-128 hash");
    expect(method).toContain("When decrypted, it gave you the private key!");
    expect(markdown).not.toContain("](#s ");
  });

  it("hands the GIF thread archive to its puzzle, not the neighboring Caesar puzzle", async () => {
    const file = "iamabananaamaa/iamabananaamaa-2013-12-22";
    const gif = await requirePuzzle("iamabananaamaa/gif");
    const caesar = await requirePuzzle("iamabananaamaa/caesar");
    const collection = await requireCollection(gif.collection());
    expect(citedArchivedSources(gif, collection).map(({ source }) => source.file)).toContain(file);
    expect(citedArchivedSources(caesar, collection).map(({ source }) => source.file)).not.toContain(
      file,
    );
  });

  it("keeps the Wickex thread's 29 comments without inventing the missing key", () => {
    const markdown = readFileSync(path.join(root, "wickex/wickex-2013-12-23.md"), "utf8");
    const ids = [...markdown.matchAll(/^\*\*.+, \[(\w+)\]\(/gm)].map((match) => match[1]);
    expect(ids).toHaveLength(29);
    expect(new Set(ids).size).toBe(29);
    expect(markdown.match(/^> \[deleted\]$/gm)).toHaveLength(4);
    expect(markdown).toContain("STI...I5Z");
    const method = markdown.split("[ce87ss1]")[1]?.split("\n**")[0];
    expect(method).toContain("Hex -> Text -> Youtube URL");
    expect(method).toContain("loaded the Youtube video into Audacity");
    expect(method).toContain("loaded into Sonic Visualiser");
    expect(method).toContain("That string in Brainwallet.org was the private key.");
  });

  it("hands the Wickex thread archive to its puzzle without adding a private key", async () => {
    const puzzle = await requirePuzzle("wickex/youtube");
    const collection = await requireCollection(puzzle.collection());
    expect(citedArchivedSources(puzzle, collection).map(({ source }) => source.file)).toContain(
      "wickex/wickex-2013-12-23",
    );
    expect(puzzle.toJSON()).not.toHaveProperty("key");
  });

  it("exposes Wickex's four published steps without filling the missing secrets", async () => {
    const puzzle = await requirePuzzle("wickex/youtube");
    const stages = puzzle.toJSON().stages;
    const method = "https://www.reddit.com/r/bitcoinpuzzles/comments/1ti0uw/comment/ce87ss1/";
    expect(stages?.map(({ name }) => name)).toEqual([
      "Hex",
      "Morse",
      "Second video",
      "Brainwallet.org",
    ]);
    expect(stages?.map(({ answer }) => answer?.text)).toEqual([
      "Hex -> Text -> Youtube URL",
      "I personally loaded the Youtube video into Audacity to make it more clear, but it was morse code -> text.",
      "That was a bit.ly which went to the second video. That video was loaded into Sonic Visualiser and that had a string encoded into the sound.",
      "That string in Brainwallet.org was the private key.",
    ]);
    expect(stages?.map(({ answer }) => [answer?.source, answer?.date])).toEqual(
      Array.from({ length: 4 }, () => [method, "2013-12-23"]),
    );
    expect(stages?.map(({ techniques }) => techniques ?? [])).toEqual([
      [],
      [{ name: "morse", source: method }],
      [{ name: "steganography", source: method }],
      [{ name: "sha256-brainwallet", source: method }],
    ]);
    expect(stages?.flatMap(({ artifacts }) => artifacts.map(({ url }) => url))).toEqual([
      puzzle.sourceUrl(),
      "https://www.reddit.com/r/bitcoinpuzzles/comments/1ti0uw/comment/ce86ukc/",
      "https://www.reddit.com/r/bitcoinpuzzles/comments/1ti0uw/comment/ce86v8h/",
      "https://www.reddit.com/r/bitcoinpuzzles/comments/1ti0uw/comment/ce86xa9/",
    ]);
    expect(puzzle.toJSON()).not.toHaveProperty("key");
  });

  it("anchors Wickex's stage answers and artifacts in the thread archive", async () => {
    const puzzle = await requirePuzzle("wickex/youtube");
    const archive = readFileSync(path.join(root, "wickex/wickex-2013-12-23.md"), "utf8");
    const publishedMethod = archive.split("[ce87ss1]")[1]?.split("\n**")[0];
    expect(puzzle.stages()).toHaveLength(4);
    for (const entry of puzzle.stages()) {
      expect(publishedMethod).toContain(entry.answer?.text);
      expect(archive).toContain(entry.answer?.source);
      for (const item of entry.artifacts) {
        expect(archive).toContain(item.url);
      }
    }
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
