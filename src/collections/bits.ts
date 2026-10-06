import { NumericCollection } from "../core/collection.ts";
import {
  confirmation,
  fact,
  official,
  party,
  PartyKind,
  profile,
  technique,
} from "../core/parts.ts";
import { bits1 } from "./bits/1.ts";
import { bits2 } from "./bits/2.ts";
import { bits3 } from "./bits/3.ts";
import { bits4 } from "./bits/4.ts";
import { bits5 } from "./bits/5.ts";
import { bits6 } from "./bits/6.ts";
import { bits7 } from "./bits/7.ts";
import { bits8 } from "./bits/8.ts";
import { bits9 } from "./bits/9.ts";
import { bits10 } from "./bits/10.ts";
import { bits11 } from "./bits/11.ts";
import { bits12 } from "./bits/12.ts";
import { bits13 } from "./bits/13.ts";
import { bits14 } from "./bits/14.ts";
import { bits15 } from "./bits/15.ts";
import { bits16 } from "./bits/16.ts";
import { bits17 } from "./bits/17.ts";
import { bits18 } from "./bits/18.ts";
import { bits19 } from "./bits/19.ts";
import { bits20 } from "./bits/20.ts";
import { bits21 } from "./bits/21.ts";
import { bits22 } from "./bits/22.ts";
import { bits23 } from "./bits/23.ts";
import { bits24 } from "./bits/24.ts";
import { bits25 } from "./bits/25.ts";
import { bits26 } from "./bits/26.ts";
import { bits27 } from "./bits/27.ts";
import { bits28 } from "./bits/28.ts";
import { bits29 } from "./bits/29.ts";
import { bits30 } from "./bits/30.ts";
import { bits31 } from "./bits/31.ts";
import { bits32 } from "./bits/32.ts";
import { bits33 } from "./bits/33.ts";
import { bits34 } from "./bits/34.ts";
import { bits35 } from "./bits/35.ts";
import { bits36 } from "./bits/36.ts";
import { bits37 } from "./bits/37.ts";
import { bits38 } from "./bits/38.ts";
import { bits39 } from "./bits/39.ts";
import { bits40 } from "./bits/40.ts";
import { bits41 } from "./bits/41.ts";
import { bits42 } from "./bits/42.ts";
import { bits43 } from "./bits/43.ts";
import { bits44 } from "./bits/44.ts";
import { bits45 } from "./bits/45.ts";
import { bits46 } from "./bits/46.ts";
import { bits47 } from "./bits/47.ts";
import { bits48 } from "./bits/48.ts";
import { bits49 } from "./bits/49.ts";
import { bits50 } from "./bits/50.ts";
import { bits51 } from "./bits/51.ts";
import { bits52 } from "./bits/52.ts";
import { bits53 } from "./bits/53.ts";
import { bits54 } from "./bits/54.ts";
import { bits55 } from "./bits/55.ts";
import { bits56 } from "./bits/56.ts";
import { bits57 } from "./bits/57.ts";
import { bits58 } from "./bits/58.ts";
import { bits59 } from "./bits/59.ts";
import { bits60 } from "./bits/60.ts";
import { bits61 } from "./bits/61.ts";
import { bits62 } from "./bits/62.ts";
import { bits63 } from "./bits/63.ts";
import { bits64 } from "./bits/64.ts";
import { bits65 } from "./bits/65.ts";
import { bits66 } from "./bits/66.ts";
import { bits67 } from "./bits/67.ts";
import { bits68 } from "./bits/68.ts";
import { bits69 } from "./bits/69.ts";
import { bits70 } from "./bits/70.ts";
import { bits71 } from "./bits/71.ts";
import { bits72 } from "./bits/72.ts";
import { bits73 } from "./bits/73.ts";
import { bits74 } from "./bits/74.ts";
import { bits75 } from "./bits/75.ts";
import { bits76 } from "./bits/76.ts";
import { bits77 } from "./bits/77.ts";
import { bits78 } from "./bits/78.ts";
import { bits79 } from "./bits/79.ts";
import { bits80 } from "./bits/80.ts";
import { bits81 } from "./bits/81.ts";
import { bits82 } from "./bits/82.ts";
import { bits83 } from "./bits/83.ts";
import { bits84 } from "./bits/84.ts";
import { bits85 } from "./bits/85.ts";
import { bits86 } from "./bits/86.ts";
import { bits87 } from "./bits/87.ts";
import { bits88 } from "./bits/88.ts";
import { bits89 } from "./bits/89.ts";
import { bits90 } from "./bits/90.ts";
import { bits91 } from "./bits/91.ts";
import { bits92 } from "./bits/92.ts";
import { bits93 } from "./bits/93.ts";
import { bits94 } from "./bits/94.ts";
import { bits95 } from "./bits/95.ts";
import { bits96 } from "./bits/96.ts";
import { bits97 } from "./bits/97.ts";
import { bits98 } from "./bits/98.ts";
import { bits99 } from "./bits/99.ts";
import { bits100 } from "./bits/100.ts";
import { bits101 } from "./bits/101.ts";
import { bits102 } from "./bits/102.ts";
import { bits103 } from "./bits/103.ts";
import { bits104 } from "./bits/104.ts";
import { bits105 } from "./bits/105.ts";
import { bits106 } from "./bits/106.ts";
import { bits107 } from "./bits/107.ts";
import { bits108 } from "./bits/108.ts";
import { bits109 } from "./bits/109.ts";
import { bits110 } from "./bits/110.ts";
import { bits111 } from "./bits/111.ts";
import { bits112 } from "./bits/112.ts";
import { bits113 } from "./bits/113.ts";
import { bits114 } from "./bits/114.ts";
import { bits115 } from "./bits/115.ts";
import { bits116 } from "./bits/116.ts";
import { bits117 } from "./bits/117.ts";
import { bits118 } from "./bits/118.ts";
import { bits119 } from "./bits/119.ts";
import { bits120 } from "./bits/120.ts";
import { bits121 } from "./bits/121.ts";
import { bits122 } from "./bits/122.ts";
import { bits123 } from "./bits/123.ts";
import { bits124 } from "./bits/124.ts";
import { bits125 } from "./bits/125.ts";
import { bits126 } from "./bits/126.ts";
import { bits127 } from "./bits/127.ts";
import { bits128 } from "./bits/128.ts";
import { bits129 } from "./bits/129.ts";
import { bits130 } from "./bits/130.ts";
import { bits131 } from "./bits/131.ts";
import { bits132 } from "./bits/132.ts";
import { bits133 } from "./bits/133.ts";
import { bits134 } from "./bits/134.ts";
import { bits135 } from "./bits/135.ts";
import { bits136 } from "./bits/136.ts";
import { bits137 } from "./bits/137.ts";
import { bits138 } from "./bits/138.ts";
import { bits139 } from "./bits/139.ts";
import { bits140 } from "./bits/140.ts";
import { bits141 } from "./bits/141.ts";
import { bits142 } from "./bits/142.ts";
import { bits143 } from "./bits/143.ts";
import { bits144 } from "./bits/144.ts";
import { bits145 } from "./bits/145.ts";
import { bits146 } from "./bits/146.ts";
import { bits147 } from "./bits/147.ts";
import { bits148 } from "./bits/148.ts";
import { bits149 } from "./bits/149.ts";
import { bits150 } from "./bits/150.ts";
import { bits151 } from "./bits/151.ts";
import { bits152 } from "./bits/152.ts";
import { bits153 } from "./bits/153.ts";
import { bits154 } from "./bits/154.ts";
import { bits155 } from "./bits/155.ts";
import { bits156 } from "./bits/156.ts";
import { bits157 } from "./bits/157.ts";
import { bits158 } from "./bits/158.ts";
import { bits159 } from "./bits/159.ts";
import { bits160 } from "./bits/160.ts";
import { bits161 } from "./bits/161.ts";
import { bits162 } from "./bits/162.ts";
import { bits163 } from "./bits/163.ts";
import { bits164 } from "./bits/164.ts";
import { bits165 } from "./bits/165.ts";
import { bits166 } from "./bits/166.ts";
import { bits167 } from "./bits/167.ts";
import { bits168 } from "./bits/168.ts";
import { bits169 } from "./bits/169.ts";
import { bits170 } from "./bits/170.ts";
import { bits171 } from "./bits/171.ts";
import { bits172 } from "./bits/172.ts";
import { bits173 } from "./bits/173.ts";
import { bits174 } from "./bits/174.ts";
import { bits175 } from "./bits/175.ts";
import { bits176 } from "./bits/176.ts";
import { bits177 } from "./bits/177.ts";
import { bits178 } from "./bits/178.ts";
import { bits179 } from "./bits/179.ts";
import { bits180 } from "./bits/180.ts";
import { bits181 } from "./bits/181.ts";
import { bits182 } from "./bits/182.ts";
import { bits183 } from "./bits/183.ts";
import { bits184 } from "./bits/184.ts";
import { bits185 } from "./bits/185.ts";
import { bits186 } from "./bits/186.ts";
import { bits187 } from "./bits/187.ts";
import { bits188 } from "./bits/188.ts";
import { bits189 } from "./bits/189.ts";
import { bits190 } from "./bits/190.ts";
import { bits191 } from "./bits/191.ts";
import { bits192 } from "./bits/192.ts";
import { bits193 } from "./bits/193.ts";
import { bits194 } from "./bits/194.ts";
import { bits195 } from "./bits/195.ts";
import { bits196 } from "./bits/196.ts";
import { bits197 } from "./bits/197.ts";
import { bits198 } from "./bits/198.ts";
import { bits199 } from "./bits/199.ts";
import { bits200 } from "./bits/200.ts";
import { bits201 } from "./bits/201.ts";
import { bits202 } from "./bits/202.ts";
import { bits203 } from "./bits/203.ts";
import { bits204 } from "./bits/204.ts";
import { bits205 } from "./bits/205.ts";
import { bits206 } from "./bits/206.ts";
import { bits207 } from "./bits/207.ts";
import { bits208 } from "./bits/208.ts";
import { bits209 } from "./bits/209.ts";
import { bits210 } from "./bits/210.ts";
import { bits211 } from "./bits/211.ts";
import { bits212 } from "./bits/212.ts";
import { bits213 } from "./bits/213.ts";
import { bits214 } from "./bits/214.ts";
import { bits215 } from "./bits/215.ts";
import { bits216 } from "./bits/216.ts";
import { bits217 } from "./bits/217.ts";
import { bits218 } from "./bits/218.ts";
import { bits219 } from "./bits/219.ts";
import { bits220 } from "./bits/220.ts";
import { bits221 } from "./bits/221.ts";
import { bits222 } from "./bits/222.ts";
import { bits223 } from "./bits/223.ts";
import { bits224 } from "./bits/224.ts";
import { bits225 } from "./bits/225.ts";
import { bits226 } from "./bits/226.ts";
import { bits227 } from "./bits/227.ts";
import { bits228 } from "./bits/228.ts";
import { bits229 } from "./bits/229.ts";
import { bits230 } from "./bits/230.ts";
import { bits231 } from "./bits/231.ts";
import { bits232 } from "./bits/232.ts";
import { bits233 } from "./bits/233.ts";
import { bits234 } from "./bits/234.ts";
import { bits235 } from "./bits/235.ts";
import { bits236 } from "./bits/236.ts";
import { bits237 } from "./bits/237.ts";
import { bits238 } from "./bits/238.ts";
import { bits239 } from "./bits/239.ts";
import { bits240 } from "./bits/240.ts";
import { bits241 } from "./bits/241.ts";
import { bits242 } from "./bits/242.ts";
import { bits243 } from "./bits/243.ts";
import { bits244 } from "./bits/244.ts";
import { bits245 } from "./bits/245.ts";
import { bits246 } from "./bits/246.ts";
import { bits247 } from "./bits/247.ts";
import { bits248 } from "./bits/248.ts";
import { bits249 } from "./bits/249.ts";
import { bits250 } from "./bits/250.ts";
import { bits251 } from "./bits/251.ts";
import { bits252 } from "./bits/252.ts";
import { bits253 } from "./bits/253.ts";
import { bits254 } from "./bits/254.ts";
import { bits255 } from "./bits/255.ts";
import { bits256 } from "./bits/256.ts";

