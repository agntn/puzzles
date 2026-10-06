import {
  answer,
  artifact,
  assets,
  claim,
  compressed,
  confirmation,
  digest,
  fact,
  funding,
  official,
  party,
  profile,
  seed,
  stage,
  technique,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The treasure hunt page, which carried this hunt in 2021 and Glimmer from 2022 on. */
const PAGE = "https://www.smithlylemoore.com/treasure-hunt";

/** The oldest capture of the page with this hunt, three days after the funding. */
const FIRST_PAGE = confirmation(
  "https://web.archive.org/web/20210628003610/https://www.smithlylemoore.com/treasure-hunt",
  "Wayback capture of the treasure hunt page from June 2021",
);

/** The capture after the release, with the music video, presave and key checker lines added. */
const RELEASE_PAGE = confirmation(
  "https://web.archive.org/web/20210805044449/https://www.smithlylemoore.com/treasure-hunt",
  "Wayback capture of the treasure hunt page from August 2021",
);

/** The winners' write-up, with every page password, the twelve words and the wallet password. */
const WRITEUP =
  "https://www.reddit.com/r/smithlylemoore/comments/p6wzkk/bitcoin_treasure_hunt_solutionwriteup/";

/** The day the write-up went up, which dates every answer it gives. */
const SOLVED = { date: "2021-08-18" };

/** The album cover, with the first clue after the end of its image data. */
const COVER = "https://static.wixstatic.com/media/144728_690b95a837b14706a3e8583e0c5b8056~mv2.png";

const SITE = "https://www.smithlylemoore.com";

/** Where the band's site serves its audio. */
const MUSIC = "https://music.wixstatic.com/mp3";

/** Smith, Lyle & Moore's first hunt: a trip to the moon through their Born to Be Wild cover. */
export const smithLyleMooreBornToBeWild = puzzle({
  id: "smith-lyle-moore/born-to-be-wild",
  chain: "bitcoin",
  address: "bc1qgtymp8q7hw2k9tewhdq74vdlpkqhflgju69n95",
  sourceUrl: FIRST_PAGE.url,
  startedAt: "2021-06-25 00:57:33",
  status: Status.Solved,
  solvedAt: "2021-08-18 07:33:00",
  solveTime: 4689327,
  prize: 0.025,
  pubkey: compressed("032a0aed2948e5b4a5631f60a633b81f38674f16e3b1a8f11120bc1635dc1b4809"),
  key: seed(
    "fortune all man kind one giant step into digital tomorrow virtual moon",
    "m/84'/0'/0'/0/0",
    "supernova",
  ).xpub(
    "xpub6CdPGtTHU667LydEdcRDwf9UyKAN1n2VHxaFbprMHcbY6GLbSij2zJ5QZxR38nR71T7pvNLBof7Yg9GBqu7QyNNaFshSzNjFhpMTDQNvABg",
  ),
  techniques: [technique("hidden-seed-words", WRITEUP)],
  stages: [
    stage(
      "album cover",
      "The Born to Be Wild cover carries a message past the end of its image data, and the first key check wants the word it names.",
      [
        artifact("album cover", COVER, "born-to-be-wild/puzzle.png"),
        artifact("key check 1", `${SITE}/key-check-1`),
      ],
      answer("Password: fortune", WRITEUP, SOLVED),
      [technique("steganography", WRITEUP)],
    ),
    stage(
      "secret museum",
      "The museum behind the hidden door wants an 8-digit pin.",
      [artifact("secret museum", `${SITE}/the-secret-museum7`)],
      answer("Password: 07201969", WRITEUP, SOLVED),
    ),
    stage(
      "key check 2",
      "The museum's gold frames point at the next words of the key.",
      [artifact("key check 2", `${SITE}/key-check-2`)],
      answer("Password: all man kind", WRITEUP, SOLVED),
    ),
    stage(
      "key check 3",
      "The clues on the museum page add up to the words after those.",
      [artifact("key check 3", `${SITE}/key-check-3`)],
      answer("Password: one giant step", WRITEUP, SOLVED),
    ),
    stage(
      "pyromaniac",
      "The museum burns down, and the first way on is a red herring the band later changed, ending at a dead end.",
      [
        artifact("there's been a fire", `${SITE}/there-s-been-a-fire`),
        artifact("i'm a pyromaniac", `${SITE}/im-a-pyromaniac`),
        artifact("the tragedy", `${SITE}/the-tragedy`),
      ],
      answer("Password: 01271967", WRITEUP, SOLVED),
    ),
    stage(
      "museum fire",
      "Back from the tragedy, paying your respects asks for a password.",
      [artifact("we will rebuild", `${SITE}/we-will-rebuild-stronger-than-before`)],
      answer("Password: fffffffffff", WRITEUP, SOLVED),
    ),
    stage(
      "rebuild",
      "The same page asks for another password right after the first.",
      [artifact("we will rebuild", `${SITE}/we-will-rebuild-stronger-than-before`)],
      answer("Password: FFFFFFFFFFF", WRITEUP, SOLVED),
    ),
    stage(
      "vault",
      "The passage ends at a locked vault, with an alternative mix of the song and a computer inside.",
      [
        artifact("the passage", `${SITE}/the-passage`),
        artifact("the vault", `${SITE}/the-vault`),
        artifact("alternative song", `${MUSIC}/144728_5f57f68e07ba4319b9c189fbc61626b9-320.mp3`),
        artifact("the computer", `${SITE}/the-computer`),
      ],
      answer("Password: 4samcodeartist", WRITEUP, SOLVED),
    ),
    stage(
      "vault password",
      "The inverted song cancels the YouTube mix, and the guitar left in the alternative one, 13 seconds after touchdown, is Morse.",
      [
        artifact("vault password page", `${SITE}/blank`),
        artifact("inverted song", "https://www.youtube.com/watch?v=3we3eotJZHU"),
      ],
      answer("Password: into digital", WRITEUP, SOLVED),
      [technique("morse", WRITEUP)],
    ),
    stage(
      "key check 4",
      "The vault asks which code deciphered the last clue, and hands over the number to append.",
      [artifact("key check 4", `${SITE}/key-check-4`)],
      answer("Password: morse00100001", WRITEUP, SOLVED),
    ),
    stage(
      "key check 5",
      "A riddle in ones and zeros, with the number to append after the answer.",
      [artifact("key check 5", `${SITE}/key-check-5`)],
      answer("Password: tomorrow0010000", WRITEUP, SOLVED),
      [technique("binary", WRITEUP)],
    ),
    stage(
      "gateway",
      "An email to codebreaker@smithlylemoore.com earns the address and password of the gateway.",
      [artifact("gateway", `${SITE}/gateway`)],
      answer("Password: codebreaker11", WRITEUP, SOLVED),
    ),
    stage(
      "final attraction",
      "The ticket to the final attraction is words 11 and 12, the last stop of your journey.",
      [artifact("final attraction", `${SITE}/illstillbelovinyou`)],
      answer("Password: virtual moon", WRITEUP, SOLVED),
    ),
    stage(
      "wallet password",
      "The final attraction plays an unreleased song, and the wallet's password is the end of it all.",
      [
        artifact("final attraction", `${SITE}/illstillbelovinyou`),
        artifact("future song", `${MUSIC}/144728_b22b111462424cf3824203ac3564c2ce-320.mp3`),
      ],
      answer("Password: supernova", WRITEUP, SOLVED),
    ),
  ],
  hints: [
    official(
      "Hidden in the Born To Be Wild album cover is a clue. Hidden in the Born To Be Wild music video is a hint about how to access the clue. Follow the clues... they will lead you to .025 Bitcoin.",
      PAGE,
      FIRST_PAGE,
    ),
    official(
      "This is a digital treasure hunt that will lead you to digital gold. The treasure is buried with riddles, cyphers, analogies and references to historical events.",
      PAGE,
      FIRST_PAGE,
    ),
    official(
      "There is a treasure map that you can access on this site. The map is very helpful. X marks the spot. Find it.",
      PAGE,
      FIRST_PAGE,
    ),
    official(
      "There is also a shortcut in this journey if you know where/how to look and are willing to take the baby steps that lead to one giant leap.",
      PAGE,
      FIRST_PAGE,
    ),
    official(
      "Watching the Born to Be Wild music video is important to your success in this puzzle.",
      PAGE,
      RELEASE_PAGE,
    ),
    official(
      "If you think you have discovered part of the key, use the key checker tool to see if you're correct.",
      PAGE,
      RELEASE_PAGE,
    ),
  ],
  assets: assets({
    puzzle: "born-to-be-wild/puzzle.png",
    sourceUrl: WRITEUP,
    digests: [
      digest(
        "born-to-be-wild/puzzle.png",
        "70bb22569074c2cbec25c0fd1761ee9df8e7a4bf652a1c43265819c3283adace",
        13407180,
        {
          url: COVER,
          archive: `https://web.archive.org/web/20210714221455id_/${COVER}`,
        },
      ),
    ],
  }),
  transactions: [
    funding(
      "b434744d2bc873a82d8965c6de60fc8f11bdb3e6d34f0e61482e95378f0e6507",
      "2021-06-25 00:57:33",
      0.025,
    ),
    claim(
      "9dc8110ee73cd415361c23ceeac2a5ea8b01736556bc5f5fcbe11afac7be93a3",
      "2021-08-18 07:33:00",
      0.02499616,
    ),
  ],
  solver: party("26-9-15-20", {
    key: "26-9-15-20",
    about:
      "Reddit user whose group of friends cracked the Born to Be Wild hunt and posted the whole route on r/smithlylemoore.",
    profiles: [profile("reddit", "https://www.reddit.com/user/26-9-15-20/")],
    facts: [
      fact(
        "Posted a write-up of the Born to Be Wild hunt with every page password, the twelve words and the wallet password, saying the group had solved it the night before.",
        WRITEUP,
        SOLVED,
      ),
    ],
  }),
});
