import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  artifact,
  assets,
  compressed,
  confirmation,
  decrease,
  digest,
  fact,
  funding,
  hex,
  increase,
  official,
  party,
  PartyKind,
  profile,
  pubkeyReveal,
  stage,
  sweep,
} from "../core/parts.ts";
import { puzzle, Status } from "../core/puzzle.ts";

/** The rules page: the picture, the address and the split of the 2.1 BTC. */
const RULES = "https://phemex.com/announcements/try-to-solve-our-2-btc-puzzle";

/** The oldest capture of the rules page, under its 2020 address. */
const RULES_CAPTURE = confirmation(
  "https://web.archive.org/web/20200315064921/https://phemex.com/references/articles/try-to-solve-our-2-btc-puzzle",
  "Wayback capture of the rules page from March 2020",
);

/** Max's letter: who designed the puzzle, five hints and the winner's rules. */
const LETTER = "https://phemex.com/announcements/a-letter-from-max";

/** The oldest capture of the letter, under its 2020 address. */
const LETTER_CAPTURE = confirmation(
  "https://web.archive.org/web/20200502150312/https://phemex.com/references/articles/a-letter-from-max",
  "Wayback capture of the letter from May 2020",
);

/** The last hint, with the deadline of 21 March. */
const LAST_HINT = "https://phemex.com/announcements/the-last-hint-of-phemex-2-1btc-puzzle";

/** The oldest capture of the last hint, under its 2020 address. */
const LAST_HINT_CAPTURE = confirmation(
  "https://web.archive.org/web/20200529172411/https://phemex.com/references/articles/the-last-hint-of-phemex-2-1btc-puzzle",
  "Wayback capture of the last hint from May 2020",
);

/** The ending with the full solution. Phemex no longer serves it, so the capture is the source. */
const ENDING =
  "https://web.archive.org/web/20200529172409/https://phemex.com/references/articles/puzzle-ending";

/** Where the picture was posted. The file under `assets/` is what this URL still serves. */
const PICTURE = "https://img.phemex.com/wp-content/uploads/2020/01/16082243/satoshipuzzle.png";

/**
 * Satoshi's portrait drawn as a maze, with 2.1 BTC promised for its key: 1.1 BTC on the address
 * and 1 BTC more on a Phemex account. Nobody found it before the deadline, so Max published the
 * solution: the first 21-digit prime in e, times SatoshiNakamoto and Phemex read as Base58 in
 * two alphabets and taken little endian. The key is that product.
 */
