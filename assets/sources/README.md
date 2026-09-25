# Archived sources

Local reading copies of the pages the collection records cite and nobody else keeps: nine tweets, twelve Reddit threads and one Reddit comment, as of September 25, 2026. The archive keeps the Ballet announcement, Zden's two hints, the kitten image source used by Bitimage, the two announcements the author records cite, the three posts the solver records cite, the two AoiNakamoto quiz threads, the eight Quizchain block threads, AoiNakamoto's question on r/Bitcoin before the birthday quiz and IAMABananaAMAA's Caesar riddle, each with every surviving comment. The one Reddit comment is the reply where AoiNakamoto names their Twitter feed, kept with the comment it answers. The quiz and riddle threads are where each answer key was published, for the book quiz the prize address too, for Quizchain the private key of blocks 1 to 5 and the answer to every block, and for the riddle the key itself. Tweets are archived as single posts: no replies, no quote tweets, no other post about the same puzzle.

- [Ballet bounty announcement](ballet/bobbyclee-2020-07-31.md)
- [Bitimage's kitten image source](bitimage/aantonop-2015-05-27.md)
- [Demobit hint 1](zden/zd3n-2018-02-21.md)
- [Level 5 and XIXOIO Christmas hints](zden/zd3n-2018-12-24.md)
- [Genesis puzzle pre-announcement](genesis/caesrcd-2026-08-22.md)
- [Movie Enigma announcement](movie_enigma/cryptop1r4t3-2022-03-21.md)
- [Weave 4 answer from its solver](arweave/arpoxy-2019-11-10.md)
- [HongCoin recovery announcement](dug/0xflorent-2026-05-31.md)
- [TeikhosBounty solve](dug/0xflorent-2026-06-21.md)
- [7 million book quiz thread](book_quiz/aoinakamoto-2019-04-06.md)
- [Quizchain block 1 thread](quizchain/aoinakamoto-2019-04-07.md)
- [Quizchain block 2 thread](quizchain/aoinakamoto-2019-04-07-badtpz.md)
- [Quizchain block 3 thread](quizchain/aoinakamoto-2019-04-07-bae43s.md)
- [Quizchain block 4 thread](quizchain/aoinakamoto-2019-04-07-baejeg.md)
- [Quizchain block 5 thread](quizchain/aoinakamoto-2019-04-07-baf89m.md)
- [Quizchain block 6 thread](quizchain/aoinakamoto-2019-04-07-bafyoo.md)
- [Quizchain block 7 thread](quizchain/aoinakamoto-2019-04-08-baok2v.md)
- [Quizchain block 8 thread](quizchain/aoinakamoto-2019-04-08-bar0ty.md)
- [IAMABananaAMAA's Caesar riddle thread](iamabananaamaa/iamabananaamaa-2013-12-23.md)
- [Satoshi birthday 7 million quiz thread](satoshi_birthday_quiz/aoinakamoto-2019-04-05.md)
- [AoiNakamoto's giveaway question on r/Bitcoin](satoshi_birthday_quiz/aoinakamoto-2019-04-05-b9l37o.md)
- [AoiNakamoto's comment naming @NakamotoAoi](satoshi_birthday_quiz/aoinakamoto-2019-04-10-ekjcc1k.md)

## Capture and provenance

Each Markdown file records the original URL, author handle, publication date in UTC, capture date, and SHA-256 of its sibling PNG. `twitter.com` links resolve to the same post IDs as the `x.com` links here. A tweet's publication date comes from its ID timestamp, not the capture browser's local clock; a Reddit entry takes the submission date the thread itself prints.

The pages were fetched and rendered through Steel without account cookies; the two 2026-09-22 author entries and the three 2026-09-25 solver entries were rendered from X's public embed in a local headless Chromium, which is why they show Follow buttons and no engagement counts beyond what the embed prints. The Reddit entries are local headless Chromium renders of the Wayback captures themselves, not of the live threads, so they carry the archive banner and Reddit's 2023 chrome. The two exceptions are AoiNakamoto's giveaway question and the Twitter feed comment, which have no readable capture: their transcripts come from the Arctic Shift Reddit archive and their screenshots are renders of Arctic Shift's ID lookup. Transcripts were checked against both rendered HTML and screenshots. Each tweet PNG is a crop of the displayed post: author, text, attached image when present, timestamp, and engagement row. Surrounding navigation and other posts were excluded. Cropping and PNG conversion do not restore the original attachment bytes. Use the puzzle's existing files for image analysis, not these screenshots.

When an older web archive capture exists, `archive_url` links to that exact capture and `archive_date` records its timestamp. `archive_content: confirmed` means its body was read and the wording matched the transcript. `unverified` means only the archive index was confirmed, not the body. A login screen or an empty page does not confirm a tweet. The individual entries state what was checked, including any limits on attachment evidence.

The local screenshots are captures made in 2026, not proof of how the page looked on its publication date. Display names, avatars, counts, and the page layout can change. A screenshot hash detects file changes, not authorship or the truth of a hint. Quoted text and images remain attributed to their authors and are not relicensed by the package's MIT license.

## Adding a source

Keep one `.md` and `.png` pair under the collection directory. Use the author handle and UTC date in the filename, adding the tweet ID or the Reddit thread ID when the author has several posts that day. Retain the URL in the puzzle record; the archive is supporting evidence, not another dataset or a replacement source URL. Copy the frontmatter fields from an existing entry and link its screenshot in the body. Look for an older capture: for a tweet, of both the `twitter.com` and `x.com` URL; for anything else, of every URL the same page answers on, which for Reddit means the `www` and `old` hosts, whose captures differ wildly because one of them renders as an empty app shell. Record the capture's exact URL, date, and content check when found. If none is found, omit the three `archive_` fields and name the searched archive and check date in the entry; do not invent a snapshot URL.

Run `pnpm exec vp test test/unit/source-archives.test.ts` after adding an entry. The test checks screenshot hashes, that the archive covers the tweet IDs referenced by the serialized collections, and that a non-tweet entry archives a URL the records actually cite. A tweet entry gives its ID and handle and the test derives the rest; anything else carries its own URL and its own capture URL, because no other page's archive address is derivable. Add the new entry to its provenance cases and compare the transcript with the image by eye. Do not accept a login page, a truncated post, or an unloaded attachment as a capture.

The archive lives in the Git repository. Like the other files under `assets/`, it is not included in the npm tarball.
