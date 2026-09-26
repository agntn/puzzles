import { createHash } from "node:crypto";
import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { datasetCollections } from "../../src/core/dataset.ts";

const root = path.resolve(import.meta.dirname, "../../assets/sources");
const tweetPattern = /https:\/\/(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/g;

/**
 * One archived source per entry. A tweet gives its ID and the handle, and the URL, the publication
 * date and the Wayback URL all follow from those. Anything else gives its own URL and, when a
 * capture exists, that capture's URL, because no other page's archive address is derivable.
 */
const sources = [
  {
    file: "ballet/bobbyclee-2020-07-31",
    tweet: "1289004702122643456",
    author: "bobbyclee",
    date: "2020-07-31",
    archive: { date: "2020-07-31T01:33:27Z", content: "confirmed" },
  },
  {
    file: "bitimage/aantonop-2015-05-27",
    tweet: "603701870482300928",
    author: "aantonop",
    date: "2015-05-27",
    archive: { date: "2017-09-28T12:09:11Z", content: "confirmed" },
  },
  {
    file: "zden/zd3n-2018-02-21",
    tweet: "966275899757879298",
    author: "Zd3N",
    date: "2018-02-21",
  },
  {
    file: "zden/zd3n-2018-12-24",
    tweet: "1077146640090316800",
    author: "Zd3N",
    date: "2018-12-24",
    archive: { date: "2022-01-29T18:39:39Z", content: "confirmed" },
  },
  {
    file: "genesis/caesrcd-2026-08-22",
    tweet: "2090997418800095526",
    author: "caesrcd",
    date: "2026-08-22",
  },
  {
    file: "movie_enigma/cryptop1r4t3-2022-03-21",
    tweet: "1505915271118262286",
    author: "cryptop1r4t3",
    date: "2022-03-21",
  },
  {
    file: "arweave/arpoxy-2019-11-10",
    tweet: "1193546824289832960",
    author: "Arpoxy",
    date: "2019-11-10",
  },
  {
    file: "dug/0xflorent-2026-05-31",
    tweet: "2061070356564091258",
    author: "0xFlorent_",
    date: "2026-05-31",
  },
  {
    file: "dug/0xflorent-2026-06-21",
    tweet: "2068735759889145906",
    author: "0xFlorent_",
    date: "2026-06-21",
  },
  {
    file: "book_quiz/aoinakamoto-2019-04-06",
    url: "https://www.reddit.com/r/YangForPresidentHQ/comments/b9zg9p/7_million_book_quiz_challenge_to_this_subreddit/",
    author: "u/AoiNakamoto",
    date: "2019-04-06",
    archive: {
      url: "https://web.archive.org/web/20230611183532/https://old.reddit.com/r/YangForPresidentHQ/comments/b9zg9p/7_million_book_quiz_challenge_to_this_subreddit/",
      date: "2023-06-11T18:35:32Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-07",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bacd6l/easy_7_mbtc_quizchain_experiment/",
    author: "u/AoiNakamoto",
    date: "2019-04-07",
    archive: {
      url: "https://web.archive.org/web/20230611083439/https://old.reddit.com/r/bitcoinpuzzles/comments/bacd6l/easy_7_mbtc_quizchain_experiment/",
      date: "2023-06-11T08:34:39Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-07-badtpz",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/badtpz/easy_7_mbtc_quizchain_block_2/",
    author: "u/AoiNakamoto",
    date: "2019-04-07",
    archive: {
      url: "https://web.archive.org/web/20230611110306/https://old.reddit.com/r/bitcoinpuzzles/comments/badtpz/easy_7_mbtc_quizchain_block_2/",
      date: "2023-06-11T11:03:06Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-07-bae43s",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bae43s/easy_7_mbtc_quizchain_block_3/",
    author: "u/AoiNakamoto",
    date: "2019-04-07",
    archive: {
      url: "https://web.archive.org/web/20230611090018/https://old.reddit.com/r/bitcoinpuzzles/comments/bae43s/easy_7_mbtc_quizchain_block_3/",
      date: "2023-06-11T09:00:18Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-07-baejeg",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/baejeg/medium_7_mbtc_quizchain_block_4/",
    author: "u/AoiNakamoto",
    date: "2019-04-07",
    archive: {
      url: "https://web.archive.org/web/20230611095721/https://old.reddit.com/r/bitcoinpuzzles/comments/baejeg/medium_7_mbtc_quizchain_block_4/",
      date: "2023-06-11T09:57:21Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-07-baf89m",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/baf89m/easy_7_mbtc_quizchain_block_5/",
    author: "u/AoiNakamoto",
    date: "2019-04-07",
    archive: {
      url: "https://web.archive.org/web/20230611162510/https://old.reddit.com/r/bitcoinpuzzles/comments/baf89m/easy_7_mbtc_quizchain_block_5/",
      date: "2023-06-11T16:25:10Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-07-bafyoo",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bafyoo/hard_7_mbtc_quizchain_block_6/",
    author: "u/AoiNakamoto",
    date: "2019-04-07",
    archive: {
      url: "https://web.archive.org/web/20230610213329/https://old.reddit.com/r/bitcoinpuzzles/comments/bafyoo/hard_7_mbtc_quizchain_block_6/",
      date: "2023-06-10T21:33:29Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-08-baok2v",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/baok2v/medium_77_mbtc_quizchain_block_lucky_7/",
    author: "u/AoiNakamoto",
    date: "2019-04-08",
    archive: {
      url: "https://web.archive.org/web/20230612105659/https://old.reddit.com/r/bitcoinpuzzles/comments/baok2v/medium_77_mbtc_quizchain_block_lucky_7/",
      date: "2023-06-12T10:56:59Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-08-bar0ty",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bar0ty/very_easy_7_mbtc_quizchain_block_8/",
    author: "u/AoiNakamoto",
    date: "2019-04-08",
    archive: {
      url: "https://web.archive.org/web/20230616152136/https://old.reddit.com/r/bitcoinpuzzles/comments/bar0ty/very_easy_7_mbtc_quizchain_block_8/",
      date: "2023-06-16T15:21:36Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-08-baswxz",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/baswxz/easy_7_mbtc_quizchain_block_9/",
    author: "u/AoiNakamoto",
    date: "2019-04-08",
    archive: {
      url: "https://web.archive.org/web/20230611152622/https://old.reddit.com/r/bitcoinpuzzles/comments/baswxz/easy_7_mbtc_quizchain_block_9/",
      date: "2023-06-11T15:26:22Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-09-bb1ajr",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bb1ajr/easy_7_mbtc_quizchain_block_10/",
    author: "u/AoiNakamoto",
    date: "2019-04-09",
  },
  {
    file: "iamabananaamaa/iamabananaamaa-2013-12-23",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/1ticec/medium_1mbtc_riddle_me_this_for_a_private_key/",
    author: "u/IAMABananaAMAA",
    date: "2013-12-23",
    archive: {
      url: "https://web.archive.org/web/20230531170758/https://old.reddit.com/r/bitcoinpuzzles/comments/1ticec/medium_1mbtc_riddle_me_this_for_a_private_key/",
      date: "2023-05-31T17:07:58Z",
      content: "confirmed",
    },
  },
  {
    file: "satoshi_birthday_quiz/aoinakamoto-2019-04-05",
    url: "https://www.reddit.com/r/Bitcoin/comments/b9peum/satoshi_birthday_7_million_quiz/",
    author: "u/AoiNakamoto",
    date: "2019-04-05",
    archive: {
      url: "https://web.archive.org/web/20230611180546/https://old.reddit.com/r/Bitcoin/comments/b9peum/satoshi_birthday_7_million_quiz/",
      date: "2023-06-11T18:05:46Z",
      content: "confirmed",
    },
  },
  {
    file: "satoshi_birthday_quiz/aoinakamoto-2019-04-05-b9l37o",
    url: "https://www.reddit.com/r/Bitcoin/comments/b9l37o/",
    author: "u/AoiNakamoto",
    date: "2019-04-05",
  },
  {
    file: "satoshi_birthday_quiz/aoinakamoto-2019-04-10-ekjcc1k",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbij0e/meidum_7_mbtc_quizchain_block_18/ekjcc1k/",
    author: "u/AoiNakamoto",
    date: "2019-04-10",
  },
  {
    file: "mini/retiredcoder-2024-10-14",
    url: "https://bitcointalk.org/index.php?topic=5513047",
    author: "RetiredCoder",
    date: "2024-10-14",
    archive: {
      url: "https://web.archive.org/web/20250830144758/https://bitcointalk.org/index.php?topic=5513047",
      date: "2025-08-30T14:47:58Z",
      content: "confirmed",
    },
  },
  {
    file: "mini/retiredcoder-2024-11-14",
    url: "https://bitcointalk.org/index.php?topic=5518896",
    author: "RetiredCoder",
    date: "2024-11-14",
    archive: {
      url: "https://web.archive.org/web/20250830143820/https://bitcointalk.org/index.php?topic=5518896",
      date: "2025-08-30T14:38:20Z",
      content: "confirmed",
    },
  },
  {
    file: "mini/retiredcoder-2024-12-14",
    url: "https://bitcointalk.org/index.php?topic=5522785",
    author: "RetiredCoder",
    date: "2024-12-14",
    archive: {
      url: "https://web.archive.org/web/20260925214004/https://bitcointalk.org/index.php?topic=5522785.0",
      date: "2026-09-25T21:40:04Z",
      content: "confirmed",
    },
  },
] as const;

type Source = (typeof sources)[number];
type ArchivedSource = Extract<Source, { archive: { date: string } }>;

/**
 * The URL the entry archives: a tweet's `x.com` address, or the URL the entry carries itself.
 *
 * @param {Source} source - The archived source.
 * @returns {string} The original URL.
 */
function sourceUrl(source: Source): string {
  return "tweet" in source ? `https://x.com/${source.author}/status/${source.tweet}` : source.url;
}

/**
 * The capture the entry links. A tweet's Wayback address follows from its ID and the capture
 * timestamp; any other page carries the capture URL on the entry.
 *
 * @param {ArchivedSource} source - A source with a capture.
 * @returns {string} The capture URL.
 */
function archiveUrl(source: ArchivedSource): string {
  const timestamp = source.archive.date.replaceAll(/\D/g, "");
  return "tweet" in source
    ? `https://web.archive.org/web/${timestamp}/https://twitter.com/${source.author}/status/${source.tweet}`
    : source.archive.url;
}

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
        const capture = archiveUrl(source);
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

  it("archives a source the records actually cite", async () => {
    const records = JSON.stringify(await datasetCollections());
    for (const source of sources.filter((entry) => !("tweet" in entry))) {
      expect(records).toContain(sourceUrl(source));
    }
  });
});