export const satoshiMazePuzzle = puzzle({
  id: "satoshi-maze",
  chain: "bitcoin",
  address: "1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT",
  sourceUrl: RULES,
  startedAt: "2020-01-16 08:24:47",
  status: Status.Expired,
  pubkey: compressed("02b4a72e4aaa69ba04b80c6891df01f50d191a65eccc61e4e9862d1e421ce815b3"),
  key: hex("00000000000000141dc7bec50472bb381be8e18f6d6b397773d71fc5d91d41fb"),
  prize: 1.1,
  stages: [
    stage(
      "prime",
      "Find the first 21-digit prime in consecutive digits of e.",
      [artifact("picture", PICTURE, "puzzle.png")],
      answer(
        "The first 21-digit prime found in consecutive digits of e is: 957496696762772407663",
        ENDING,
        { date: "2020-03-21" },
      ),
    ),
    stage(
      "27-digit number",
      "Turn some words from the portrait into a 27-digit number.",
      [artifact("picture", PICTURE, "puzzle.png")],
      answer(
        "27-digit number: 237871847045914904726285415 (first hint came out on Jan. 23, two times within three days, also refer to the first two digits:23), b58decode(‘SatoshiNakamoto’), convert the bytes to integer using little endian, which is bigger than that of big endian, charset(default):’123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz’ I do find some people try to convert ‘SatoshiNakamoto’ in telegram chat, so don’t blame me that they are not ‘some words from the portrait’",
        ENDING,
        { date: "2020-03-21" },
      ),
    ),
    stage(
      "last number",
      "Turn one more word into the last factor of the key.",
      [artifact("picture", PICTURE, "puzzle.png")],
      answer(
        "Last number:554405551875, b58decode(‘Phemex’) convert the bytes to integer using little endian,which is also bigger than that of big endian, charset(xrp):’rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz’",
        ENDING,
        { date: "2020-03-21" },
      ),
    ),
    stage(
      "private key",
      "Multiply the three numbers into the private key of the address.",
      [artifact("picture", PICTURE, "puzzle.png")],
      answer(
        "This is the final private key in decimal:126272244427365764086102017718794198001099243823071433146875 =957496696762772407663*237871847045914904726285415*554405551875, 0x141dc7bec50472bb381be8e18f6d6b397773d71fc5d91d41fb in hexadecimal",
        ENDING,
        { date: "2020-03-21" },
      ),
    ),
  ],
  hints: [
    official(
      "2.1 BTC are hidden in this picture, can you find the solution? If you can’t, tag the smartest person you know on Twitter, and you will receive up to $100 if they solve it!",
      RULES,
      RULES_CAPTURE,
      { date: "2020-01-16" },
    ),
    official(
      "Once a participant has found the correct private key in the image, they will be able to transfer 1.1 BTC to the public key address of their own wallet. A further 1 BTC will be deposited to their Phemex account once they prove they control the private key.",
      RULES,
      RULES_CAPTURE,
      { date: "2020-01-16" },
    ),
    official(
      "The first 21-digit prime found in consecutive digits of e is: 957496696762772407663",
      LETTER,
      LETTER_CAPTURE,
      { date: "2020-01-23" },
    ),
    official(
      "The private key you derive from Satoshi’s portrait is a big integer, not Wallet Import Format (WIF)",
      LETTER,
      LETTER_CAPTURE,
      { date: "2020-01-23" },
    ),
    official("The filename of the picture is irrelevant", LETTER, LETTER_CAPTURE, {
      date: "2020-01-23",
    }),
    official(
      "The next step involves converting some words from the portrait, without I/O, into a 27-digit number",
      LETTER,
      LETTER_CAPTURE,
      { date: "2020-01-23" },
    ),
    official("Go back to step 4) again if you can’t figure it out", LETTER, LETTER_CAPTURE, {
      date: "2020-01-23",
    }),
    official(
      "Whoever is the first to transfer out the 1.1 BTCs from this address: 1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT will be the winner.",
      LETTER,
      LETTER_CAPTURE,
      { date: "2020-01-23" },
    ),
    official(
      "After meeting the Phemex team, the Goddess Pheme repeated the words “little is big”, twice within three days.",
      LAST_HINT,
      LAST_HINT_CAPTURE,
      { date: "2020-02-21" },
    ),
    official(
      "If the Puzzle is not solved by the 21st of March, we will reveal the complete solution, showing how to find the private key.",
      LAST_HINT,
      LAST_HINT_CAPTURE,
      { date: "2020-02-21" },
    ),
    official(
      "Of course, with the release of this information, the prize money will no longer be available.",
      ENDING,
      undefined,
      { date: "2020-03-21" },
    ),
  ],
  transactions: [
    funding(
      "5d5af5b6a5bfc12a5ba4ea58829b0b549f36853699bda0e9cc4677c34ce43e24",
      "2020-01-16 04:13:23",
      0.0001,
    ),
    pubkeyReveal(
      "367c0e15b246dd48e5e6504beb50f4f184b48012c1ecd3cff5f576dd0463f703",
      "2020-01-16 06:46:28",
      0.000079,
    ),
    increase(
      "fe1db133f3d572142f75826d9ff345795bffdf7eea07783d5a6d306b30e2528c",
      "2020-01-16 06:53:50",
      1.1,
    ),
    increase(
      "2549310d41b5709db978e732bdf49e57f417da06b90f61320665cfcea0f16ae5",
      "2020-01-22 06:49:29",
      0.0003,
    ),
    increase(
      "3d8cc6b1073e71a6ab2055f5a3922eef4b276eeb948950284464c83d18071ab5",
      "2020-01-27 07:25:37",
      0.00001157,
    ),
    increase(
      "0fbb01328dfc00df3817a4b2132534a061a5faaf4b2403dc980dd224b1c8490e",
      "2020-01-30 22:28:41",
      0.000006,
    ),
    increase(
      "ade297faee32a28da7046d790bcf1b7cf0cb285cea0012e5fa3c6f9e70fadab3",
      "2020-01-30 22:28:41",
      0.00001,
    ),
    increase(
      "93063f3f64e714e9e2515ffe64531525288b559e8d9d7d6bf149d1f1c4b3b448",
      "2020-01-30 23:07:17",
      0.000006,
    ),
    increase(
      "2fee15d2313b912039e3ef1881718512912c960615e650e3025f42788825c92d",
      "2020-01-30 23:07:17",
      0.000006,
    ),
    increase(
      "04879fc3d42b0559573e64bde724b929f9b2e4124ce9965741c40ccf98640844",
      "2020-01-31 01:50:54",
      0.0000666,
    ),
    increase(
      "3edd96fd49dc5b2a7fa7a85c55cd085df3423cce234a270a6caa38607f2bbdb6",
      "2020-02-01 10:27:11",
      0.00000973,
    ),
    increase(
      "b7c8494d301332ff402a1077283a7ef017bac1147543ed04cc10bc3c234756e4",
      "2020-02-01 10:52:26",
      0.00001,
    ),
    increase(
      "09360eba073e629cc54b22e3ecd9ef379cbb0d9fce5a90301135cf9a21226da5",
      "2020-02-01 11:06:07",
      0.00000666,
    ),
    increase(
      "f8aecd2dcdf922fc6f9e00a555293b7bcb06326a175083d66368f669581ecee5",
      "2020-02-01 12:45:35",
      0.00000666,
    ),
    increase(
      "170e580e9142d797b83cd6a2ef794c21217b15092069979836d743e5e53ae97b",
      "2020-02-01 12:45:35",
      0.00000666,
    ),
    increase(
      "774f796f8569a00b6267a7049bba038ae23c108f692ab0db100a79f3c8ee2768",
      "2020-02-01 12:57:08",
      0.000006,
    ),
    increase(
      "5190ab2914c95a9a0b4935d942d35671d38a5618d12b1eabda92bfa6362ef09c",
      "2020-02-01 13:05:19",
      0.00001,
    ),
    increase(
      "a755ef23a348fdff6f3f1c719e56e67819bdbef2d2d6edb27f80752b3987f28c",
      "2020-02-01 13:05:19",
      0.00001,
    ),
    increase(
      "56f3714ec86065ceb4e3627b7bef5e00fbbf42fb954544f5ef8da0243c3bd43d",
      "2020-02-01 15:39:47",
      0.00000666,
    ),
    increase(
      "e7c63f3638cc657b1c647cc4de126946ce54533cdddefaa865fb5cd5991138b7",
      "2020-02-01 15:44:42",
      0.00000639,
    ),
    increase(
      "9576721d4fd8b7bb373a78e4f0137d0744ccc2323565c506a8b7275e412aaac3",
      "2020-02-01 15:44:42",
      0.00000999,
    ),
    increase(
      "f635aafad0d2ac7ec3b5afd38f4761b82bcedf1d1c0d88da79e58a6f5b0861ea",
      "2020-02-01 15:44:42",
      0.00000663,
    ),
    increase(
      "52179421a6a66a0b508a388e274519aa128b0328fdf39f5ad41acc04a8041280",
      "2020-02-01 15:44:42",
      0.000027,
    ),
    increase(
      "b8a2925ce5085348b65e6fff1466ea920dc752c48a7bd1873734518b1ddcb6f5",
      "2020-02-02 04:13:45",
      0.00000666,
    ),
    increase(
      "1662947e5b21de218c3796746e3a2c228e2924f7f538aecf95512be61b80009b",
      "2020-02-02 15:40:30",
      0.00000999,
    ),
    increase(
      "9b3465399c70ee0d16ad446d4993e25c31b977c506f27a4f7e0385103e516ae1",
      "2020-02-02 15:40:30",
      0.00000666,
    ),
    increase(
      "a6f115ef5915a63c0b36ca2360802b24af5dc50304341c09f7288f4a913865b6",
      "2020-02-02 15:40:30",
      0.00000666,
    ),
    increase(
      "6dedd7d5415502cbf1bb1d83bdb8d4dbdbaa272e9264135ed1d732c26d65abc2",
      "2020-02-02 15:40:30",
      0.00000666,
    ),
    increase(
      "e8be37744b2a7333bcb6adf11440d2c3c1c39c5c66a3795df253e50e75c7d807",
      "2020-02-02 19:30:12",
      0.00000666,
    ),
    increase(
      "71cd0a4672937ef9e8686f39c9500754b76afc4d10fc107bfa6a8e6b3e3412a2",
      "2020-02-02 23:09:59",
      0.00000666,
    ),
    increase(
      "824aaca777bc1db938e64d664405ac4dddc841433db61052e8bb6ece245ed43b",
      "2020-02-02 23:51:38",
      0.00000666,
    ),
    increase(
      "74904c3a3f75e7b91aa3bf413c935957ec92f234eac7c5c8b0915aa721415a13",
      "2020-02-03 00:27:12",
      0.00000666,
    ),
    increase(
      "b2c756c08e9a4f9692da9f78949870542d6bd066257adcdd74b24c66c4717238",
      "2020-02-04 04:13:45",
      0.00000666,
    ),
    increase(
      "8505b360cbb0c0137ef921db437fe797fe8f963bb84ed9d10b4ac34c0b9f8ec1",
      "2020-02-04 04:13:45",
      0.00000999,
    ),
    increase(
      "10c66d9bf795963ee1cec4af9588ceb8cdc8e0a0218f8155183136c07744a5c7",
      "2020-02-06 03:36:49",
      0.00000666,
    ),
    increase(
      "1eaeb66b75592435e8840ce4fdf9e16042cdd13bb621a9c9cff99e63c81f7dd7",
      "2020-02-06 03:52:46",
      0.00000666,
    ),
    increase(
      "06c3c417e2283df9bb6626116b6223245be4941ae02bb5a91b6e8fc3bb50c6be",
      "2020-02-06 05:00:05",
      0.00000999,
    ),
    increase(
      "ea11374b5d8796442495d4a4c224692cf87908bfba942dbf308acc9288e515bb",
      "2020-02-08 01:11:09",
      0.00000666,
    ),
    increase(
      "78819e084ede86798146127f4a715953c88884aa4591ad21ba027f27354e5c47",
      "2020-02-08 17:45:53",
      0.00000666,
    ),
    increase(
      "65acfd99572b9bddb70ad3f2b56739374e76c5c460ea9a2960b7ea4ddd1e995f",
      "2020-02-08 17:45:53",
      0.00000666,
    ),
    increase(
      "d2cf37535e853f52913ad74c29141e03d04868edd07faf5bb037e3d880ed40fe",
      "2020-02-08 17:52:57",
      0.00000666,
    ),
    increase(
      "bcf51311ab3e6f492f13e480286b50432def6d11a89bcfd79f4a9ca284c146ba",
      "2020-02-08 23:07:28",
      0.00000666,
    ),
    increase(
      "ede8c7ae4aead007094e6e4518717640a5b27a34b93d3d3c967bbcf5b2ad5173",
      "2020-02-09 12:53:22",
      0.00000666,
    ),
    increase(
      "0a2b1686eb865746e81d2bcc8d682700164214156eb826b73f2e72cae55a8424",
      "2020-02-09 22:35:39",
      0.00000999,
    ),
    increase(
      "1b21cb348f765249f0fe101d91dbfa249fb4bf7fd2b1f73f672cb1884596a9ff",
      "2020-02-11 06:05:55",
      0.00000666,
    ),
    increase(
      "cf748f449aa5695fde6907a248ac935da7baf65fc9131f1db6a4cd0fb087e52e",
      "2020-02-11 11:05:41",
      0.00000666,
    ),
    increase(
      "4f156bba628d21116c8570704aae4a2ee1610cea6cdf3d067ecc0bde7728ca94",
      "2020-02-11 11:05:41",
      0.00000666,
    ),
    increase(
      "b412bcba007fabc92a1ea9d712903dcab007127c247af5dff6c075e08b209a5a",
      "2020-02-11 22:57:33",
      0.00000666,
    ),
    increase(
      "8eaae296a5ae976a2f5a6d0538874d78bf37016aa8683e4fa8b8d689408f3409",
      "2020-02-11 23:48:38",
      0.00000666,
    ),
    increase(
      "9fa93c179ca64e2184e19638185c3ed8d8408b693abb5d51ec4914c4ca0e31f4",
      "2020-02-12 00:08:14",
      0.00000666,
    ),
    increase(
      "41d701eb0ce91a02eaab750ad4251b0874f4440d49ce2fb2ab8c6b8909d4ccb8",
      "2020-02-13 10:30:38",
      0.00007431,
    ),
    increase(
      "2699b8ed86e88d29fff2acd65624cadad763c870f390d32ca5848d51dd137a4b",
      "2020-02-13 10:34:35",
      0.00000666,
    ),
    increase(
      "4f138937b9de793ab30d446eac1dcad5c0d06b6c376c30021ba16a9fa17150b1",
      "2020-02-13 10:39:02",
      0.00000666,
    ),
    increase(
      "974a5c4d597cb648ad4ee526b79d27d5388c0ccd4a6d72d66da2ef3b2dfdcd81",
      "2020-02-15 02:45:00",
      0.00000969,
    ),
    increase(
      "554f1b8a039c82fbb92c74d1dc2df85637fedd11725bbf013d29c365ecefea7d",
      "2020-02-15 02:46:04",
      0.00000969,
    ),
    increase(
      "fea886aef33090775fe8a95c911659a2e7742b95f98b7e4a9620d49c60f559fa",
      "2020-02-15 03:09:14",
      0.00000696,
    ),
    increase(
      "113ec3e14c623191c863c3e358bd8f9ae241e37c5538e542e4fcd263efbfc4e2",
      "2020-02-16 18:33:26",
      0.00000666,
    ),
    increase(
      "a95dc118415930f07561ce78f3db16a235d5ab47defd4101b7ea9b57628e7664",
      "2020-02-16 18:33:26",
      0.00000666,
    ),
    increase(
      "47d53dd6d9f251dbd3b847ae2dfcb5e9a3a73e554eeba801ee3afbf921b419e6",
      "2020-02-16 22:46:56",
      0.00000993,
    ),
    increase(
      "31362d5553f9c16bd2c64837ea2da8090f39c465c246a32a2644d30396e3b1b2",
      "2020-02-16 23:08:11",
      0.00000777,
    ),
    increase(
      "52ed3197ab1a0ca7314a270ece231f2c2a69d9457c6d89d23de812d4ac290448",
      "2020-02-20 22:32:29",
      0.00000666,
    ),
    increase(
      "0de57fe4dfd25d864f5f76ffd22659647fb9801b031f8782c9d97885ddda1176",
      "2020-02-21 14:19:48",
      0.00000666,
    ),
    increase(
      "7d65aeec2a750360b5c2d5349f24480661f6f1a4b6e3eb670ce1d81d036da645",
      "2020-02-21 23:43:52",
      0.00000999,
    ),
    increase(
      "55ba60aef66b6661539e80b9f5d193a1f4721e355c192cd3a4bc1cbcde0f9795",
      "2020-02-23 01:04:23",
      0.00000666,
    ),
    increase(
      "2dd24c6599dd1c478b3759bad7957b0795d7f2075d67f59763997d327d97815e",
      "2020-02-23 02:40:39",
      0.00000666,
    ),
    increase(
      "9911a902f1ead435646b32b291946f1da32beb9bd073e6bf5d5263ec64c2e132",
      "2020-02-23 09:46:07",
      0.00000666,
    ),
    increase(
      "34f35b594a64da96c6f86cdaf537d010066e74bf890a6bb4de58a5265728fdf9",
      "2020-02-23 17:03:44",
      0.00000666,
    ),
    increase(
      "f9c5d1ff627fd82c30a5b014c0474a6340609ce7f4519b5fcacda7f5d3595a5f",
      "2020-02-24 13:16:22",
      0.00000666,
    ),
    increase(
      "f9c66d099a9e5f26a0956a9c75d1025f6b31251e111837f56bd16b6c301edb14",
      "2020-02-25 22:50:54",
      0.00000666,
    ),
    increase(
      "f113758dcea4b9f6c14ea532069b02229cea5a6b7473566988e4069ed424e566",
      "2020-02-25 23:29:57",
      0.00000666,
    ),
    increase(
      "2591e4825d9c4cca2e14b3bc3fe6a317bf805758b178846d0e5603da0933ac19",
      "2020-02-27 02:53:17",
      0.00000666,
    ),
    increase(
      "c229336cbfa398bc6621281df628c297f16acb0c6ed8f1cea46323a4163a3a11",
      "2020-02-27 03:00:24",
      0.00000666,
    ),
    increase(
      "d0c099dff9a450da140ace59fb1475adf01772b44f8c77dab1d4acda2125cf11",
      "2020-02-27 20:43:54",
      0.00000666,
    ),
    increase(
      "fb4b6c7f06be3f0bce8540ef2a90486f11dcf47d361be5519efb9e982a3a0642",
      "2020-02-29 02:02:20",
      0.00000999,
    ),
    increase(
      "df7ca588d3837bc06502963efb0ae6f0ecc7a619e2e96e1061c68b0511739e6f",
      "2020-02-29 02:37:48",
      0.00000999,
    ),
    increase(
      "1d0c2e90469bc43be525b81699714a066d2bfecf3058168dd462e58328e8a6d8",
      "2020-03-03 01:33:05",
      0.00000666,
    ),
    increase(
      "621528cafb723fe7c7acacae289258bea72406bb5f7a0e166fb5f91ad2e8ecfd",
      "2020-03-03 18:15:08",
      0.00000666,
    ),
    increase(
      "6c1baddda1f6b1cc008605e8119a325c3f08404a586580648946e4e5379ec8b5",
      "2020-03-04 20:56:19",
      0.00000666,
    ),
    increase(
      "4dccb0d44ef51dac2d82ba253edd6bbdf52882e5bd7529f9d1f486efdf4db807",
      "2020-03-05 00:01:13",
      0.00000555,
    ),
    increase(
      "ce024f38293721ff79f3e6cf7f3447a6266dfc04e9cd40030efea6bf4a0a2377",
      "2020-03-07 16:50:13",
      0.00000666,
    ),
    increase(
      "5dbf0a83e7fef1e05154df11a42ad7e7cf38548a3d7f781b289fe185c73e470b",
      "2020-03-08 12:37:16",
      0.00000666,
    ),
    increase(
      "adcb883cca39ed8be18ea20160fe9dbcfe7de696538142b4dc2fbef4f23f3cc2",
      "2020-03-08 15:01:06",
      0.00000666,
    ),
    increase(
      "9261790a1edeb169b85d8b1f197ef87aff4b77fad2d42ffd85019d4595ff8818",
      "2020-03-14 06:43:40",
      0.00000666,
    ),
    increase(
      "529ef41c1d42e1574221eee6874c5f23d5a16c4167b7441fb480082e73ef3f68",
      "2020-03-15 03:41:37",
      0.00000666,
    ),
    increase(
      "310c4c0b9f0b708fd3761d8f39f7a75f32bb30c2fc7275aaf8b8fb2c7f40dc01",
      "2020-03-15 04:09:09",
      0.00000666,
    ),
    increase(
      "72b80f72833eb8096bb419251027df283818fe4ae1e74215c2a51e92ca877d91",
      "2020-03-15 17:23:27",
      0.0000075,
    ),
    increase(
      "3948093f8ffca9cf233738a3a8230819fcb1437f1f18dacfdb13ba0f1a726864",
      "2020-03-16 02:53:06",
      0.00000578,
    ),
    decrease(
      "839b065b45340b46613e448097f8349c14b9ed05acd5914115cadd42749e131e",
      "2020-03-21 02:31:47",
      1.099,
    ),
    increase(
      "d2404df2c343e99bc8f122059d0b03bd2d1441ac0819be5cfc7abc6974cb725c",
      "2020-03-21 04:07:58",
      0.00000666,
    ),
    sweep(
      "216d307d09af1558370d6db539b969e120ee9285c945924b0d5b9a84d4aec445",
      "2020-03-21 05:17:49",
      0.001983,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.png",
    sourceUrl: PICTURE,
    digests: [
      digest(
        "puzzle.png",
        "d099d6e938284e617651502988802ea00f1d0e0a46cbd9118a3c5a7cb92cff32",
        1944364,
        {
          url: PICTURE,
          archive:
            "https://web.archive.org/web/20200415133013id_/https://img.phemex.com/wp-content/uploads/2020/01/16082243/satoshipuzzle.png",
        },
      ),
    ],
  }),
});

/** Satoshi-Maze, one puzzle by the Phemex exchange. */
export class SatoshiMazeCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "satoshi-maze";

  /** Who published the puzzle. */
  static readonly author = party("Phemex", {
    key: "phemex",
    kind: PartyKind.Organization,
    about:
      "Crypto derivatives exchange founded in 2019. It hid a key in Satoshi's portrait to show why private keys belong in cold storage.",
    profiles: [
      profile("website", "https://phemex.com/"),
      profile("twitter", "https://x.com/Phemex_official"),
    ],
    facts: [
      fact(
        "Max, a Phemex co-founder, signed the letter that calls him the satoshi-maze puzzle designer.",
        LETTER,
        { date: "2020-01-23" },
      ),
      fact(
        "Launched the puzzle to show its Hierarchical Deterministic Cold Wallet System, with its CEO Jack Tao quoted on hot and cold wallets.",
        RULES,
        { date: "2020-01-16" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [satoshiMazePuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(SatoshiMazeCollection.key, SatoshiMazeCollection.author, SatoshiMazeCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const satoshiMaze = new SatoshiMazeCollection();
