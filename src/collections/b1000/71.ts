import { puzzle } from "../../core/puzzle.ts";
import { bits, funding, increase } from "../../core/parts.ts";

/** Puzzle `b1000/71`. */
export const b1000Puzzle71 = puzzle({
  id: "b1000/71",
  chain: "bitcoin",
  address: "1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(71),
  prize: 7.1019168,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.071,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.639,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      6.39,
    ),
    increase(
      "5863063e1fdc2ef84cbb3cea03181faec9e62356a56dc330e7511f67ec50d610",
      "2023-09-25 15:00:17",
      0.0000377,
    ),
    increase(
      "8c75b040d6f335cd1965b205938435baa6bb1b8a2b00038f71d991fd3c7dc0b7",
      "2025-01-28 02:11:50",
      0.000006,
    ),
    increase(
      "b30914607fed925b42a87004ed3b373bd413ac35302d007f28ffbb738c63245e",
      "2025-05-03 09:59:35",
      0.00001,
    ),
    increase(
      "076d820e3100580012a1bcca15987c0d8638cae912f1f4421f05e97cbcdec3b9",
      "2025-05-19 18:56:09",
      1e-8,
    ),
    increase(
      "e29e1a2200867cbd886a42c8222f0dee1a53b83aa577df5e477d11e3fa9e90cc",
      "2025-05-21 10:01:44",
      0.0000888,
    ),
    increase(
      "72fa88fe21d2cb40c1af0a3022d4e5736ae1c66c6f1afe72463e1791706629c5",
      "2025-07-30 09:32:34",
      0.00001,
    ),
    increase(
      "966c854ce03054ef38f6fdf5ee9a746f03bb34d2ec86101e214d22b2f15b0f0f",
      "2025-08-22 06:05:53",
      0.00001767,
    ),
    increase(
      "dc895ad8b1eb570560326bd0f9c8504304cf03f51c0ce2a753fc4cf29108d24b",
      "2025-09-01 21:47:45",
      0.0000071,
    ),
    increase(
      "c03df28a719a110c50b51e92a0831c28433d6b12180a94e63c4c519b28654e1b",
      "2025-09-02 21:04:37",
      0.00000898,
    ),
    increase(
      "9540c7d4ca42c32cafa643f4dd3f0a4c3beca2fc3c585cd980f474acb6a0267c",
      "2025-09-03 02:48:52",
      0.00001,
    ),
    increase(
      "8aa20456d64c7969d0546cd819437275e78d9bcbc692e93b26129faa98de5cd7",
      "2025-10-07 08:31:00",
      2e-8,
    ),
    increase(
      "2a18ccf613b076d633099a4da35fd7f72bc3c2a87a2f72a111176dc64271cc11",
      "2025-10-18 00:18:40",
      0.00001,
    ),
    increase(
      "eefa0ac5426b7b6df98d7d85d172d7e42cb714c649ac8fb9629e5571ee7dd78f",
      "2025-12-13 13:35:31",
      0.00001941,
    ),
    increase(
      "a2808acb455f636dc988186219d025e6507bd80640b0056b46583232aee7cfa5",
      "2025-12-14 21:33:17",
      1e-8,
    ),
    increase(
      "984a21a08b0318946289e7a7fd4ffa2f6589a35479a144385be332690e5de5d0",
      "2026-01-05 13:57:50",
      0.00000272,
    ),
    increase(
      "284abb50eef592bc67df021400acdec80830b416d6bdae0baadbb690f4aaf215",
      "2026-01-07 12:38:55",
      0.00000546,
    ),
    increase(
      "0b2420fd30112883c6b2cfe8be555c9ebe1f8b7e8a72ad0c6ff862f3287d3c49",
      "2026-01-12 20:47:15",
      0.00000808,
    ),
    increase(
      "9dbf08a2d3a325891bb93fa41659e095f0fd6a1f3507d94f9a48c0e398e4f7b0",
      "2026-01-15 02:55:03",
      0.00001,
    ),
    increase(
      "152210173d20a6945fe353d7cc4b02c431756a3009466dffd51723d55c6b4cc4",
      "2026-01-15 17:38:51",
      0.00016608,
    ),
    increase(
      "e1ff88820314e973dfbaf9ae4a9869f7780cff94c63571b21dbdfbc6dfdf4839",
      "2026-01-29 08:44:39",
      0.00000853,
    ),
    increase(
      "5e15cf4939b4012f61176cc63fea74ab16c25015609cd3c05ab22f168a983bd6",
      "2026-02-15 14:22:00",
      0.00001,
    ),
    increase(
      "65fa8a09a6e50826ffcc9e824de6b83a3c7906d7353c2af10c45eb666c4d80f2",
      "2026-03-08 22:20:18",
      0.000015,
    ),
    increase(
      "ff344c2d1fed64aa345a1e448f041d778ce8c03c7d89751fb160765c9ee2740f",
      "2026-03-23 01:56:36",
      0.00007354,
    ),
    increase(
      "35e4b13cc20c46400e7551246c21be9a8aefd729615d0194fe684781d9354e33",
      "2026-03-24 07:29:31",
      0.00000555,
    ),
    increase(
      "2fa444ecb35f83b54ece03325cb047e1c7453f8bf1e716923072968955a15fd9",
      "2026-03-30 15:55:35",
      0.000042,
    ),
    increase(
      "032364b1aceb70a8c5d93170d159fc09df9b95ffcee37a15bda9f4ecfe6179b0",
      "2026-05-26 21:07:04",
      0.00042119,
    ),
    increase(
      "63188eff17a01aeaaa72c27306a8896f06733a1531cb0bb1f0560ac32a1b8284",
      "2026-06-05 06:02:18",
      0.0004623,
    ),
    increase(
      "644e73476fe7ebfe3ac95dfb7a50180943997558ec952a9849c4acfbee6def41",
      "2026-06-13 20:17:13",
      0.00005,
    ),
    increase(
      "d8001be6f64a846dc16c5c79708f2bec1554a2abed31d909fa0202bc2040c7ac",
      "2026-06-14 20:33:01",
      0.00001678,
    ),
    increase(
      "6aa21285b68b42210e97b44009429261245af4fb6054e7ffe6857d5951153699",
      "2026-06-15 23:34:38",
      0.00000546,
    ),
    increase(
      "bfdb9acaf7d7ca4d798c88a59466fe950cbc3a27dc6ea0b2b6685415dcba2afc",
      "2026-06-27 02:59:16",
      0.00001033,
    ),
    increase(
      "fe44716d0ec7798d3a3c7cf0aa0c1b07681e176d171cbcb9d13300edcea6f90b",
      "2026-07-19 08:27:00",
      0.0000329,
    ),
    increase(
      "7384a29ca2d82b8c6117963afa83885a5f43186b496affeb014fda1ac7779ba8",
      "2026-07-19 12:51:21",
      0.00001938,
    ),
    increase(
      "297d8f415591e4cd8353d70a3e6a471b261b4f096954ab330eb0181b669ec750",
      "2026-07-19 13:00:54",
      0.00001938,
    ),
    increase(
      "0e3dcbe4b1b2b6407ce09910190d7cee04f5bf030b7db1df99fb564bdc03f762",
      "2026-07-19 21:36:29",
      0.00001551,
    ),
    increase(
      "b8451f855fb33815b578039a3219fddd16763ef9e71f0d1ef6bc3edd7d9f29a8",
      "2026-07-19 22:07:06",
      0.00000686,
    ),
    increase(
      "1283d0dc13599516ec1ce3b900330db0c42e30491b04cd60c673d9c22eb3fc29",
      "2026-07-19 22:39:09",
      0.00000773,
    ),
    increase(
      "1c8fc46f617594c886aca25526c544533cfc127b39ebfcfec3e61f43471e92bf",
      "2026-07-20 00:01:11",
      0.00000702,
    ),
    increase(
      "8480a75d513c27ebc23e2ffbca17de8c6ac75b0c31fd8d1e2cbef1ed25b6467c",
      "2026-07-20 09:40:54",
      0.00000666,
    ),
    increase(
      "0a6a0b5caaaba7f868d393c6e19e6ce5f5c62c4dbb1e457f0ea362e3a50aac5b",
      "2026-07-20 11:08:30",
      0.00003298,
    ),
    increase(
      "ca091c302eb10ae5ec6a6c850b6955b1dfca44d30e38790f9cb8c75784b70b35",
      "2026-07-20 12:37:11",
      0.00000555,
    ),
    increase(
      "a7565ba869b988b228668fdd7853c406ce9913d3dd2d0a667ab3b189cc1d847f",
      "2026-07-20 12:37:11",
      0.00000555,
    ),
    increase(
      "73a9db56c8c9c8aab3c727488de45c5a852d4d78da18d060a48c362415c065c3",
      "2026-07-24 13:09:38",
      0.00000713,
    ),
    increase(
      "61d9f47959e2364256f2b2576daf485b327db0a1962a7d2c073127ab794d087e",
      "2026-07-24 13:09:38",
      0.00000702,
    ),
    increase(
      "ef872a19a5159d35f037ded08631b057b957d3757baf12fe939b89d867e3321a",
      "2026-07-24 13:09:38",
      0.00000773,
    ),
    increase(
      "529d041487c2cef0aff782fa1547b75e5695e84c4cbe4b59bc9403468af8100e",
      "2026-07-24 13:09:38",
      0.00000704,
    ),
    increase(
      "3ab162360b094a2f9e825ae2d1ee4597d098a659929359b311828393e13e2f36",
      "2026-07-24 13:09:38",
      0.00000726,
    ),
    increase(
      "eaa5fc9c796bbe9fdd441bdbfd295639b28654dd9b9c6d3855367d16b8e95900",
      "2026-07-24 13:09:38",
      0.00000817,
    ),
    increase(
      "ee23b442cdfe2080d8fb348c8c06b2c59582bfeb45a129f4cf74cec603b2d13c",
      "2026-07-29 22:02:02",
      0.00004427,
    ),
    increase(
      "c68a525265cc75e59dd74ef071daf1bb170dc3c62a9bb702c0d636db40632ae2",
      "2026-07-31 21:53:57",
      0.00001,
    ),
    increase(
      "e06d7c2aaec6a758fb5d9d36c3037c595670bbe3d2e176d6ae4af0e052313375",
      "2026-08-02 05:01:01",
      0.00001,
    ),
    increase(
      "b67d201718b257919ec07ece007225b0bf204121c1acee9807ee61ecb362e2b6",
      "2026-08-05 17:40:23",
      0.00001,
    ),
    increase(
      "4e1f8778fbdb3fcc14d7d03d80012f3ad1900f243a0155ad3b930d8c4fec7b54",
      "2026-08-07 10:10:12",
      0.00001,
    ),
    increase(
      "8d99b7667ac8f865b33da5cdda4683aadb8728c36fcb33a96cec34630ddc405c",
      "2026-08-22 19:25:20",
      0.00001,
    ),
    increase(
      "1907d09cf2c8f2164aa05c6a6d82537d7c1d5668fe79492b434b269f52f652d9",
      "2026-08-23 16:20:06",
      0.00001,
    ),
    increase(
      "35710a42f5b8ea7a9b4d9813460a44b1fba27adf97647f8dfac96d20f70af362",
      "2026-09-16 18:11:43",
      0.00000666,
    ),
    increase(
      "5bbde111c3fe367de128459453338652ebf11b2be2a237c03bbf2e6412f7a13a",
      "2026-09-16 18:11:43",
      0.00000666,
    ),
    increase(
      "7c86f3093374296f9035d68176cadf6fd37dae4d6bd4ce6067d4a25b9d7b8b2a",
      "2026-09-16 18:11:43",
      0.00000666,
    ),
    increase(
      "9768a5ae6a22dfa331cd26039d8a6f2c203b2edf9075385c49af4ba8c2213f28",
      "2026-09-16 18:11:43",
      0.00000555,
    ),
    increase(
      "f434dbf68fba76465eeb9fdec908722aeec61bf4a30714d5498d21c61664503a",
      "2026-09-16 18:11:43",
      0.00000555,
    ),
    increase(
      "eb8fc796edfdb7efe19531687e7344a5a2365078f5d3ac40ec5b6679c54ad2b0",
      "2026-09-16 18:11:43",
      0.00000555,
    ),
    increase(
      "6b54e6eecb97e457863e0d7236aaf125c2359dc159b50a529dfbf58b73e692d4",
      "2026-09-16 18:11:43",
      0.00000555,
    ),
    increase(
      "74edb91701e5f63c9379b3a0ca382d4a791c129c5e2352b4a385921211f5dd7a",
      "2026-09-16 18:11:43",
      0.00000555,
    ),
    increase(
      "224c0fdcce7711bfe65ecc4b5098f0ef7ebe5335faaa1e6e6ca98b77edcab6c4",
      "2026-09-16 18:11:43",
      0.00000555,
    ),
    increase(
      "f65440d9d2820cba798243fb46fcaebac062f0ea5e075301e77099700209cda0",
      "2026-09-28 21:11:49",
      0.00001,
    ),
    increase(
      "572001d88e5c3030a89fe119e62cf80892876b59dcb9efe91348dd38745147e1",
      "2026-09-29 22:18:51",
      0.00000666,
    ),
  ],
});
