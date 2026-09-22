# Source tweets

Local reading copies of the six tweet URLs cited by the collection records on September 22, 2026. The archive keeps the Ballet announcement, Zden's two hints, the kitten image source used by Bitimage, and the two announcements the author records cite. It does not archive whole threads, replies, or every post about these puzzles.

- [Ballet bounty announcement](ballet/bobbyclee-2020-07-31.md)
- [Bitimage's kitten image source](bitimage/aantonop-2015-05-27.md)
- [Demobit hint 1](zden/zd3n-2018-02-21.md)
- [Level 5 and XIXOIO Christmas hints](zden/zd3n-2018-12-24.md)
- [Genesis puzzle pre-announcement](genesis/caesrcd-2026-08-22.md)
- [Movie Enigma announcement](movie_enigma/cryptop1r4t3-2022-03-21.md)

## Capture and provenance

Each Markdown file records the original URL, author handle, publication date in UTC, capture date, and SHA-256 of its sibling PNG. `twitter.com` links resolve to the same post IDs as the `x.com` links here. Publication dates come from the tweet IDs' timestamps, not the capture browser's local clock.

The pages were fetched and rendered through Steel without account cookies; the two 2026-09-22 author entries were rendered from X's public embed in a local headless Chromium, which is why they show Follow buttons and no engagement counts beyond what the embed prints. Transcripts were checked against both rendered HTML and screenshots. Each PNG is a crop of the displayed post: author, text, attached image when present, timestamp, and engagement row. Surrounding navigation and other posts were excluded. Cropping and PNG conversion do not restore the original attachment bytes. Use the puzzle's existing files for image analysis, not these screenshots.

When an older web archive capture exists, `archive_url` links to that exact capture and `archive_date` records its timestamp. `archive_content: confirmed` means its body was read and the tweet's wording matched the transcript. `unverified` means only the archive index was confirmed, not the body. A login screen or an empty page does not confirm a tweet. The individual entries state what was checked, including any limits on attachment evidence.

The local screenshots are captures made in 2026, not proof of how the page looked on its publication date. Display names, avatars, counts, and the page layout can change. A screenshot hash detects file changes, not authorship or the truth of a hint. Quoted text and images remain attributed to their authors and are not relicensed by the package's MIT license.

## Adding a source

Keep one `.md` and `.png` pair under the collection directory. Use the author handle and UTC date in the filename, adding the tweet ID when the author has several posts that day. Retain the URL in the puzzle record; the archive is supporting evidence, not another dataset or a replacement source URL. Copy the frontmatter fields from an existing entry and link its screenshot in the body. Look for an older capture of both the `twitter.com` and `x.com` URL. Record its exact URL, date, and content check when found. If none is found, omit the three `archive_` fields and name the searched archive and check date in the entry; do not invent a snapshot URL.

Run `pnpm exec vitest run test/unit/source-archives.test.ts` after adding an entry. The test checks screenshot hashes and that the archive covers the tweet IDs referenced by the serialized collections. Add the new entry to its provenance cases and compare the transcript with the image by eye. Do not accept a login page, a truncated post, or an unloaded attachment as a capture.

The archive lives in the Git repository. Like the other files under `assets/`, it is not included in the npm tarball.
