import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  artifact,
  assets,
  decrease,
  digest,
  fact,
  funding,
  increase,
  party,
  PartyKind,
  profile,
  stage,
  technique,
  uncompressed,
} from "../core/parts.ts";
import { puzzle } from "../core/puzzle.ts";

/** The community writeup of every published step, pinned to the commit the answers cite. */
const WRITEUP =
  "https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/fb92dd15487c6e2d275adb8c923698b7166c328e/README.md";

/** The writeup's section on the page with both ciphertexts and everything behind them. */
const PHASE_3 = `${WRITEUP}#3-httpsgsmgiochoiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself`;

/** The page that carries both ciphertexts, the one the phase 1 answer opens. */
const CHOICE =
  "https://gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself";

/** The SHA-256 of the text on the first image, the page with SalPhaseIon and Cosmic Duality. */
const SALPHASEION =
  "https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32";

/** GSMG.IO multi-phase cryptographic challenge. */
export const gsmgPuzzle = puzzle({
  id: "gsmg",
  chain: "bitcoin",
  address: "1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe",
  sourceUrl: "https://gsmg.io/puzzle",
  startedAt: "2019-04-13 16:32:40",
  pubkey: uncompressed(
    "04f4d1bbd91e65e2a019566a17574e97dae908b784b388891848007e4f55d5a4649c73d25fc5ed8fd7227cab0be4e576c0c6404db5aa546286563e4be12bf33559",
  ),
  prize: 1.25636967,
  transactions: [
    funding(
      "73e48ff571a7e9a4387574a50cf2fcb7b21b6ea5702c777a035664df57cbce02",
      "2019-04-13 16:32:40",
      5,
    ),
    increase(
      "a2d2481d57e976dbaa84812a504097150ded09216957aeb7bf0177eaec6a7a8b",
      "2020-03-24 01:08:49",
      0.00000666,
    ),
    increase(
      "a798905f53fdcadcbd2e2a1e61d23ba69a07e26130a78c76da4bf4d7a170f383",
      "2020-05-11 20:02:50",
      0.000007,
    ),
    decrease(
      "2aa9a4a90be819d5122d70c993280785a0508f163521e7b38cebb4db0b071b13",
      "2020-05-11 20:02:50",
      2.5,
    ),
    increase(
      "f28b0b68684b41c98c8c59f43558e2bfbe5aba30fef05fd7dc465dea62fbaed1",
      "2023-07-16 07:31:59",
      0.00000666,
    ),
    increase(
      "81d359291da8eeafea2fee9a1304497afeed289829495da19f1a5688573770fa",
      "2023-09-25 07:00:59",
      0.005355,
    ),
    decrease(
      "88cdb3cdca12b471551b1b26188508a14ca5fd8a415223ffb7c190381c9b9df3",
      "2024-04-24 21:47:27",
      1.25,
    ),
    increase(
      "96d702ef646396d3f4b7249e209d3821025687c49cd23b7da7d15ea17efae7ee",
      "2024-07-08 05:39:27",
      0.0000441,
    ),
    increase(
      "948c5a7c20db6788caa6c0b34f20ec624b9483429ac321e2ea19b9d2a84f2f22",
      "2025-03-04 05:22:18",
      0.00001,
    ),
    increase(
      "a1aaf63f1bfd365dec08c05014a71456e3ff2fcef7fb700eb6442f404e1cb8fc",
      "2025-03-10 00:05:45",
      0.00001,
    ),
    increase(
      "2e67fc77bb767f67d0927da94f6591cda46460849ba52a0abbcf6b209591bd3c",
      "2025-03-13 19:11:37",
      0.000006,
    ),
    increase(
      "4e82ab79ddcc4f26891bcc2ee39936630490b7ec451b63c646b8d07b62cbf872",
      "2025-03-13 19:42:41",
      0.000006,
    ),
    increase(
      "4237e268bbe2cafd0b352f442fd53840ba1d60773ca112b57dc03b539fec046f",
      "2025-04-01 03:27:31",
      0.00001,
    ),
    increase(
      "beb195487a7b457aa528d9f2fcbd38588c61e95ff3855b0cda7a1fb2c7742568",
      "2025-04-22 18:04:01",
      0.00000666,
    ),
    increase(
      "8890ec6059be7c05b90dfee097d432e2cdfe71300c7c811a80caaef26f0ca8e1",
      "2025-05-17 23:21:09",
      0.00001,
    ),
    increase(
      "60769301921777e216afc31140ebe0a37889308aea6b7c26fb3977000461190d",
      "2025-06-16 06:16:47",
      0.00000546,
    ),
    increase(
      "91f9b800d6902be337f1eb6b24c58b93459eed0eb548a53b04ce4cda4ad123e8",
      "2025-06-17 14:49:29",
      0.00000666,
    ),
    increase(
      "4a6ff26884b7137d0dfa79622036ea47d3589b46ae7be61b85ceb19a40779e63",
      "2025-06-26 16:40:57",
      0.00000546,
    ),
    increase(
      "c52c212656a184c8603cb1c0c58424976b760b49a2caf59ad4bdda11f258acfa",
      "2025-07-06 18:50:31",
      0.00001,
    ),
    increase(
      "b9d1b0e9f5a6c9c67d79370971a39d13d15bd6a4354a06c7ee3b48655e301bef",
      "2025-07-10 20:44:44",
      0.00000546,
    ),
    increase(
      "c2d07560fd5d14ebe49f4221b8a1f443ae840a7734a030829debba2acb2e22c5",
      "2025-07-12 06:06:03",
      0.000007,
    ),
    increase(
      "052a37c98c88b425347fe9ab624f24fa84048c5bc6ef1330df0d72d5c6fa6813",
      "2025-07-12 20:10:15",
      0.000006,
    ),
    increase(
      "225c18a4f526772773dbf8b7891e22635848158b88cf560e27497d438b894a45",
      "2025-07-12 20:10:15",
      0.000006,
    ),
    increase(
      "9ad120abe20a5f63660ab0dc6631955ea4f42fac399f586e4080759ccc1ee9d9",
      "2025-07-12 21:10:34",
      0.000006,
    ),
    increase(
      "2a6ded8422adfb1ab5673f2a442550cf3ee70c65ddb739aeb90a09c2681c2642",
      "2025-07-25 03:36:13",
      0.00000546,
    ),
    increase(
      "301c06a9bc352e28bae20ab56c5532705eb80dae10075f7bb0eaed24907851ed",
      "2025-08-04 11:47:44",
      0.000008,
    ),
    increase(
      "6c1c632ecf1e580f7c0e7474395e2f532fd230ac60d11f26a3c0e58d1af0a4dc",
      "2025-08-11 06:56:12",
      0.000007,
    ),
    increase(
      "34da8a915741d806e659f53aa7f31d84c7bb74d51244e698f150df00e7211517",
      "2025-08-14 23:33:15",
      0.00000546,
    ),
    increase(
      "c7e2cf4ce65af5b29ae2e0aadef1fe4a624a2aef1f591393c8ca7b87b3c1d145",
      "2025-08-26 19:55:33",
      0.00000546,
    ),
    increase(
      "cf2ad88cf7fa4e8767eed2252bf85add5992d68ef5036a7b8cdce37f799b8005",
      "2025-08-31 08:47:26",
      0.000008,
    ),
    increase(
      "ca6391d7dfe5e47dd146ebc5b7af53e28bbcec05d1c06ce5804f63fbf28b8a85",
      "2025-09-04 14:42:18",
      0.0001,
    ),
    increase(
      "3775e974b0ace913e4f5e4c5849f6d2bf29278bd2b3d14bbf8b8b1ea021869ac",
      "2025-09-09 01:11:01",
      0.0000107,
    ),
    increase(
      "99c5a71130ca23d7f1a5d411708c7fba2c54c6a779547463999801d4f2601a48",
      "2025-09-10 20:29:57",
      0.0000238,
    ),
    increase(
      "dcc606e01f0f79dcd52f229f6634d508950eafa2ef37102e6d4e3bfd99b5d407",
      "2025-09-11 21:13:38",
      0.00001,
    ),
    increase(
      "079f5b476b8ef2762eb2c39a9848a2ee9f416d8e8198db16e94a63d5060e3d15",
      "2025-10-16 19:33:56",
      0.00001203,
    ),
    increase(
      "4e689d921d7f280ce4c32a031fc4c8cb737be0925bb4586345c5075b9a5b17f5",
      "2025-12-06 16:33:04",
      0.0000268,
    ),
    increase(
      "42c31f54760d9d7f72d4a1650c580d8080788c80e470c008b9a27f92bb4cdf0a",
      "2025-12-23 21:59:31",
      0.00000666,
    ),
    increase(
      "66eefd6ad925bc38a10210161cb91dfa48dfcedf1eef7c15a23c5c3a3340f9ee",
      "2025-12-30 15:26:26",
      0.00000864,
    ),
    increase(
      "15e9f80585f05f60feeb933e1bb2ad3ed34553c87521f57c70bead1d0513df6d",
      "2025-12-31 20:09:48",
      0.00002026,
    ),
    increase(
      "856185687ee9f2ca19b1fcd9477541f09c653da886360257c55061e4e3d05796",
      "2026-01-15 17:38:51",
      0.00000546,
    ),
    increase(
      "3168021b8f161aee624f1c6b14032b20b46c33c730361a9ddba66a6856f68cd1",
      "2026-01-20 20:40:22",
      0.00000546,
    ),
    increase(
      "b5b20fcd04ed85def9010c8e45f1436786bc6013d198909f45f2895c1a589ca7",
      "2026-01-21 14:52:15",
      0.00000546,
    ),
    increase(
      "6694dfb1442cca1da21169740f77decb636429e660cbfc67b8076c9532ed9f50",
      "2026-01-23 07:49:56",
      0.00002526,
    ),
    increase(
      "bd9df00780fb53894a3e7be022e7118fa556827ad58dabbcda6124f7e9795e30",
      "2026-01-23 07:49:56",
      0.00002526,
    ),
    increase(
      "436d1bbddee8f6e61fb4481e3ad243f6f708ffb831f0448869503414839913c2",
      "2026-01-25 08:24:02",
      0.00001126,
    ),
    increase(
      "965b73547f639a41dc000db4f62c35fc4a373bd31abab67d0f9ec46a26af740d",
      "2026-01-25 12:00:18",
      0.00000546,
    ),
    increase(
      "9160a9e4d3e33d856b9fc7a1e00517c37115b00b5389a9a5fa545a7130a285c5",
      "2026-02-19 18:09:18",
      0.00000783,
    ),
    increase(
      "96a808a83473dab3479337e99bd5131b2748e973b4daa31a51600d775463979d",
      "2026-02-20 07:11:37",
      0.00001,
    ),
    increase(
      "2f8fbad62d6415c9c931066ebf8da09b929fea3605efbe3ce1b92bb5a2b78890",
      "2026-02-21 22:49:14",
      0.00000546,
    ),
    increase(
      "de304f0426c932b998816f9a60542e492f65123464fc7c725141bc397067c737",
      "2026-02-21 22:49:14",
      0.00000546,
    ),
    increase(
      "5e2c65a21fc5e745c82dfa311c51ed3b1c09b8a1409b03fc70c2984bc9174939",
      "2026-02-21 23:01:57",
      0.000014,
    ),
    increase(
      "b9dbb788e68cd91c03f218dc6514775323d30a22a8ec300f62471ac7aac0107a",
      "2026-02-21 23:01:57",
      0.000014,
    ),
    increase(
      "02abbfc2563672d99a4e6ad3e7af01df43a7db5773a42b11e3ab8227bf99381c",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "083f3688a219738453afa9bfad06871179531314f678ccc4c745d50d7b9182ae",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "0bd3f5a9064ba45e2560e65a3a1d5a6b050be530dc5c86ce5649beb0b3a7e70c",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "222c492b0083bec0aefaa39bed624f2e89da40f415c8e03c36d2a35c0c8792b0",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "25c037ecc5f9b59ada0f3a51618c7208dd370eda0ddccf9984004ffd96f6e6a2",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "2891a19577c9becc8d93e2207ac6af446a49c80a6a7f4bf39dea74090b7e69b5",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "2ba7b1463745c637c76bf054b4833779a783b4b6e3676d0db49f0c30811a3900",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "3357a80b26343fa711d4be67bbcfee71b5f708068f7a0e7fca94c0d2d1da5904",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "33f183c8d31e32b493dd405bc9b6d04b9b5a937537de285023a04b78e635d387",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "3488aa173887cceb064906e9ef5348973100478977acf10885e5ad823dde5e15",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "35fbd774c19ea5dc4974d82b908b1126e29fab5513f86596ab775b4db6c7426c",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "3ceb3135a8d4f4277cbac8ba3d0f06c448b1479ed692e016b765a2f1fc4adbd5",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "41103ef1cda062c07bfb24fafd4be1b587ffd0ddf0ad2125d6fd0c5cc7e6b23b",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "4cf92d1cd32ad23ee0a442fe60aa046261d4dec2b90d81aa768573fe48abe2ad",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "5c3f41356ba32eb0554dd4ddf4b299bf478fbbebfe43c09a1be1c1d8a1a3d247",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "6119c9969b803d02a804202666f97455c33eedbb9dde75987528daa804e8f619",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "71ad53f1c2cae28e3239e43f38eebf2859d63099ad52ad7ea2a037a01a58e80f",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "7b012ef79590f99522c6481f53072ae443853a57e90d781a3e1550e7b7b5dcb7",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "7b8ea45c32d5242c56569a0f75fcf061615e8147b805d5e8b445ed9cd89f7497",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "7fff061565c59aee9ff08566b97bce176aa70a0b09e645ec50b1f27e6aeb66f6",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "96030fd458fde9de8c8cc3cdc8f2fa1616c2f8c4fde1808fd05a1f970fc6cd4c",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "a10cf987f53116dd997dc6a328fa74b0a19553092c0c2abc56e3a3ed3eccad06",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "a63527f312dcce0d38973f3ee95e9994e9848d0bfa0695b2e5452ef9b2748a77",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "a69453857ffab8b3a449a7bf2070094ebf8f72616ffcf55ebbf76859bb49c39d",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "a93a85413cf095482a93dfc471a274fa9b3f95dee8c2447a06462327cc108c27",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "aac29c0d7d64fa5c49ac758384a81aa521acdd419bb399514b9b0fc5ae8c4d9f",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "ad7237973633da3562ae666179265bbf77318e47768cd9d7e2cabc5d6808506b",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "b73bd4015827e45cb8cbcf66b41e7e8d0f4126926f142d41a2bd79a3fd5c642a",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "c184469d7e6fefa43a220944d6ea8adc33991aaa50808fc3ddb41c276ee6def1",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "c38cabb17d7d762c57d48219b6b3e8fbdd4de447d2125d040af0a6f0886a29cd",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "c8d0886f977fc80af63ca49341a71d772b70c2d0bb7ca6a850881c9f052552bb",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "cf9d667cd870fb2a55f389a6f85409ddb0830f5e20b14dad12a803ab37770cb0",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "cfafec470abe58138565b5308f20280d50222f5d9a72fab9d76d925ad7c01a19",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "d2173770e0670ea3683cdfc8cdeaae46e8a30c494cf5bd88a5eb4db6ab250816",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "db9331cfd886a5f3e9b71ac3ceb860af29cc130e7d9eec9b3683e496504e2af1",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "e1ebff57a21c01582c005c3b9e921979a864aa9951abe1ba5eaa8c1a1a3d06c7",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "e1f73b490b70748d9865e01aefb1593d71798ba488b998300fe4f600ce66e982",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "e30099b1eb38c2690e501bd6a0269aec7f048b3f09ff0b56058fd67162762ed1",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "e6f3fd557eb633d111c8ac076ce25ed893db18acf3aa30bb4346d01c1a85f740",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "e849fbb0f78fa84545612c25f4ae82a7117c48cb0bc9a92519ecb43c6bd876bc",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "f2510bd7f8d910e85265eea462ab3b8b9b2ecc0f25b42cb9742a3eadd2646626",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "f5007cd87022770ecccd58b77c958b54d7d2ad97caac77db53a8b671071c28d0",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "f74ee485896ebe328f8306c67eb859caca526a1a27295df8c268368901ff4fb6",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "f85058dbfe7f8a5c71bd6676a799d9742d4438536ae380c834523e419ebbfaab",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "fabe37c9058b9e2bcc606cb512efe3bdd145ad429663dd24ab14e770f5abf107",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "fdcd6e3c630ef8588c3b32ee3b1885a09d3097417f576eb74fa7feb7e198a75f",
      "2026-02-24 18:52:54",
      0.00000546,
    ),
    increase(
      "01d66f66dc12a2c7a7b892848a1ee95bae3de4bb00e3a8e4bba17963a89d1246",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "070444ab8976975dd21d6b0e2f29d4434d35c0afe87b90ea99dff1f6ad3ba30a",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "0a756d0b9aeef1a4743ee108123db6ca76be961835964c6eaa61d9b5fe4b1526",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "1698785ff7ab0c678bbbe5f0be4f1c5f53bac8fd92c5ad9d0bdc1b17ae4ce697",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "1911356b148d98c8ee53e65553f546c2712de2d5bdf0b99355bc0541a6521ade",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "1e4a57c1db53e501d7dfb28739a393dd46f78bb86eebc3bef3415c234fb7a802",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "2ebab50d62061acd68eb162e287723546862c78fb4a88b7392807bcc9675c28e",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "432edcc89387c31557f24737dea8e245cc88a62c1b083c763768f8ebc52cf19b",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "669880a08e13ccf8d5b78c40a69262626149895a57bedb3a2ebd21a6dc0f1eab",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "7cea5a5db4fabdb268891a342c3688edc1dcc4db5e6ff4c550b30648c845175b",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "a53663a639500553b6e5d12cd31be0bea64286a404e87a3c1e097e9ee7eb9920",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "aa73c1d825f75694b54ff4269c5ecb96f8919e91eca5c88b7870d67657112280",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "ae83dd60dcf5d3b81ae129069f87364c708e0c0dcc351d1ffa4bc6a5874abb00",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "e83dc597436161d756496165f421d12006e45326807983a79a0d055af0e7def5",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "fa19912bfc789cd61b151713efadea835fdf07cb1dd83951b0c7614e9715fd6c",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "fbbe89587ff643ab93f138f13d029806af273e475233ee52ea4eee476b64c927",
      "2026-02-24 19:08:56",
      0.00000546,
    ),
    increase(
      "af92d653a42a2163629c98193e8bbf885841abc57ee22d748edc03d0e2dce7e0",
      "2026-02-24 20:35:37",
      0.0000111,
    ),
    increase(
      "a2a702abbd3ae2edf0d67224d9a4a1c29c2bd53621437e6feb253677de2ec00a",
      "2026-04-07 19:18:37",
      0.00000546,
    ),
    increase(
      "a589629df479a801137db3ada8e60f64020848ae73851490e7e2aeae49f88351",
      "2026-04-07 19:18:37",
      0.00000546,
    ),
    increase(
      "d1f774f1e5aa0b62ae0a3fc0aef72c39df7b8d3622d982eef379b9c77dfb91f1",
      "2026-04-12 19:00:57",
      0.0007,
    ),
    increase(
      "4cdc9c77e3c56e3d66111ab158449b7cfba86f0254b01ca59a2eac4a30c8203c",
      "2026-04-12 19:05:44",
      0.0007,
    ),
    increase(
      "4aa521e3c096ef1ecd899ad9008a2fefbdd507a8de2027613988ff863b0a4e07",
      "2026-04-12 19:28:10",
      0.0007,
    ),
    increase(
      "4fcfeefd53e31da8a8c66140dd91c7d6b39ffd720e51ac0f2f60bf48522f3edd",
      "2026-04-18 17:12:29",
      0.00002,
    ),
    increase(
      "546dcac2cfabece6f023fa613858da29543a4f5fa2fbb256f765780eae16e3ad",
      "2026-04-24 08:23:05",
      0.000025,
    ),
    increase(
      "82bba6ca15a1c556ccce384467b4a2911f36bcde6ec335216cebf8315e314c7f",
      "2026-04-24 08:23:05",
      0.000025,
    ),
    increase(
      "0d24713088710fef730dd416876ef9639b62dd54a2e83debb76c108f668341df",
      "2026-05-10 10:59:06",
      0.00000666,
    ),
    increase(
      "973646bb3204b9e67e0fcb58efabe951aaf3714020c277f77092ae59bc1a1bd6",
      "2026-05-16 13:13:13",
      0.00000546,
    ),
    increase(
      "a751791bf7125e2ba94fd451900391a1cd3a50f01e09ec461450ac0de1d1945e",
      "2026-08-29 00:40:13",
      0.00000864,
    ),
    increase(
      "da062cd8135128e0301724e96f7a1ac544deb026a6604fe68e449b6ca1329d6a",
      "2026-09-25 18:04:42",
      0.00001593,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.png",
    hints: ["follow-the-white-rabbit.png"],
    sourceUrl: "https://gsmg.io/puzzle",
    digests: [
      digest(
        "puzzle.png",
        "38125bbdf1ea58b9b30b075bc6bf71e4089d04bba37098317e47097e2f2a1830",
        29931,
        {
          url: "https://gsmg.io/puzzle",
          archive: "https://web.archive.org/web/20201112011308id_/https://gsmg.io/puzzle",
        },
      ),
      digest(
        "follow-the-white-rabbit.png",
        "5e8d84b88f8f829428df5d2a8bf36c7268346f169b799ac7570b6223990d204f",
        1958,
        {
          url: "https://gsmg.io/img/follow_the_white_rabbit.png",
          archive:
            "https://web.archive.org/web/20201115074715id_/https://gsmg.io/img/follow_the_white_rabbit.png",
        },
      ),
      digest("phase2.txt", "5e583d5b8626aa80f8a1ae61e7ad62fb2640bedb73fcc12ba68fa13b15dfa94d", 910),
      digest(
        "phase3.txt",
        "d6767b282515485b6a52df4599e7b06e1428469596155ca18e4f5634ac2118ad",
        5570,
      ),
      digest(
        "salphaseion.txt",
        "cc1bffaeebe34e79128617b41db5a5f14e29650ae53a16d8bd371a113fa93602",
        2150,
      ),
      digest(
        "cosmic-duality.txt",
        "9a8172dd327273459f602517539ea30bbfa318d9d4338820f16d6c033260edf7",
        1820,
      ),
    ],
  }),
  stages: [
    stage(
      "phase 1",
      "A 14 by 14 grid of black, white, blue and yellow squares with a pixel rabbit in the middle. The one real QR code sits at the bottom and only opens the address on blockchain.com, so no, that's not the shortcut. Read the grid right and you land on a page with eight pictures, a password form hidden with display: none and a comment in the source wishing luck to the little bunny hunter.",
      [
        artifact("puzzle image", "https://gsmg.io/puzzle", "puzzle.png"),
        artifact("the seed is planted", "https://gsmg.io/theseedisplanted"),
      ],
      answer(
        "The grid read as bits, black and blue 1, white and yellow 0, counterclockwise in a spiral from the top left, spells gsmg.io/theseedisplanted, and the hidden form there takes theflowerblossomsthroughwhatseemstobeaconcretesurface.",
        `${WRITEUP}#1-httpsgsmgiopuzzle`,
        { date: "2020-04-26" },
      ),
      [technique("binary", `${WRITEUP}#1-httpsgsmgiopuzzle`)],
    ),
    stage(
      "phase 2",
      "The page opens with someone asking if you're looking for the private keymaker, then drops a base64 AES blob on you. After that it gets weird: a riddle about an electrical network theorem, a chancellor waiting for banks to be bailed out, a chess position in FEN and a buddhist who is forced to move.",
      [artifact("ciphertext", CHOICE, "phase2.txt")],
      answer(
        "causality, from the Merovingian in The Matrix Reloaded. Its SHA-256 in lowercase hex, eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf, is the OpenSSL password.",
        PHASE_3,
        { date: "2020-04-26" },
      ),
      [technique("openssl-salted-sha256", PHASE_3)],
    ),
    stage(
      "phase 3",
      "A second blob on the same page, about six times the first one. This time the author says how to open it: parts 1 to 7 go through sha-256 and the digest is the password. Same aes-256-cbc as before, so at least the lock is familiar.",
      [artifact("ciphertext", CHOICE, "phase3.txt")],
      answer(
        "causality, Safenet, Luna, HSM, 11110, 0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854 and B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1, joined and hashed: 1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5. Inside is phase 3.1 and one more blob, phase 3.2, that opens with the SHA-256 of jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple.",
        PHASE_3,
        { date: "2020-04-26" },
      ),
      [technique("openssl-salted-sha256", PHASE_3)],
    ),
    stage(
      "phase 3.2.1",
      "Inside phase 3.2 the Architect has been waiting for you. He's designed you a beautiful strategic position, one for one, four for one, and under that sits a line of 1539 box drawing characters. No key, no cipher name, just boxes.",
      [artifact("ciphertext", CHOICE, "phase3.txt")],
      answer(
        "The boxes convert to 1539 letters, vtkvplmepphluwahtzmjp and on, and Beaufort with the key THEMATRIXHASYOU turns them into the Architect's speech: YOUR LIFE IS THE SUM OF A REMAINDER OF AN UNBALANCED EQUATION INHERENT TO THE PROGRAMMING OF THIS PUZZLE, down to I REALLY HOPE YOURE THE ONE CIAO BELLA O.",
        PHASE_3,
        { date: "2020-04-26" },
      ),
      [technique("beaufort", PHASE_3)],
    ),
    stage(
      "phase 3.2.2",
      "Right after the boxes, a 149 digit number and one sentence to go with it: a fubcd-king & oracle-queen, thingky mvps, on a sad board but as wide as the first one seen.",
      [artifact("ciphertext", CHOICE, "phase3.txt")],
      answer(
        "A VIC straddling checkerboard with 1 and 4 as the blank digits, then a substitution solver over its letters, turns the number into IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE.",
        PHASE_3,
        { date: "2020-04-26" },
      ),
      [technique("straddling-checkerboard", PHASE_3)],
    ),
    stage(
      "SalPhaseIon",
      "A back door in the first image. The page path is the SHA-256 of the text printed under the grid, and behind it sits one long line of mostly the letters a to i, with a few words mixed in and a base64 blob split into single characters. The blob opens with Salted__, which says OpenSSL made it, not which cipher or key derivation. Parts of the letters decode. The writeup has no password for the blob.",
      [artifact("letters and blob", SALPHASEION, "salphaseion.txt")],
    ),
    stage(
      "Cosmic Duality",
      "Same page, second heading. A clean 28 line base64 blob with the same Salted__ header and not one word about its cipher or password. The writeup stops here and has no password for it.",
      [artifact("ciphertext", SALPHASEION, "cosmic-duality.txt")],
    ),
  ],
});