/** Bitcoin Puzzle Transaction, addressed by puzzle number. */
export class BitsCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "bits";

  /** Who published the puzzles. */
  static readonly author = party("saatoshi_rising", {
    key: "saatoshi-rising",
    kind: PartyKind.Person,
    about:
      "A bitcointalk account that spoke for the puzzle transaction once, in 2017, and never said who was behind it. The rest is on the chain.",
    addresses: [
      "1Czoy8xtddvcGrEhUUCZDQ9QqdRfKh697F",
      "1CENDvi6tmKGrR8RxqwURpX9WHbbKip1db",
      "bc1quksn4yxlxp80tn929gqnh8xpnngqj0fqr99q4z",
    ],
    profiles: [profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=991321")],
    facts: [
      fact(
        "The bitcointalk account was registered on 2017-04-27 at 05:43 UTC and posted once, 58 minutes later. Its last activity is dated 2019-06-09.",
        "https://bitcointalk.org/index.php?action=profile;u=991321",
        { date: "2017-04-27" },
      ),
      fact(
        "The one post says the keys are consecutive keys from a deterministic wallet, masked with leading zeros to set difficulty, and calls the puzzle a crude measuring instrument of the cracking strength of the community.",
        "https://bitcointalk.org/index.php?topic=1306983.msg18765941#msg18765941",
        { date: "2017-04-27" },
      ),
      fact(
        "The 2015 funding came from 1Czoy8xtddvcGrEhUUCZDQ9QqdRfKh697F, which received 32.9 BTC earlier the same day and has not been spent from since.",
        "https://blockstream.info/tx/08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
        { date: "2015-01-15" },
      ),
      fact(
        "The 2017-07-11 sweep spent puzzles 161 to 256 together with 1CENDvi6tmKGrR8RxqwURpX9WHbbKip1db, a wallet funded on the morning of the post, and raised puzzles 51 to 160 tenfold.",
        "https://blockstream.info/tx/5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
        { date: "2017-07-11" },
      ),
    ],
  });

  /** What the author said about the keys, in the one post the account ever made. */
  static readonly hints = [
    official(
      "There is no pattern. It is just consecutive keys from a deterministic wallet (masked with leading 000...0001 to set difficulty).",
      "https://bitcointalk.org/index.php?topic=1306983.msg18765941#msg18765941",
      confirmation(
        "https://web.archive.org/web/20200509045914/https://bitcointalk.org/index.php?topic=1306983.msg18765941",
        "Wayback capture of the thread page",
      ),
      { date: "2017-04-27 06:41:08" },
    ),
  ];

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    bits1,
    bits2,
    bits3,
    bits4,
    bits5,
    bits6,
    bits7,
    bits8,
    bits9,
    bits10,
    bits11,
    bits12,
    bits13,
    bits14,
    bits15,
    bits16,
    bits17,
    bits18,
    bits19,
    bits20,
    bits21,
    bits22,
    bits23,
    bits24,
    bits25,
    bits26,
    bits27,
    bits28,
    bits29,
    bits30,
    bits31,
    bits32,
    bits33,
    bits34,
    bits35,
    bits36,
    bits37,
    bits38,
    bits39,
    bits40,
    bits41,
    bits42,
    bits43,
    bits44,
    bits45,
    bits46,
    bits47,
    bits48,
    bits49,
    bits50,
    bits51,
    bits52,
    bits53,
    bits54,
    bits55,
    bits56,
    bits57,
    bits58,
    bits59,
    bits60,
    bits61,
    bits62,
    bits63,
    bits64,
    bits65,
    bits66,
    bits67,
    bits68,
    bits69,
    bits70,
    bits71,
    bits72,
    bits73,
    bits74,
    bits75,
    bits76,
    bits77,
    bits78,
    bits79,
    bits80,
    bits81,
    bits82,
    bits83,
    bits84,
    bits85,
    bits86,
    bits87,
    bits88,
    bits89,
    bits90,
    bits91,
    bits92,
    bits93,
    bits94,
    bits95,
    bits96,
    bits97,
    bits98,
    bits99,
    bits100,
    bits101,
    bits102,
    bits103,
    bits104,
    bits105,
    bits106,
    bits107,
    bits108,
    bits109,
    bits110,
    bits111,
    bits112,
    bits113,
    bits114,
    bits115,
    bits116,
    bits117,
    bits118,
    bits119,
    bits120,
    bits121,
    bits122,
    bits123,
    bits124,
    bits125,
    bits126,
    bits127,
    bits128,
    bits129,
    bits130,
    bits131,
    bits132,
    bits133,
    bits134,
    bits135,
    bits136,
    bits137,
    bits138,
    bits139,
    bits140,
    bits141,
    bits142,
    bits143,
    bits144,
    bits145,
    bits146,
    bits147,
    bits148,
    bits149,
    bits150,
    bits151,
    bits152,
    bits153,
    bits154,
    bits155,
    bits156,
    bits157,
    bits158,
    bits159,
    bits160,
    bits161,
    bits162,
    bits163,
    bits164,
    bits165,
    bits166,
    bits167,
    bits168,
    bits169,
    bits170,
    bits171,
    bits172,
    bits173,
    bits174,
    bits175,
    bits176,
    bits177,
    bits178,
    bits179,
    bits180,
    bits181,
    bits182,
    bits183,
    bits184,
    bits185,
    bits186,
    bits187,
    bits188,
    bits189,
    bits190,
    bits191,
    bits192,
    bits193,
    bits194,
    bits195,
    bits196,
    bits197,
    bits198,
    bits199,
    bits200,
    bits201,
    bits202,
    bits203,
    bits204,
    bits205,
    bits206,
    bits207,
    bits208,
    bits209,
    bits210,
    bits211,
    bits212,
    bits213,
    bits214,
    bits215,
    bits216,
    bits217,
    bits218,
    bits219,
    bits220,
    bits221,
    bits222,
    bits223,
    bits224,
    bits225,
    bits226,
    bits227,
    bits228,
    bits229,
    bits230,
    bits231,
    bits232,
    bits233,
    bits234,
    bits235,
    bits236,
    bits237,
    bits238,
    bits239,
    bits240,
    bits241,
    bits242,
    bits243,
    bits244,
    bits245,
    bits246,
    bits247,
    bits248,
    bits249,
    bits250,
    bits251,
    bits252,
    bits253,
    bits254,
    bits255,
    bits256,
  ];

  /** Techniques every puzzle in this collection was built with. */
  static readonly techniques = [
    technique(
      "masked-key-range",
      "https://bitcointalk.org/index.php?topic=1306983.msg18765941#msg18765941",
    ),
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(
      BitsCollection.key,
      BitsCollection.author,
      BitsCollection.puzzles,
      BitsCollection.hints,
      BitsCollection.techniques,
    );
  }
}

/** Canonical collection instance. */
export const bits = new BitsCollection();
