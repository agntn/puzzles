import { compressed, confirmation, funding, official } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

/** The treasure hunt page, whose flag links the wallet's xpub on CoinTracker. */
const PAGE = "https://www.smithlylemoore.com/treasure-hunt";

/** The first capture of the page after Glimmer replaced Born to Be Wild on it. */
const FIRST_PAGE = confirmation(
  "https://web.archive.org/web/20220811234612/https://www.smithlylemoore.com/treasure-hunt",
  "Wayback capture of the treasure hunt page from August 2022",
);

/** The background page the treasure hunt page links as more info. */
const MORE_INFO = "https://www.smithlylemoore.com/more-info";

const FIRST_MORE_INFO = confirmation(
  "https://web.archive.org/web/20220812000418/https://www.smithlylemoore.com/more-info",
  "Wayback capture of the more info page from August 2022",
);

const KEY_CHECKER = "https://www.smithlylemoore.com/key-checker";

const FIRST_KEY_CHECKER = confirmation(
  "https://web.archive.org/web/20221227033927/https://www.smithlylemoore.com/key-checker",
  "Wayback capture of the key checker from December 2022",
);

/** Smith, Lyle & Moore's second hunt: a psychedelic sea voyage woven into their single Glimmer. */
export const smithLyleMooreGlimmer = puzzle({
  id: "smith-lyle-moore/glimmer",
  chain: "bitcoin",
  address: "bc1q0akdjvrc2csau2n3gyxa3xcq0fss852x997m9y",
  sourceUrl: PAGE,
  startedAt: "2022-07-29 16:22:03",
  prize: 0.031777,
  pubkey: compressed("037e3109f564912f1007912d90f76c7aae43b812d6286d609a86140b746fbc7943"),
  hints: [
    official(
      "Woven into our next single, Glimmer, is a story. Uncover the story... it will lead you to .031777 Bitcoin.",
      MORE_INFO,
      FIRST_MORE_INFO,
    ),
    official(
      "This is a digital treasure hunt. The treasure is buried with riddles, cyphers, analogies and references to historical events or epic nautical stories.",
      MORE_INFO,
      FIRST_MORE_INFO,
    ),
    official(
      "There are red herrings and incorrect paths. Some lead back to the main journey, some lead elsewhere.",
      MORE_INFO,
      FIRST_MORE_INFO,
    ),
    official(
      "This is the second digital treasure hunt we've created, and it picks up where the last one left off. Watch the Born to Be Wild video to better understand where you are starting from.",
      MORE_INFO,
      FIRST_MORE_INFO,
    ),
    official(
      "There is also a shortcut in this journey if you know where/how to look and are willing to take the baby steps that lead to one giant leap.",
      MORE_INFO,
      FIRST_MORE_INFO,
    ),
    official(
      "P.S. X Marks the spot — find the X (not on the flag), and we'll help you solve the first clue.",
      PAGE,
      FIRST_PAGE,
    ),
    official(
      "click below and enter first word of key... just like last time ;)",
      KEY_CHECKER,
      FIRST_KEY_CHECKER,
    ),
  ],
  transactions: [
    funding(
      "977a42e5c9e9ee5fbcde9264ac05b4dc192b8330fc6e0ce56e89cf99772eb2fe",
      "2022-07-29 16:22:03",
      0.031777,
    ),
  ],
});
