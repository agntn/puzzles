import { claim, compressed, funding, official } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 2 thread, with the question text, the funding txid and the hash digits. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cleczc/grycoin_block_2/";

/** The author's reply of August 3, 2019 about the line breaks. */
const LINE_BREAKS = "https://www.reddit.com/r/Grycoin/comments/cleczc/comment/evuthpw/";

/** The author's reply of August 3, 2019 with the hash of the unchanged text. */
const UNCHANGED = "https://www.reddit.com/r/Grycoin/comments/cleczc/comment/evv9k37/";

/** The author's reply of August 3, 2019 on why the solution stays unposted. */
const UNPOSTED = "https://www.reddit.com/r/Grycoin/comments/cleczc/comment/evwv4rm/";

/** Grycoin chain block 2: its own text, a few letters flipped. Claimed, and nobody knows how. */
export const grycoinBlock2 = puzzle({
  id: "grycoin/2",
  chain: "bitcoin",
  address: "1tzieUfbeQghz2zjDeGHcAEfzCRgX6eLi",
  sourceUrl: THREAD,
  startedAt: "2019-08-01 05:04:38",
  status: Status.Claimed,
  pubkey: compressed("039ad91b631e5e2f0915b682c6ab8a29d81bb464a2ffc8ebf9702aad7b238192dc"),
  prize: 0.007,
  hints: [
    official(
      "As is already clear from the reference to block 29, people are supposed to keep the whole long text and change only a couple of letters in their capitalization.",
      THREAD,
    ),
    official(
      'When you do that, you would end up changing "I" to "i" and "himself" to "himselF".',
      THREAD,
    ),
    official(
      "Which would be the solution, once you do that for all the paragraphs where you recognize the signs. And keep the rest completely unchanged.",
      THREAD,
    ),
    official("Format: [solution]", THREAD),
    official(
      'Start with the first "I" and stop with the period after "method", with no spaces or line breaks before or after that included in the hash.',
      THREAD,
    ),
    official(
      "And for the record, each of these resolves to the combination of the ASCII codes 13 and 10, for 13 10 13 10 meaning two line breaks, or \\r\\n \\r\\n as another way of saying the same thing.",
      THREAD,
    ),
    official("First three digits of MD5 hash are 3c6.", THREAD),
    official(
      "I am saying copy paste and do not change anything with the line breaks, change only the capitalization of letters in solution.",
      LINE_BREAKS,
    ),
    official(
      "Thank you for asking. I really like the answer, turns out that the first seven digits of that MD5 hash are 7759227, with three numbers 7 turning up there.",
      UNCHANGED,
    ),
    official(
      "One, I actually don't know. The question of what letters to change in capitalization is obvious if you know the solution to Satoshi's bitcointalk puzzle, which I revealed already. The question of how to go from that to claiming the prize is not, not even to me.",
      UNPOSTED,
    ),
  ],
  solvedAt: "2019-08-03 14:02:10",
  solveTime: 205_052,
  transactions: [
    funding(
      "f11eca9925c7809210796a3c8d95677dfaf0becb4f6df4c74e7261c3011a2e3c",
      "2019-08-01 05:04:38",
      0.007,
    ),
    claim(
      "351371588afddbaafe739237392e020e7d5db9f8aef44d655d31c313034e4cc7",
      "2019-08-03 14:02:10",
      0.00689594,
    ),
  ],
});
