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
    archive: { date: "2026-08-22T03:00:08Z", content: "confirmed" },
  },
  {
    file: "genesis/caesrcd-2026-09-05",
    tweet: "2096052655449657713",
    author: "caesrcd",
    date: "2026-09-05",
    archive: { date: "2026-09-05T01:47:50Z", content: "confirmed" },
  },
  {
    file: "genesis/caesrcd-2026-09-10",
    tweet: "2098071674205712636",
    author: "caesrcd",
    date: "2026-09-10",
    archive: { date: "2026-09-10T15:30:42Z", content: "confirmed" },
  },
  {
    file: "genesis/caesrcd-2026-09-18",
    tweet: "2100944026774151611",
    author: "caesrcd",
    date: "2026-09-18",
    archive: { date: "2026-09-18T13:44:24Z", content: "confirmed" },
  },
  {
    file: "genesis/caesrcd-2026-09-24",
    tweet: "2103192783779750018",
    author: "caesrcd",
    date: "2026-09-24",
    archive: { date: "2026-09-24T18:40:09Z", content: "confirmed" },
  },
  {
    file: "movie-enigma/cryptop1r4t3-2022-03-21",
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
    file: "teikhos/0xflorent-2026-06-21",
    tweet: "2068735759889145906",
    author: "0xFlorent_",
    date: "2026-06-21",
  },
  {
    file: "proof-of-writing/caincurrency-2026-04-14",
    tweet: "2043911484040740939",
    author: "caincurrency",
    date: "2026-04-14",
    archive: { date: "2026-04-14T04:37:26Z", content: "confirmed" },
  },
  {
    file: "proof-of-writing/oritwoen-2026-08-27-2092957918186316275",
    tweet: "2092957918186316275",
    author: "oritwoen",
    date: "2026-08-27",
    archive: { date: "2026-08-27T12:50:27Z", content: "confirmed" },
  },
  {
    file: "proof-of-writing/oritwoen-2026-08-27-2093029042454671607",
    tweet: "2093029042454671607",
    author: "oritwoen",
    date: "2026-08-27",
    archive: { date: "2026-08-27T17:33:04Z", content: "confirmed" },
  },
  {
    file: "bitaddress/q-2023-10-06",
    url: "https://stacker.news/items/275973",
    author: "q",
    date: "2023-10-06",
    archive: {
      url: "https://web.archive.org/web/20260211205609/https://stacker.news/items/275973",
      date: "2026-02-11T20:56:09Z",
      content: "confirmed",
    },
  },
  {
    file: "doges-gambit/cryptopuzzlers-2020-12-11",
    url: "https://www.reddit.com/r/dogecoin/comments/kbcptp/10000_doge_reward_new_cryptocurrency_video_puzzle/",
    author: "u/CryptoPuzzlers",
    date: "2020-12-11",
    archive: {
      url: "https://web.archive.org/web/20230621100631/https://old.reddit.com/r/dogecoin/comments/kbcptp/10000_doge_reward_new_cryptocurrency_video_puzzle/",
      date: "2023-06-21T10:06:31Z",
      content: "confirmed",
    },
  },
  {
    file: "doges-gambit/cryptopuzzlers-2021-01-29",
    url: "https://www.reddit.com/r/dogecoin/comments/l7foig/400_unsolved_dogecoin_video_puzzle_10000_doge/",
    author: "u/CryptoPuzzlers",
    date: "2021-01-29",
    archive: {
      url: "https://web.archive.org/web/20260929192844/https://www.reddit.com/r/dogecoin/comments/l7foig/400_unsolved_dogecoin_video_puzzle_10000_doge/",
      date: "2026-09-29T19:28:44Z",
      content: "confirmed",
    },
  },
  {
    file: "powerful-moss/logicbeach-2025-01-17-page",
    url: "https://logicbeach.xyz/powerfulmoss",
    author: "LogicBeach",
    date: "2025-01-17",
    archive: {
      url: "https://web.archive.org/web/20250303003748/https://logicbeach.xyz/powerfulmoss",
      date: "2025-03-03T00:37:48Z",
      content: "confirmed",
    },
  },
  {
    file: "powerful-moss/logicbeach-2024-03-26",
    url: "https://farcaster.xyz/logic-beach/0x79eeff14",
    author: "logic-beach",
    date: "2024-03-26",
  },
  {
    file: "powerful-moss/logicbeach-2024-04-14-0x0a3431a4",
    url: "https://farcaster.xyz/logic-beach/0x0a3431a4",
    author: "logic-beach",
    date: "2024-04-14",
  },
  {
    file: "powerful-moss/logicbeach-2024-04-14-0x7e781ad1",
    url: "https://farcaster.xyz/logic-beach/0x7e781ad1",
    author: "logic-beach",
    date: "2024-04-14",
  },
  {
    file: "powerful-moss/logicbeach-2024-09-02",
    url: "https://farcaster.xyz/logic-beach/0x6ac613af",
    author: "logic-beach",
    date: "2024-09-02",
  },
  {
    file: "powerful-moss/logicbeach-2025-01-17-0x57ab427d",
    url: "https://farcaster.xyz/logic-beach/0x57ab427d",
    author: "logic-beach",
    date: "2025-01-17",
  },
  {
    file: "powerful-moss/logicbeach-2025-01-24",
    url: "https://farcaster.xyz/logic-beach/0x6179943b",
    author: "logic-beach",
    date: "2025-01-24",
  },
  {
    file: "trivia-brainwallet/kierkegaard-soren-2017-10-19",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/77g5h7/meta_new_puzzle_in_development_005_btc_eta_is/",
    author: "u/Kierkegaard_Soren",
    date: "2017-10-19",
    archive: {
      url: "https://web.archive.org/web/20230612132032/https://old.reddit.com/r/bitcoinpuzzles/comments/77g5h7/meta_new_puzzle_in_development_005_btc_eta_is/",
      date: "2023-06-12T13:20:32Z",
      content: "confirmed",
    },
  },
  {
    file: "trivia-brainwallet/kierkegaard-soren-2017-11-04",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/7asy51/brainwallet_puzzle_004_btc_reward/",
    author: "u/Kierkegaard_Soren",
    date: "2017-11-04",
    archive: {
      url: "https://web.archive.org/web/20230610055046/https://old.reddit.com/r/bitcoinpuzzles/comments/7asy51/brainwallet_puzzle_004_btc_reward/",
      date: "2023-06-10T05:50:46Z",
      content: "confirmed",
    },
  },
  {
    file: "book-quiz/aoinakamoto-2019-04-06",
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
    file: "quizchain/aoinakamoto-2019-04-09-bb2vwf",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bb2vwf/expert_7_mbtc_quizchain_block_11/",
    author: "u/AoiNakamoto",
    date: "2019-04-09",
    archive: {
      url: "https://web.archive.org/web/20230611182209/https://old.reddit.com/r/bitcoinpuzzles/comments/bb2vwf/expert_7_mbtc_quizchain_block_11/",
      date: "2023-06-11T18:22:09Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-09-bb3n8i",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bb3n8i/easy_7_mbtc_quizchain_block_12/",
    author: "u/AoiNakamoto",
    date: "2019-04-09",
    archive: {
      url: "https://web.archive.org/web/20230611074439/https://old.reddit.com/r/bitcoinpuzzles/comments/bb3n8i/easy_7_mbtc_quizchain_block_12/",
      date: "2023-06-11T07:44:39Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-09-bb4c7q",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bb4c7q/impossible_for_now_7mbtc_quizchain_unlucky_block/",
    author: "u/AoiNakamoto",
    date: "2019-04-09",
    archive: {
      url: "https://web.archive.org/web/20230611110221/https://old.reddit.com/r/bitcoinpuzzles/comments/bb4c7q/impossible_for_now_7mbtc_quizchain_unlucky_block/",
      date: "2023-06-11T11:02:21Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-09-bb4ifd",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bb4ifd/easy_7_mbtc_quizchain_block_14/",
    author: "u/AoiNakamoto",
    date: "2019-04-09",
    archive: {
      url: "https://web.archive.org/web/20230611112909/https://old.reddit.com/r/bitcoinpuzzles/comments/bb4ifd/easy_7_mbtc_quizchain_block_14/",
      date: "2023-06-11T11:29:09Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-09-bb7q8r",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bb7q8r/easy_7_mbtc_quizchain_block_15/",
    author: "u/AoiNakamoto",
    date: "2019-04-09",
    archive: {
      url: "https://web.archive.org/web/20230611171702/https://old.reddit.com/r/bitcoinpuzzles/comments/bb7q8r/easy_7_mbtc_quizchain_block_15/",
      date: "2023-06-11T17:17:02Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-09-bbeuye",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbeuye/medium_7_mbtc_quizchain_block_16/",
    author: "u/AoiNakamoto",
    date: "2019-04-09",
    archive: {
      url: "https://web.archive.org/web/20230611122311/https://old.reddit.com/r/bitcoinpuzzles/comments/bbeuye/medium_7_mbtc_quizchain_block_16/",
      date: "2023-06-11T12:23:11Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-09-bbf7cl",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbf7cl/expert_8_mbtc_quizchain_block_17/",
    author: "u/AoiNakamoto",
    date: "2019-04-09",
    archive: {
      url: "https://web.archive.org/web/20230611080338/https://old.reddit.com/r/bitcoinpuzzles/comments/bbf7cl/expert_8_mbtc_quizchain_block_17/",
      date: "2023-06-11T08:03:38Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-10-bbij0e",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbij0e/meidum_7_mbtc_quizchain_block_18/",
    author: "u/AoiNakamoto",
    date: "2019-04-10",
    archive: {
      url: "https://web.archive.org/web/20230611165401/https://old.reddit.com/r/bitcoinpuzzles/comments/bbij0e/meidum_7_mbtc_quizchain_block_18/",
      date: "2023-06-11T16:54:01Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-10-bbkh2q",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbkh2q/exceedingly_easy_7_mbtc_quizchain_block_19/",
    author: "u/AoiNakamoto",
    date: "2019-04-10",
    archive: {
      url: "https://web.archive.org/web/20230611164727/https://old.reddit.com/r/bitcoinpuzzles/comments/bbkh2q/exceedingly_easy_7_mbtc_quizchain_block_19/",
      date: "2023-06-11T16:47:27Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-10-bbl653",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbl653/medium_7_mbtc_quizchain_block_20/",
    author: "u/AoiNakamoto",
    date: "2019-04-10",
    archive: {
      url: "https://web.archive.org/web/20230611190051/https://old.reddit.com/r/bitcoinpuzzles/comments/bbl653/medium_7_mbtc_quizchain_block_20/",
      date: "2023-06-11T19:00:51Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-10-bbsqhh",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbsqhh/hard_7_mbtc_quizchain_block_21/",
    author: "u/AoiNakamoto",
    date: "2019-04-10",
    archive: {
      url: "https://web.archive.org/web/20230611155211/https://old.reddit.com/r/bitcoinpuzzles/comments/bbsqhh/hard_7_mbtc_quizchain_block_21/",
      date: "2023-06-11T15:52:11Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-11-bbukyu",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbukyu/easy_7_mbtc_quizchain_block_22/",
    author: "u/AoiNakamoto",
    date: "2019-04-11",
    archive: {
      url: "https://web.archive.org/web/20230611173058/https://old.reddit.com/r/bitcoinpuzzles/comments/bbukyu/easy_7_mbtc_quizchain_block_22/",
      date: "2023-06-11T17:30:58Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-11-bbv6er",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbv6er/impossible_now_easy_later_7_mbtc_quizchain_block/",
    author: "u/AoiNakamoto",
    date: "2019-04-11",
    archive: {
      url: "https://web.archive.org/web/20230611172247/https://old.reddit.com/r/bitcoinpuzzles/comments/bbv6er/impossible_now_easy_later_7_mbtc_quizchain_block/",
      date: "2023-06-11T17:22:47Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-11-bbw9s3",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbw9s3/easy_7_mbtc_quizchain_block_24/",
    author: "u/AoiNakamoto",
    date: "2019-04-11",
    archive: {
      url: "https://web.archive.org/web/20230611161057/https://old.reddit.com/r/bitcoinpuzzles/comments/bbw9s3/easy_7_mbtc_quizchain_block_24/",
      date: "2023-06-11T16:10:57Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-11-bbwl11",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbwl11/easy_7_mbtc_quizchain_block_25/",
    author: "u/AoiNakamoto",
    date: "2019-04-11",
    archive: {
      url: "https://web.archive.org/web/20230610220730/https://old.reddit.com/r/bitcoinpuzzles/comments/bbwl11/easy_7_mbtc_quizchain_block_25/",
      date: "2023-06-10T22:07:30Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-11-bbwswp",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbwswp/solved_before_posting_7_mbtc_quizchain_block_26/",
    author: "u/AoiNakamoto",
    date: "2019-04-11",
    archive: {
      url: "https://web.archive.org/web/20230611082916/https://old.reddit.com/r/bitcoinpuzzles/comments/bbwswp/solved_before_posting_7_mbtc_quizchain_block_26/",
      date: "2023-06-11T08:29:16Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-11-bbyxd4",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bbyxd4/medium_9_mbtc_quizchain_block_27/",
    author: "u/AoiNakamoto",
    date: "2019-04-11",
    archive: {
      url: "https://web.archive.org/web/20230611084219/https://old.reddit.com/r/bitcoinpuzzles/comments/bbyxd4/medium_9_mbtc_quizchain_block_27/",
      date: "2023-06-11T08:42:19Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-11-bc3l0m",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bc3l0m/hard_7mbtc_quizchain_block_28/",
    author: "u/AoiNakamoto",
    date: "2019-04-11",
    archive: {
      url: "https://web.archive.org/web/20230612111412/https://old.reddit.com/r/bitcoinpuzzles/comments/bc3l0m/hard_7mbtc_quizchain_block_28/",
      date: "2023-06-12T11:14:12Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-11-bc6rkn",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bc6rkn/easy_7_mbtc_quizchain_block_29/",
    author: "u/AoiNakamoto",
    date: "2019-04-11",
    archive: {
      url: "https://web.archive.org/web/20230611185506/https://old.reddit.com/r/bitcoinpuzzles/comments/bc6rkn/easy_7_mbtc_quizchain_block_29/",
      date: "2023-06-11T18:55:06Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-12-bcbxb2",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bcbxb2/hard_7_mbtc_quizchain_block_30/",
    author: "u/AoiNakamoto",
    date: "2019-04-12",
    archive: {
      url: "https://web.archive.org/web/20230611124159/https://old.reddit.com/r/bitcoinpuzzles/comments/bcbxb2/hard_7_mbtc_quizchain_block_30/",
      date: "2023-06-11T12:41:59Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-13-bckvv9",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bckvv9/easy_7_mbtc_quizchain_block_31/",
    author: "u/AoiNakamoto",
    date: "2019-04-13",
    archive: {
      url: "https://web.archive.org/web/20230611171015/https://old.reddit.com/r/bitcoinpuzzles/comments/bckvv9/easy_7_mbtc_quizchain_block_31/",
      date: "2023-06-11T17:10:15Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-13-bclsnu",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bclsnu/medium_7_mbtc_quizchain_block_32/",
    author: "u/AoiNakamoto",
    date: "2019-04-13",
    archive: {
      url: "https://web.archive.org/web/20230611082156/https://old.reddit.com/r/bitcoinpuzzles/comments/bclsnu/medium_7_mbtc_quizchain_block_32/",
      date: "2023-06-11T08:21:56Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-13-bcmgqi",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bcmgqi/medium_7_mbtc_quizchain_block_33/",
    author: "u/AoiNakamoto",
    date: "2019-04-13",
    archive: {
      url: "https://web.archive.org/web/20230611095851/https://old.reddit.com/r/bitcoinpuzzles/comments/bcmgqi/medium_7_mbtc_quizchain_block_33/",
      date: "2023-06-11T09:58:51Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-24-bgttca",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bgttca/repost_of_quizchain_block_34/",
    author: "u/AoiNakamoto",
    date: "2019-04-24",
    archive: {
      url: "https://web.archive.org/web/20230611091152/https://old.reddit.com/r/bitcoinpuzzles/comments/bgttca/repost_of_quizchain_block_34/",
      date: "2023-06-11T09:11:52Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-13-bcouou",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bcouou/easy_7_mbtc_quizchain_block_35/",
    author: "u/AoiNakamoto",
    date: "2019-04-13",
    archive: {
      url: "https://web.archive.org/web/20230611075121/https://old.reddit.com/r/bitcoinpuzzles/comments/bcouou/easy_7_mbtc_quizchain_block_35/",
      date: "2023-06-11T07:51:21Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-14-bcx8ju",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bcx8ju/easy_7_mbtc_quizchain_block_36/",
    author: "u/AoiNakamoto",
    date: "2019-04-14",
    archive: {
      url: "https://web.archive.org/web/20230611170029/https://old.reddit.com/r/bitcoinpuzzles/comments/bcx8ju/easy_7_mbtc_quizchain_block_36/",
      date: "2023-06-11T17:00:29Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-14-bcykn2",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bcykn2/easy_7_mbtc_quizchain_block_37/",
    author: "u/AoiNakamoto",
    date: "2019-04-14",
    archive: {
      url: "https://web.archive.org/web/20230611103607/https://old.reddit.com/r/bitcoinpuzzles/comments/bcykn2/easy_7_mbtc_quizchain_block_37/",
      date: "2023-06-11T10:36:07Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-14-bd0hhv",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bd0hhv/easy_7_mbtc_quizchain_block_38/",
    author: "u/AoiNakamoto",
    date: "2019-04-14",
    archive: {
      url: "https://web.archive.org/web/20230611111753/https://old.reddit.com/r/bitcoinpuzzles/comments/bd0hhv/easy_7_mbtc_quizchain_block_38/",
      date: "2023-06-11T11:17:53Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-14-bd2p5c",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bd2p5c/7_mbtc_quizchain_block_39/",
    author: "u/AoiNakamoto",
    date: "2019-04-14",
    archive: {
      url: "https://web.archive.org/web/20230611092038/https://old.reddit.com/r/bitcoinpuzzles/comments/bd2p5c/7_mbtc_quizchain_block_39/",
      date: "2023-06-11T09:20:38Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-14-bd2ug5",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bd2ug5/7_mbtc_quizchain_block_40/",
    author: "u/AoiNakamoto",
    date: "2019-04-14",
    archive: {
      url: "https://web.archive.org/web/20230611163539/https://old.reddit.com/r/bitcoinpuzzles/comments/bd2ug5/7_mbtc_quizchain_block_40/",
      date: "2023-06-11T16:35:39Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-14-bd31hw",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bd31hw/7_mbtc_quizchain_block_41/",
    author: "u/AoiNakamoto",
    date: "2019-04-14",
    archive: {
      url: "https://web.archive.org/web/20230612123208/https://old.reddit.com/r/bitcoinpuzzles/comments/bd31hw/7_mbtc_quizchain_block_41/",
      date: "2023-06-12T12:32:08Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-15-bddbd5",
    url: "https://www.reddit.com/r/u_AoiNakamoto/comments/bddbd5/7_mbtc_quizchain_block_42/",
    author: "u/AoiNakamoto",
    date: "2019-04-15",
  },
  {
    file: "quizchain/aoinakamoto-2019-04-15-bddijl",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bddijl/7_mbtc_quizchain_block_43/",
    author: "u/AoiNakamoto",
    date: "2019-04-15",
    archive: {
      url: "https://web.archive.org/web/20230611154826/https://old.reddit.com/r/bitcoinpuzzles/comments/bddijl/7_mbtc_quizchain_block_43/",
      date: "2023-06-11T15:48:26Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-15-bddkxb",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bddkxb/7_mbtc_quizchain_block_44/",
    author: "u/AoiNakamoto",
    date: "2019-04-15",
    archive: {
      url: "https://web.archive.org/web/20230611125222/https://old.reddit.com/r/bitcoinpuzzles/comments/bddkxb/7_mbtc_quizchain_block_44/",
      date: "2023-06-11T12:52:22Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-16-bdrcj7",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bdrcj7/7_mbtc_7_mbtc_11_mbtc_quizchain_blocks_45_to_47/",
    author: "u/AoiNakamoto",
    date: "2019-04-16",
    archive: {
      url: "https://web.archive.org/web/20230611183838/https://old.reddit.com/r/bitcoinpuzzles/comments/bdrcj7/7_mbtc_7_mbtc_11_mbtc_quizchain_blocks_45_to_47/",
      date: "2023-06-11T18:38:38Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-18-bel75n",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bel75n/7_mbtc_7_mbtc_7_mbtc_quizchain_blocks_48_to_50/",
    author: "u/AoiNakamoto",
    date: "2019-04-18",
    archive: {
      url: "https://web.archive.org/web/20230611180656/https://old.reddit.com/r/bitcoinpuzzles/comments/bel75n/7_mbtc_7_mbtc_7_mbtc_quizchain_blocks_48_to_50/",
      date: "2023-06-11T18:06:56Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-19-bexc8c",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bexc8c/7_mbtc_quizchain_block_51/",
    author: "u/AoiNakamoto",
    date: "2019-04-19",
    archive: {
      url: "https://web.archive.org/web/20230611164614/https://old.reddit.com/r/bitcoinpuzzles/comments/bexc8c/7_mbtc_quizchain_block_51/",
      date: "2023-06-11T16:46:14Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-19-bexpni",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bexpni/7_mbtc_quizchain_block_52/",
    author: "u/AoiNakamoto",
    date: "2019-04-19",
    archive: {
      url: "https://web.archive.org/web/20230611101838/https://old.reddit.com/r/bitcoinpuzzles/comments/bexpni/7_mbtc_quizchain_block_52/",
      date: "2023-06-11T10:18:38Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-20-bf6fya",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bf6fya/7_mbtc_quizchain_block_53/",
    author: "u/AoiNakamoto",
    date: "2019-04-20",
    archive: {
      url: "https://web.archive.org/web/20230610215605/https://old.reddit.com/r/bitcoinpuzzles/comments/bf6fya/7_mbtc_quizchain_block_53/",
      date: "2023-06-10T21:56:05Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-20-bfckvs",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bfckvs/7_mbtc_quizchain_block_54_1_of_3/",
    author: "u/AoiNakamoto",
    date: "2019-04-20",
    archive: {
      url: "https://web.archive.org/web/20230611192202/https://old.reddit.com/r/bitcoinpuzzles/comments/bfckvs/7_mbtc_quizchain_block_54_1_of_3/",
      date: "2023-06-11T19:22:02Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-20-bfinky",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bfinky/7_mbtc_quizchain_block_55_2_of_3/",
    author: "u/AoiNakamoto",
    date: "2019-04-20",
    archive: {
      url: "https://web.archive.org/web/20230616161036/https://old.reddit.com/r/bitcoinpuzzles/comments/bfinky/7_mbtc_quizchain_block_55_2_of_3/",
      date: "2023-06-16T16:10:36Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-21-bfiy4t",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bfiy4t/7_mbtc_quizchain_block_56_3_of_3/",
    author: "u/AoiNakamoto",
    date: "2019-04-21",
    archive: {
      url: "https://web.archive.org/web/20230611100725/https://old.reddit.com/r/bitcoinpuzzles/comments/bfiy4t/7_mbtc_quizchain_block_56_3_of_3/",
      date: "2023-06-11T10:07:25Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-21-bfkdut",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bfkdut/extremely_hard_7mbtc_quizchain_block_57/",
    author: "u/AoiNakamoto",
    date: "2019-04-21",
    archive: {
      url: "https://web.archive.org/web/20230611103540/https://old.reddit.com/r/bitcoinpuzzles/comments/bfkdut/extremely_hard_7mbtc_quizchain_block_57/",
      date: "2023-06-11T10:35:40Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-22-bfz0oy",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bfz0oy/7_mbtc_quizchain_block_58/",
    author: "u/AoiNakamoto",
    date: "2019-04-22",
    archive: {
      url: "https://web.archive.org/web/20230611164054/https://old.reddit.com/r/bitcoinpuzzles/comments/bfz0oy/7_mbtc_quizchain_block_58/",
      date: "2023-06-11T16:40:54Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-22-bg96js",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bg96js/7_mbtc_quizchain_block_59/",
    author: "u/AoiNakamoto",
    date: "2019-04-22",
    archive: {
      url: "https://web.archive.org/web/20230619131554/https://old.reddit.com/r/bitcoinpuzzles/comments/bg96js/7_mbtc_quizchain_block_59/",
      date: "2023-06-19T13:15:54Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-23-bgboz8",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bgboz8/7_mbtc_blockchain_block_60/",
    author: "u/AoiNakamoto",
    date: "2019-04-23",
    archive: {
      url: "https://web.archive.org/web/20230611164836/https://old.reddit.com/r/bitcoinpuzzles/comments/bgboz8/7_mbtc_blockchain_block_60/",
      date: "2023-06-11T16:48:36Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-23-bgg9mx",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bgg9mx/7_mbtc_quizchain_block_61/",
    author: "u/AoiNakamoto",
    date: "2019-04-23",
    archive: {
      url: "https://web.archive.org/web/20230611091619/https://old.reddit.com/r/bitcoinpuzzles/comments/bgg9mx/7_mbtc_quizchain_block_61/",
      date: "2023-06-11T09:16:19Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-24-bgo23n",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bgo23n/7_mbtc_quizchain_block_62/",
    author: "u/AoiNakamoto",
    date: "2019-04-24",
    archive: {
      url: "https://web.archive.org/web/20230611071943/https://old.reddit.com/r/bitcoinpuzzles/comments/bgo23n/7_mbtc_quizchain_block_62/",
      date: "2023-06-11T07:19:43Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-24-bgqkw5",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bgqkw5/7_mbtc_quizchain_block_63/",
    author: "u/AoiNakamoto",
    date: "2019-04-24",
    archive: {
      url: "https://web.archive.org/web/20230611124903/https://old.reddit.com/r/bitcoinpuzzles/comments/bgqkw5/7_mbtc_quizchain_block_63/",
      date: "2023-06-11T12:49:03Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-25-bh52id",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bh52id/7_mbtc_quizchain_block_64/",
    author: "u/AoiNakamoto",
    date: "2019-04-25",
    archive: {
      url: "https://web.archive.org/web/20230612123614/https://old.reddit.com/r/bitcoinpuzzles/comments/bh52id/7_mbtc_quizchain_block_64/",
      date: "2023-06-12T12:36:14Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-26-bhloyj",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bhloyj/1_of_3_7_mbtc_quizchain_block_65/",
    author: "u/AoiNakamoto",
    date: "2019-04-26",
    archive: {
      url: "https://web.archive.org/web/20230611174311/https://old.reddit.com/r/bitcoinpuzzles/comments/bhloyj/1_of_3_7_mbtc_quizchain_block_65/",
      date: "2023-06-11T17:43:11Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-26-bhlpm2",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bhlpm2/2_of_3_7_mbtc_quizchain_block_66/",
    author: "u/AoiNakamoto",
    date: "2019-04-26",
    archive: {
      url: "https://web.archive.org/web/20230611073821/https://old.reddit.com/r/bitcoinpuzzles/comments/bhlpm2/2_of_3_7_mbtc_quizchain_block_66/",
      date: "2023-06-11T07:38:21Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-26-bhlq2i",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bhlq2i/3_of_3_67_mbtc_quizchain_block_67/",
    author: "u/AoiNakamoto",
    date: "2019-04-26",
    archive: {
      url: "https://web.archive.org/web/20230610214007/https://old.reddit.com/r/bitcoinpuzzles/comments/bhlq2i/3_of_3_67_mbtc_quizchain_block_67/",
      date: "2023-06-10T21:40:07Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-27-bi593l",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bi593l/7_mbtc_quizchain_block_68/",
    author: "u/AoiNakamoto",
    date: "2019-04-27",
    archive: {
      url: "https://web.archive.org/web/20230611154423/https://old.reddit.com/r/bitcoinpuzzles/comments/bi593l/7_mbtc_quizchain_block_68/",
      date: "2023-06-11T15:44:23Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-28-bi6n0l",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bi6n0l/7_mbtc_quizchain_block_69/",
    author: "u/AoiNakamoto",
    date: "2019-04-28",
    archive: {
      url: "https://web.archive.org/web/20230611183259/https://old.reddit.com/r/bitcoinpuzzles/comments/bi6n0l/7_mbtc_quizchain_block_69/",
      date: "2023-06-11T18:32:59Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-29-bilvsq",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bilvsq/7_mbtc_quizchain_block_70/",
    author: "u/AoiNakamoto",
    date: "2019-04-29",
    archive: {
      url: "https://web.archive.org/web/20230611081503/https://old.reddit.com/r/bitcoinpuzzles/comments/bilvsq/7_mbtc_quizchain_block_70/",
      date: "2023-06-11T08:15:03Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-30-biww11",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/biww11/8mbtc_quizchain_block_71/",
    author: "u/AoiNakamoto",
    date: "2019-04-30",
    archive: {
      url: "https://web.archive.org/web/20230611104725/https://old.reddit.com/r/bitcoinpuzzles/comments/biww11/8mbtc_quizchain_block_71/",
      date: "2023-06-11T10:47:25Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-04-30-bj25fm",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bj25fm/9_mbtc_quizchain_block_72/",
    author: "u/AoiNakamoto",
    date: "2019-04-30",
    archive: {
      url: "https://web.archive.org/web/20230611091415/https://old.reddit.com/r/bitcoinpuzzles/comments/bj25fm/9_mbtc_quizchain_block_72/",
      date: "2023-06-11T09:14:15Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-05-01-bjezpd",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bjezpd/10_mbtc_quizchain_block_73/",
    author: "u/AoiNakamoto",
    date: "2019-05-01",
    archive: {
      url: "https://web.archive.org/web/20230611113806/https://old.reddit.com/r/bitcoinpuzzles/comments/bjezpd/10_mbtc_quizchain_block_73/",
      date: "2023-06-11T11:38:06Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-05-01-bjnzi8",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bjnzi8/11_mbtc_quizchain_block_74/",
    author: "u/AoiNakamoto",
    date: "2019-05-01",
    archive: {
      url: "https://web.archive.org/web/20230611174331/https://old.reddit.com/r/bitcoinpuzzles/comments/bjnzi8/11_mbtc_quizchain_block_74/",
      date: "2023-06-11T17:43:31Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-05-03-bk2207",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bk2207/12_mbtc_quizchain_block_75/",
    author: "u/AoiNakamoto",
    date: "2019-05-03",
    archive: {
      url: "https://web.archive.org/web/20230610232913/https://old.reddit.com/r/bitcoinpuzzles/comments/bk2207/12_mbtc_quizchain_block_75/",
      date: "2023-06-10T23:29:13Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-05-03-bk27y7",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bk27y7/76_mbtc_quizchain_block_76/",
    author: "u/AoiNakamoto",
    date: "2019-05-03",
    archive: {
      url: "https://web.archive.org/web/20230611173532/https://old.reddit.com/r/bitcoinpuzzles/comments/bk27y7/76_mbtc_quizchain_block_76/",
      date: "2023-06-11T17:35:32Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain/aoinakamoto-2019-05-03-bkeggn",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bkeggn/77_mbtc_quizchain_block_77/",
    author: "u/AoiNakamoto",
    date: "2019-05-03",
    archive: {
      url: "https://web.archive.org/web/20230611172623/https://old.reddit.com/r/bitcoinpuzzles/comments/bkeggn/77_mbtc_quizchain_block_77/",
      date: "2023-06-11T17:26:23Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-11-bn5ucg",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bn5ucg/77_mbtc_quizchain2_block_1/",
    author: "u/AoiNakamoto",
    date: "2019-05-11",
    archive: {
      url: "https://web.archive.org/web/20230611191855/https://old.reddit.com/r/bitcoinpuzzles/comments/bn5ucg/77_mbtc_quizchain2_block_1/",
      date: "2023-06-11T19:18:55Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-12-bnj24w",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bnj24w/77_mbtc_quizchain2_block_2/",
    author: "u/AoiNakamoto",
    date: "2019-05-12",
    archive: {
      url: "https://web.archive.org/web/20230614212241/https://old.reddit.com/r/bitcoinpuzzles/comments/bnj24w/77_mbtc_quizchain2_block_2/",
      date: "2023-06-14T21:22:41Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-12-bnj8ew",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bnj8ew/7_mbtc_quizchain2_block_3/",
    author: "u/AoiNakamoto",
    date: "2019-05-12",
    archive: {
      url: "https://web.archive.org/web/20230611192249/https://old.reddit.com/r/bitcoinpuzzles/comments/bnj8ew/7_mbtc_quizchain2_block_3/",
      date: "2023-06-11T19:22:49Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-13-bo356q",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bo356q/7_mbtc_quizchain2_block_4/",
    author: "u/AoiNakamoto",
    date: "2019-05-13",
    archive: {
      url: "https://web.archive.org/web/20230612110845/https://old.reddit.com/r/bitcoinpuzzles/comments/bo356q/7_mbtc_quizchain2_block_4/",
      date: "2023-06-12T11:08:45Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-14-boil0p",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/boil0p/7_mbtc_quizchain2_block_5/",
    author: "u/AoiNakamoto",
    date: "2019-05-14",
    archive: {
      url: "https://web.archive.org/web/20230611190824/https://old.reddit.com/r/bitcoinpuzzles/comments/boil0p/7_mbtc_quizchain2_block_5/",
      date: "2023-06-11T19:08:24Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-15-boviny",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/boviny/7_mbtc_quizchain2_block_6/",
    author: "u/AoiNakamoto",
    date: "2019-05-15",
    archive: {
      url: "https://web.archive.org/web/20230611231414/https://old.reddit.com/r/bitcoinpuzzles/comments/boviny/7_mbtc_quizchain2_block_6/",
      date: "2023-06-11T23:14:14Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-16-bp8jlh",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bp8jlh/77_mbtc_quizchain2_block_7/",
    author: "u/AoiNakamoto",
    date: "2019-05-16",
    archive: {
      url: "https://web.archive.org/web/20230611194611/https://old.reddit.com/r/bitcoinpuzzles/comments/bp8jlh/77_mbtc_quizchain2_block_7/",
      date: "2023-06-11T19:46:11Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-16-bpjipk",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bpjipk/7_mbtc_quizchain2_block_8/",
    author: "u/AoiNakamoto",
    date: "2019-05-16",
    archive: {
      url: "https://web.archive.org/web/20230611211021/https://old.reddit.com/r/bitcoinpuzzles/comments/bpjipk/7_mbtc_quizchain2_block_8/",
      date: "2023-06-11T21:10:21Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-18-bq3ptu",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bq3ptu/14_mbtc_quizchain2_block_9/",
    author: "u/AoiNakamoto",
    date: "2019-05-18",
    archive: {
      url: "https://web.archive.org/web/20230611215947/https://old.reddit.com/r/bitcoinpuzzles/comments/bq3ptu/14_mbtc_quizchain2_block_9/",
      date: "2023-06-11T21:59:47Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-19-bqerv5",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bqerv5/7_mbtc_quizchain2_block_10/",
    author: "u/AoiNakamoto",
    date: "2019-05-19",
    archive: {
      url: "https://web.archive.org/web/20230611215917/https://old.reddit.com/r/bitcoinpuzzles/comments/bqerv5/7_mbtc_quizchain2_block_10/",
      date: "2023-06-11T21:59:17Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-20-bqqiot",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/bqqiot/7_mbtc_quizchain2_block_11/",
    author: "u/AoiNakamoto",
    date: "2019-05-20",
    archive: {
      url: "https://web.archive.org/web/20230611193159/https://old.reddit.com/r/bitcoinpuzzles/comments/bqqiot/7_mbtc_quizchain2_block_11/",
      date: "2023-06-11T19:31:59Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-20-br2rys",
    url: "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/7_mbtc_quizchain2_block_12/",
    author: "u/AoiNakamoto",
    date: "2019-05-20",
    archive: {
      url: "https://web.archive.org/web/20230611175459/https://old.reddit.com/r/bitcoinpuzzles/comments/br2rys/7_mbtc_quizchain2_block_12/",
      date: "2023-06-11T17:54:59Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-22-brogvu",
    url: "https://www.reddit.com/r/Grycoin/comments/brogvu/7_mbtc_quizchain2_block_13/",
    author: "u/AoiNakamoto",
    date: "2019-05-22",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-23-bs06rg",
    url: "https://www.reddit.com/r/Grycoin/comments/bs06rg/77_mbtc_quizchain2_block_14/",
    author: "u/AoiNakamoto",
    date: "2019-05-23",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-24-bscc8b",
    url: "https://www.reddit.com/r/Grycoin/comments/bscc8b/7_mbtc_quizchain2_block_15/",
    author: "u/AoiNakamoto",
    date: "2019-05-24",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-24-bsccmw",
    url: "https://www.reddit.com/r/Grycoin/comments/bsccmw/7_mbtc_quizchain_2_block_16/",
    author: "u/AoiNakamoto",
    date: "2019-05-24",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-24-bsnke3",
    url: "https://www.reddit.com/r/Grycoin/comments/bsnke3/7_mbtc_quizchain2_block_17/",
    author: "u/AoiNakamoto",
    date: "2019-05-24",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-26-bt7mfm",
    url: "https://www.reddit.com/r/Grycoin/comments/bt7mfm/7_mbtc_quizchain2_block_18/",
    author: "u/AoiNakamoto",
    date: "2019-05-26",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-27-btjb8j",
    url: "https://www.reddit.com/r/Grycoin/comments/btjb8j/7_mbtc_quizchain2_block_19/",
    author: "u/AoiNakamoto",
    date: "2019-05-27",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-28-btveri",
    url: "https://www.reddit.com/r/Grycoin/comments/btveri/7_mbtc_quizchain2_block_20/",
    author: "u/AoiNakamoto",
    date: "2019-05-28",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-28-bu6umc",
    url: "https://www.reddit.com/r/Grycoin/comments/bu6umc/7_mbtc_quizchain2_block_21/",
    author: "u/AoiNakamoto",
    date: "2019-05-28",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-30-busqnm",
    url: "https://www.reddit.com/r/Grycoin/comments/busqnm/prize_claimed_before_posting_quizchain2_block_22/",
    author: "u/AoiNakamoto",
    date: "2019-05-30",
    archive: {
      url: "https://web.archive.org/web/20200731175657/https://www.reddit.com/r/Grycoin/comments/busqnm/prize_claimed_before_posting_quizchain2_block_22/eph2ffl/",
      date: "2020-07-31T17:56:57Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-30-bustcu",
    url: "https://www.reddit.com/r/Grycoin/comments/bustcu/7_mbtc_quizchain2_block_23/",
    author: "u/AoiNakamoto",
    date: "2019-05-30",
  },
  {
    file: "quizchain2/aoinakamoto-2019-05-31-bv4rd2",
    url: "https://www.reddit.com/r/Grycoin/comments/bv4rd2/7_mbtc_quizchain2_block_24/",
    author: "u/AoiNakamoto",
    date: "2019-05-31",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-01-bvgsn7",
    url: "https://www.reddit.com/r/Grycoin/comments/bvgsn7/7_mbtc_quizchain2_block_25/",
    author: "u/AoiNakamoto",
    date: "2019-06-01",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-01-bvqrlr",
    url: "https://www.reddit.com/r/Grycoin/comments/bvqrlr/7_mbtc_quizchain2_block_26/",
    author: "u/AoiNakamoto",
    date: "2019-06-01",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-03-bwaepa",
    url: "https://www.reddit.com/r/Grycoin/comments/bwaepa/9_mbtc_quizchain2_block_27/",
    author: "u/AoiNakamoto",
    date: "2019-06-03",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-04-bwm5hb",
    url: "https://www.reddit.com/r/Grycoin/comments/bwm5hb/7_mbtc_quizchain2_block_28/",
    author: "u/AoiNakamoto",
    date: "2019-06-04",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-05-bwya8s",
    url: "https://www.reddit.com/r/Grycoin/comments/bwya8s/7_mbtc_quizchain2_block_29/",
    author: "u/AoiNakamoto",
    date: "2019-06-05",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-05-bx97d0",
    url: "https://www.reddit.com/r/Grycoin/comments/bx97d0/7_mbtc_quizchain2_block_30/",
    author: "u/AoiNakamoto",
    date: "2019-06-05",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-07-bxuciq",
    url: "https://www.reddit.com/r/Grycoin/comments/bxuciq/7_mbtc_quizchain2_block_31/",
    author: "u/AoiNakamoto",
    date: "2019-06-07",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-08-by5p2x",
    url: "https://www.reddit.com/r/Grycoin/comments/by5p2x/7_mbtc_quizchain2_block_32/",
    author: "u/AoiNakamoto",
    date: "2019-06-08",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-09-bygeur",
    url: "https://www.reddit.com/r/Grycoin/comments/bygeur/7_mbtc_quizchain2_block_33/",
    author: "u/AoiNakamoto",
    date: "2019-06-09",
    archive: {
      url: "https://web.archive.org/web/20200728191135/https://www.reddit.com/r/Grycoin/comments/bygeur/7_mbtc_quizchain2_block_33/eqqstj0/",
      date: "2020-07-28T19:11:35Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-09-byqc7s",
    url: "https://www.reddit.com/r/Grycoin/comments/byqc7s/7_mbtc_quizchain2_block_34/",
    author: "u/AoiNakamoto",
    date: "2019-06-09",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-11-bzc5ed",
    url: "https://www.reddit.com/r/Grycoin/comments/bzc5ed/7_mbtc_quizchain2_block_35/",
    author: "u/AoiNakamoto",
    date: "2019-06-11",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-12-bzodlf",
    url: "https://www.reddit.com/r/Grycoin/comments/bzodlf/7_mbtc_quizchain2_block_36/",
    author: "u/AoiNakamoto",
    date: "2019-06-12",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-13-c012gd",
    url: "https://www.reddit.com/r/Grycoin/comments/c012gd/10_mbtc_quizchain2_block_37/",
    author: "u/AoiNakamoto",
    date: "2019-06-13",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-13-c0cq0b",
    url: "https://www.reddit.com/r/Grycoin/comments/c0cq0b/7_mbtc_quizchain2_block_38/",
    author: "u/AoiNakamoto",
    date: "2019-06-13",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-15-c0x0r5",
    url: "https://www.reddit.com/r/Grycoin/comments/c0x0r5/7_mbtc_quizchain2_block_39/",
    author: "u/AoiNakamoto",
    date: "2019-06-15",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-16-c19m8f",
    url: "https://www.reddit.com/r/Grycoin/comments/c19m8f/7_mbtc_quizchain2_block_40/",
    author: "u/AoiNakamoto",
    date: "2019-06-16",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-17-c1kuxd",
    url: "https://www.reddit.com/r/Grycoin/comments/c1kuxd/7_mbtc_quizchain2_block_41/",
    author: "u/AoiNakamoto",
    date: "2019-06-17",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-18-c1xhjo",
    url: "https://www.reddit.com/r/Grycoin/comments/c1xhjo/7_mbtc_quizchain2_block_42/",
    author: "u/AoiNakamoto",
    date: "2019-06-18",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-18-c297as",
    url: "https://www.reddit.com/r/Grycoin/comments/c297as/7_mbtc_quizchain2_block_43/",
    author: "u/AoiNakamoto",
    date: "2019-06-18",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-20-c2volp",
    url: "https://www.reddit.com/r/Grycoin/comments/c2volp/7_mbtc_quizchain2_block_44/",
    author: "u/AoiNakamoto",
    date: "2019-06-20",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-21-c37u67",
    url: "https://www.reddit.com/r/Grycoin/comments/c37u67/7_mbtc_quizchain2_block_45/",
    author: "u/AoiNakamoto",
    date: "2019-06-21",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-22-c3kyoe",
    url: "https://www.reddit.com/r/Grycoin/comments/c3kyoe/7_mbtc_quizchain2_block_46/",
    author: "u/AoiNakamoto",
    date: "2019-06-22",
    archive: {
      url: "https://web.archive.org/web/20190622040741/https://www.reddit.com/r/Grycoin/comments/c3kyoe/7_mbtc_quizchain2_block_46/?utm_source=ifttt",
      date: "2019-06-22T04:07:41Z",
      content: "confirmed",
    },
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-22-c3vye3",
    url: "https://www.reddit.com/r/Grycoin/comments/c3vye3/11_mbtc_quizchain2_block_47/",
    author: "u/AoiNakamoto",
    date: "2019-06-22",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-24-c4ndaa",
    url: "https://www.reddit.com/r/Grycoin/comments/c4ndaa/7_mbtc_quizchain2_block_48/",
    author: "u/AoiNakamoto",
    date: "2019-06-24",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-25-c54umz",
    url: "https://www.reddit.com/r/Grycoin/comments/c54umz/7_mbtc_quizchain2_block_49/",
    author: "u/AoiNakamoto",
    date: "2019-06-25",
  },
  {
    file: "quizchain2/aoinakamoto-2019-06-26-c5kst3",
    url: "https://www.reddit.com/r/Grycoin/comments/c5kst3/7_mbtc_quizchain_2_block_50/",
    author: "u/AoiNakamoto",
    date: "2019-06-26",
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
    file: "satoshi-birthday-quiz/aoinakamoto-2019-04-05",
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
    file: "satoshi-birthday-quiz/aoinakamoto-2019-04-05-b9l37o",
    url: "https://www.reddit.com/r/Bitcoin/comments/b9l37o/",
    author: "u/AoiNakamoto",
    date: "2019-04-05",
  },
  {
    file: "satoshi-birthday-quiz/aoinakamoto-2019-04-10-ekjcc1k",
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
  {
    file: "mini/retiredcoder-2025-01-14",
    url: "https://bitcointalk.org/index.php?topic=5526453",
    author: "RetiredCoder",
    date: "2025-01-14",
    archive: {
      url: "https://web.archive.org/web/20250830150658/https://bitcointalk.org/index.php?topic=5526453",
      date: "2025-08-30T15:06:58Z",
      content: "confirmed",
    },
  },
  {
    file: "mini/retiredcoder-2025-04-16",
    url: "https://bitcointalk.org/index.php?topic=5538285",
    author: "RetiredCoder",
    date: "2025-04-16",
    archive: {
      url: "https://web.archive.org/web/20250830144359/https://bitcointalk.org/index.php?topic=5538285",
      date: "2025-08-30T14:43:59Z",
      content: "confirmed",
    },
  },
  {
    file: "mini/retiredcoder-2026-03-14",
    url: "https://bitcointalk.org/index.php?topic=5577390",
    author: "RetiredCoder",
    date: "2026-03-14",
    archive: {
      url: "https://web.archive.org/web/20260926184129/https://bitcointalk.org/index.php?topic=5577390.0",
      date: "2026-09-26T18:41:29Z",
      content: "confirmed",
    },
  },
  {
    file: "mini/retiredcoder-2026-07-29",
    url: "https://bitcointalk.org/index.php?topic=5589799",
    author: "RetiredCoder",
    date: "2026-07-29",
    archive: {
      url: "https://web.archive.org/web/20260730133211/https://bitcointalk.org/index.php?topic=5589799",
      date: "2026-07-30T13:32:11Z",
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