/** GSMG.IO multi-phase cryptographic challenge. */
export class GsmgCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "gsmg";

  /** Who published the puzzles. */
  static readonly author = party("GSMG.io", {
    key: "gsmg",
    kind: PartyKind.Organization,
    about:
      "A crypto trading bot platform that ran from 2017 to 2026 and left a multi phase puzzle behind. The site now shows the lights off and one mystery left.",
    addresses: ["1EtbTvVB8QTGN4mduSdy7n4cZQm4iYTpQ1"],
    profiles: [
      profile("website", "https://gsmg.io/puzzle"),
      profile("website", "https://gsmg.io/"),
    ],
    facts: [
      fact(
        "The front page says: A fully automated crypto trading bot. 2017 to 2026. The lights are off. Nine years of chaos ended. One mystery remains. Follow the white rabbit.",
        "https://gsmg.io/",
      ),
      fact(
        "Funded the puzzle address with 5 BTC on 2019-04-13.",
        "https://blockstream.info/tx/73e48ff571a7e9a4387574a50cf2fcb7b21b6ea5702c777a035664df57cbce02",
        { date: "2019-04-13" },
      ),
      fact(
        "Halved the prize at the 2020 halving and again in April 2024, moving 2.5 BTC and then 1.25 BTC to 17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa.",
        "https://blockstream.info/tx/88cdb3cdca12b471551b1b26188508a14ca5fd8a415223ffb7c190381c9b9df3",
        { date: "2024-04-24" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [gsmgPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(GsmgCollection.key, GsmgCollection.author, GsmgCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const gsmg = new GsmgCollection();
