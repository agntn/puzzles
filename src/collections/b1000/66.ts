import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh, party } from "../../core/parts.ts";

/** Puzzle `b1000/66`. */
export const b1000Puzzle66 = bitcoinPuzzle({
  id: "b1000/66",
  address: p2pkh("13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so", "20d45a6a762535700ce9e0b216e31994335db8a5"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("024ee2be2d4e9f92d2f5a4a03058617dc45befe22938feed5b7a6b7282dd74cbdd"),
  key: hex("000000000000000000000000000000000000000000000002832ed74f2b5e35ee", 66).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qZfFoWMiwBt943V7CQeX",
  ),
  prize: 6.6,
  solvedAt: "2024-09-12 22:59:39",
  solveTime: 304836745,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.066,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.594,
    ),
    increase(
      "c725a765997cf82ca4a40cb2166f9ed2c2677e9ad9446112dd94920db7034a07",
      "2019-06-20 20:49:30",
      0.00001,
    ),
    increase(
      "9623ca8da4f10db5ca90a0673674571a3150e568cb82c2e2ad6ca55af77a67f9",
      "2019-06-20 21:20:44",
      0.00001,
    ),
    increase(
      "ab571acb61ec96a4759da551ae37a1fe5accbd353dfca3e1a57cb254e5e0e790",
      "2019-10-31 20:18:31",
      0.00000666,
    ),
    increase(
      "33ea377a3c0aa2e10f498a41f746d7489e06bf9b6e45b406b817ee96e4cec96b",
      "2021-01-18 01:01:38",
      0.0000195,
    ),
    increase(
      "4461b388764735edf0b8b35456846c251dc7e281a8837df42f684b4bfce91f72",
      "2022-09-25 04:13:35",
      0.00001,
    ),
    increase(
      "c1a490e56f7faea9c064fd30023647780d5b3fa330cd7ec10c60c513c3f36813",
      "2022-10-18 11:43:20",
      0.00001533,
    ),
    increase(
      "1602e46f048a7466db2f630f74e6f83a6e72fb2726067ac719c7de3ab784689c",
      "2022-10-31 14:29:20",
      0.000006,
    ),
    increase(
      "3615aa6fc46e190a9d542844172a105191c902402ff753c96f6bd591ea2aecad",
      "2022-11-19 16:31:43",
      0.00001,
    ),
    increase(
      "acdf413e69ab69a2628e50225096f14fab57483b1d908387e00d593d56abe425",
      "2023-02-23 03:23:43",
      0.00000908,
    ),
    increase(
      "7cce2dde07daaa77a0c2159ae079cf56a1b9ca8196c0b122666d3d40d5314e22",
      "2023-03-01 22:38:23",
      0.00001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      5.94,
    ),
    increase(
      "a453faa9ef528a3b7918f79f01c07c3fe93f2b8f3d193c89e29a69f40f53b577",
      "2023-04-27 04:47:38",
      0.00003526,
    ),
    increase(
      "b33947a7c57fc75ecf94bf4b8809ed0d8cc2c8c0ac0008cfe44c91ebd6854605",
      "2023-04-30 05:02:59",
      0.00001279,
    ),
    increase(
      "085fd326dc36377342bbe915533c3c94453875a4408ae9f9f60025e2793b98e1",
      "2023-05-03 14:39:54",
      0.00013364,
    ),
    increase(
      "236806fad5606e2a496b6671868f3d4efd77f3b4da7942322b62ebff3a00028b",
      "2023-07-27 19:04:45",
      0.00002869,
    ),
    increase(
      "cf7ad170e2f58aea83686095607b12a04cbef15679383a11c124d953bd2c5a6d",
      "2023-08-25 08:22:59",
      0.00000749,
    ),
    increase(
      "f3db7c0088b6d2f357008854441cfab93583d4cc0d4dc026de0f158f7ce5ac9b",
      "2023-09-25 15:00:17",
      0.00003769,
    ),
    increase(
      "6a76cd295c5fe4037511c2e5c2945b99aa52e2fd41d014943c0a975e08a5ce17",
      "2024-02-19 11:23:46",
      0.000067,
    ),
    increase(
      "8da7b3599f9fec422ace5d290443c17f685d6e45ce89ca1ee0a334b711f10745",
      "2024-03-12 21:29:44",
      0.0000066,
    ),
    increase(
      "8cc982de6db7539fa665840ff774d69807a9d85c01e17620205da67de995ea29",
      "2024-03-14 03:22:22",
      0.00001277,
    ),
    increase(
      "cff6de5c21176e8cb9d60fcf1e2a2d9a44b9267860126cfddee5d7fa39ab27e1",
      "2024-03-21 10:13:55",
      0.00006018,
    ),
    increase(
      "55571ca5e1f86c11a5ec5837aa1edf4262042b4b18379373585047ce8f8938cf",
      "2024-05-12 00:07:46",
      0.00000546,
    ),
    increase(
      "acdeeb926e2eacd19024867cd7df0b4339c4940687c8562853ef499683f0a064",
      "2024-05-18 14:37:26",
      0.0000812,
    ),
    increase(
      "b6064fe616abb0221da96652bbdce82b545e4069084cdcdb5cad717b2f301bd2",
      "2024-06-27 20:23:46",
      0.00001629,
    ),
    increase(
      "7e8c361a44646e7016d316ce777f838f15cd1cf7440684e884bf37c28f97a642",
      "2024-07-14 01:09:57",
      0.00008382,
    ),
    increase(
      "4bac263083823b95b8cac1ece40e5c288bb084eb94efba1b2d73b6dcb6ac30e3",
      "2024-07-14 05:10:53",
      0.000006,
    ),
    increase(
      "95dd4f8609851cd7477a5b2e8744a18b7e24e9c8adcb964a4dcaa6e360f17690",
      "2024-07-25 13:54:46",
      0.0000066,
    ),
    increase(
      "25f02f5997e30cacce3efda3036803fec56c41e96634551ea814a93075a675b4",
      "2024-07-25 15:11:25",
      0.0000066,
    ),
    increase(
      "0c10efa88389fd8d3ec14930270a1a5bfaab55488e0014cbec092e42a01ab416",
      "2024-08-03 20:47:01",
      0.000016,
    ),
    increase(
      "1e298e15cc35a3b195e79acc602cd3e1c503c616ba1bf3a19e1cd0feb1e8db71",
      "2024-08-19 06:46:05",
      0.0005,
    ),
    increase(
      "1384102b7955d1c56a2501641d619fccc253a2270003ac6a1d42ad0fde3bb8d7",
      "2024-08-19 10:45:37",
      0.000015,
    ),
    increase(
      "619e8eca7bf5ce834f5cee2f49c6cbf4e32a8ec697f49230172691ef1686c024",
      "2024-09-08 12:46:11",
      0.00001448,
    ),
    claim(
      "57a88f47e4c047740b782a5562fca143ce85de0373cbff3a7d406e9ae7fc2f5f",
      "2024-09-12 22:59:39",
      5.94,
    ),
  ],
  solver: party(undefined, { addresses: ["bc1qpkp47q5cucrvnyepsdnjcv2kzyav5ze0ta7n67"] }),
});
