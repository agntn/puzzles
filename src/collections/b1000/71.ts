import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/71`. */
export const b1000Puzzle71 = bitcoinPuzzle({
  id: "b1000/71",
  address: p2pkh("1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU", "f6f5431d25bbf7b12e8add9af5e3475c44a0a5b8"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(71),
  prize: 7.100226,
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
  ],
});
