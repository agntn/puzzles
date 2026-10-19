import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  claim,
  confirmation,
  fact,
  funding,
  increase,
  official,
  party,
  profile,
  sweep,
  technique,
} from "../core/parts.ts";
import { puzzle, Status } from "../core/puzzle.ts";

/** Schum-io's pull request that published the recipe, merged into floflo777's catalogue. */
const SOLUTION = "https://github.com/floflo777/open-crypto-puzzles/pull/44";

/** The Genesis block puzzle announced through Bitcoin OP_RETURN messages. */
export const genesisBlock = puzzle({
  id: "genesis",
  chain: "bitcoin",
  address: "bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj",
  sourceUrl:
    "https://mempool.space/tx/b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
  startedAt: "2026-08-22 19:45:38",
  status: Status.Solved,
  prize: 0.0094654,
  solvedAt: "2026-10-17 03:40:20",
  solveTime: 4_780_482,
  preGenesis: true,
  techniques: [
    technique(
      "sha256-to-bip39-entropy",
      "https://mempool.space/tx/ae906bdebdf7cd2e9b2490a727d5d91eaa203c2ae68f8461ea62e07ffe3b9b1c",
    ),
  ],
  transactions: [
    funding(
      "e2aaa928a965ee02b9c9a76227383113a62f350701a18d7792372712ce501ac7",
      "2026-08-22 02:45:22",
      0.0002,
    ),
    increase(
      "b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
      "2026-08-22 19:45:38",
      0.00005,
    ),
    claim(
      "1c70c4745fad5bf891b9ee2a9f8b0b5cd3f328eb847eb09c9bebb92f5f7e900b",
      "2026-10-17 03:40:20",
      0.0094654,
    ),
    sweep(
      "4b2d29ec21e2c9a37dae5ca7ddc49d6f34b0efbf4b0aa1afed6405dec8067b78",
      "2026-10-17 10:29:04",
      0.0000068,
    ),
    sweep(
      "d25aa1b7ada019b01ee3228f667d2881f47d7b53492d7b46b836743c1d7062f5",
      "2026-10-17 18:03:12",
      0.000004,
    ),
  ],
  solver: party(undefined, {
    addresses: ["bc1qdu8mh9qjtjhy89mvhmcgf66ul6ld92rdr6qzad"],
    facts: [
      fact(
        "Asked on September 14, with 10k sats to the puzzle address, whether the passphrase was Genesis data or the author's own word, how long it was and what built the wallet.",
        "https://mempool.space/tx/e43647274f672f9b4eb42fff1d15f2afcaa8bfd4650823403a18a76774999169",
        { date: "2026-09-14" },
      ),
      fact(
        "Paid 50k sats to the puzzle address and 1k to the author address on September 24 for the two public keys, Electrum-encrypted to its input key.",
        "https://mempool.space/tx/040cca803909ca782fe3ba4d197740afc4ff3b353af1c5cbe06de52cfbb99792",
        { date: "2026-09-24" },
      ),
      fact(
        "Received the only output of the sweep, 935,266 sats from all 117 outputs then on the puzzle address.",
        "https://mempool.space/tx/1c70c4745fad5bf891b9ee2a9f8b0b5cd3f328eb847eb09c9bebb92f5f7e900b",
        { date: "2026-10-17" },
      ),
      fact(
        'Two hours after the sweep sent 10k sats to the author address and 330 to the puzzle address with "Thank you for the fascinating puzzle!" in OP_RETURN.',
        "https://mempool.space/tx/3367997d30d4b0363ff96e9fb587c28622a691044ab3ea9ce5c30c5d730b422f",
        { date: "2026-10-17" },
      ),
    ],
  }),
  hints: [
    official(
      "I made a Bitcoin puzzle using information contained in the genesis block created by Satoshi to generate the wallet. The entropy is extremely low. I didn't even need to back anything up. Everything I needed was already in the genesis block. Good luck!",
      "https://mempool.space/tx/b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
      confirmation(
        "https://blockstream.info/tx/b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
        "Announcement in OP_RETURN. Whitespace normalized.",
      ),
      {
        date: "2026-08-22",
        answer: answer(
          "cut -b 263-400 of the 570-character lowercase raw block hex is the coinbase text as hex, no newline. The first 32 hex digits of its SHA-256 are the BIP39 entropy c020f55f60b8193bd5cac836769dbf76, which gives scan amateur fit scrap light over fire flip cushion reject hurt ugly. The passphrase is Satoshi Nakamoto. The seed step runs PBKDF2-HMAC-SHA512 at 181505 rounds for one cosigner (master fingerprint 0852014c) and 200913 for the other (040e2791), instead of BIP39's 2048. Both keys sit at m/48'/0'/1231006505'/2'/0/0 in a sorted 2-of-2 P2WSH.",
          SOLUTION,
          { date: "2026-10-17" },
        ),
      },
    ),
    official(
      "If you have a question, you can include it with a transaction sent directly to this address, and I will reply with a hint. Larger payments receive better hints. Dust transactions will be ignored.",
      "https://mempool.space/tx/248f690de194372564baa14e1bebf08154e2f2042ed205baa6157fdc0e3f22ea",
      confirmation(
        "https://blockstream.info/tx/248f690de194372564baa14e1bebf08154e2f2042ed205baa6157fdc0e3f22ea",
        "OP_RETURN spending a change output of b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77. Whitespace normalized.",
      ),
      { date: "2026-08-23" },
    ),
    official(
      "The witness script is a multisig.",
      "https://mempool.space/tx/0fb7a2f175dd7f9b8826cf2923ce4fcb56e4c7bfe252903e6dad1f87f177dfe3",
      confirmation(
        "https://blockstream.info/tx/0fb7a2f175dd7f9b8826cf2923ce4fcb56e4c7bfe252903e6dad1f87f177dfe3",
        "OP_RETURN spending a change output of 248f690de194372564baa14e1bebf08154e2f2042ed205baa6157fdc0e3f22ea. Whitespace normalized.",
      ),
      { date: "2026-08-23" },
    ),
    official(
      "Two keys, both required. The rest is for you to derive.",
      "https://mempool.space/tx/ef63243d374d8eabeac7e17e06cc4b1b672146dc61a8e5180eeac980cec07302",
      confirmation(
        "https://blockstream.info/tx/ef63243d374d8eabeac7e17e06cc4b1b672146dc61a8e5180eeac980cec07302",
        "OP_RETURN spending a change output of 268093b9ae56a59d2bb1a6acde588d6763fe859947b098c235031493208d3e22. Whitespace normalized.",
      ),
      { date: "2026-08-23" },
    ),
    official(
      "Yes, both keys use the same Genesis field, and there is no hash.",
      "https://mempool.space/tx/82a076b02643372769ac676d260ef4d9854c6bf49370ed61875fc63b8241dcfc",
      confirmation(
        "https://blockstream.info/tx/82a076b02643372769ac676d260ef4d9854c6bf49370ed61875fc63b8241dcfc",
        "OP_RETURN spending a change output of ef63243d374d8eabeac7e17e06cc4b1b672146dc61a8e5180eeac980cec07302. Whitespace normalized.",
      ),
      { date: "2026-08-24" },
    ),
    official(
      "Both keys are derived independently from Genesis.",
      "https://mempool.space/tx/ff884832e937f972c92c012ba235ff45b549cd1702dfd02691056da6bc1ff913",
      confirmation(
        "https://blockstream.info/tx/ff884832e937f972c92c012ba235ff45b549cd1702dfd02691056da6bc1ff913",
        "OP_RETURN spending a change output of 82a076b02643372769ac676d260ef4d9854c6bf49370ed61875fc63b8241dcfc. Whitespace normalized.",
      ),
      { date: "2026-08-24" },
    ),
    official(
      "The Genesis Block is public. Which part of it matters is for you to discover.",
      "https://mempool.space/tx/eb609dfede7f61d3bf9fe79ae48e546c358ebd09c05b3cd64a22433cb784ea86",
      confirmation(
        "https://blockstream.info/tx/eb609dfede7f61d3bf9fe79ae48e546c358ebd09c05b3cd64a22433cb784ea86",
        "OP_RETURN spending a change output of ff884832e937f972c92c012ba235ff45b549cd1702dfd02691056da6bc1ff913. Whitespace normalized.",
      ),
      { date: "2026-08-24" },
    ),
    official(
      "Solve it to find out. Maybe both. If you can't check the Genesis block, you can also use The Times newspaper!",
      "https://mempool.space/tx/6e94cfcbc1350a138242f97310dfd0280371a0020380cb32b2512337470c1077",
      confirmation(
        "https://blockstream.info/tx/6e94cfcbc1350a138242f97310dfd0280371a0020380cb32b2512337470c1077",
        "OP_RETURN spending a change output of eb609dfede7f61d3bf9fe79ae48e546c358ebd09c05b3cd64a22433cb784ea86. Whitespace normalized.",
      ),
      { date: "2026-08-28" },
    ),
    official(
      "Derivation rule: root -> multisig -> mainnet -> genesis_data -> script_type",
      "https://mempool.space/tx/8be479605bc8f2facd2036fd1b7f5cfa3a3f3920eeffee75e0004a2cff4d25d6",
      confirmation(
        "https://blockstream.info/tx/8be479605bc8f2facd2036fd1b7f5cfa3a3f3920eeffee75e0004a2cff4d25d6",
        "OP_RETURN spending a change output of 6e94cfcbc1350a138242f97310dfd0280371a0020380cb32b2512337470c1077. Whitespace normalized.",
      ),
      { date: "2026-08-28" },
    ),
    official(
      "I can't give hints without a question. Low-value transactions get bad hints; dust will be ignored.",
      "https://mempool.space/tx/64385a0cc5c4c712d1d9d8628e1e00364310d9ba50536ccd23c71b49ae66b96b",
      confirmation(
        "https://blockstream.info/tx/64385a0cc5c4c712d1d9d8628e1e00364310d9ba50536ccd23c71b49ae66b96b",
        "OP_RETURN spending a change output of 8be479605bc8f2facd2036fd1b7f5cfa3a3f3920eeffee75e0004a2cff4d25d6. Whitespace normalized.",
      ),
      { date: "2026-09-06" },
    ),
    official(
      "root = the master key derived from the BIP39 seed; genesis_data = some data from the genesis block used as the BIP48 account number.",
      "https://mempool.space/tx/cb47c7a73c1aaa11bfe0edce41c2ef7c9c1fec1478efd15e40b226eb502dcc18",
      confirmation(
        "https://blockstream.info/tx/cb47c7a73c1aaa11bfe0edce41c2ef7c9c1fec1478efd15e40b226eb502dcc18",
        "OP_RETURN spending a change output of 64385a0cc5c4c712d1d9d8628e1e00364310d9ba50536ccd23c71b49ae66b96b. Whitespace normalized.",
      ),
      { date: "2026-09-10" },
    ),
    official(
      "BIP39: 12 words; Passphrase: Y; Entropy: The data needed to solve it is publicly available in the genesis block.",
      "https://mempool.space/tx/f8f04fc04e2c4f34dc2264f85ff7944c6aa822446bc4cc082e95a52aed5c2a4c",
      confirmation(
        "https://blockstream.info/tx/f8f04fc04e2c4f34dc2264f85ff7944c6aa822446bc4cc082e95a52aed5c2a4c",
        "OP_RETURN spending a change output of cb47c7a73c1aaa11bfe0edce41c2ef7c9c1fec1478efd15e40b226eb502dcc18. Whitespace normalized.",
      ),
      { date: "2026-09-11" },
    ),
    official(
      "Passphrase: Who received the first transaction? That's all I've got to say. What built the wallet are the tools that support BIPs 32, 39, and 48.",
      "https://mempool.space/tx/a137a898ab56180d6e9ebac602377a120511acdec0b4ebe4e806536652d3b32d",
      confirmation(
        "https://blockstream.info/tx/a137a898ab56180d6e9ebac602377a120511acdec0b4ebe4e806536652d3b32d",
        "OP_RETURN spending a change output of f8f04fc04e2c4f34dc2264f85ff7944c6aa822446bc4cc082e95a52aed5c2a4c. Whitespace normalized.",
      ),
      { date: "2026-09-14" },
    ),
    official(
      "No, the passphrase is a name. The entropy isn't the raw 16 bytes.",
      "https://mempool.space/tx/a3878ff0c813a726c755e5b1220b69dc3528989fea1095041a8edadefc269fc4",
      confirmation(
        "https://blockstream.info/tx/a3878ff0c813a726c755e5b1220b69dc3528989fea1095041a8edadefc269fc4",
        "OP_RETURN spending a change output of a137a898ab56180d6e9ebac602377a120511acdec0b4ebe4e806536652d3b32d. Whitespace normalized.",
      ),
      { date: "2026-09-15" },
    ),
    official(
      "Perhaps... but figuring that out is part of the puzzle. The 12 words were generated from entropy.",
      "https://mempool.space/tx/96861335409aa5dd85cc03734191832dfb5e5ff1476d4005ccdb69c286217fcf",
      confirmation(
        "https://blockstream.info/tx/96861335409aa5dd85cc03734191832dfb5e5ff1476d4005ccdb69c286217fcf",
        "OP_RETURN spending a change output of a3878ff0c813a726c755e5b1220b69dc3528989fea1095041a8edadefc269fc4. Whitespace normalized.",
      ),
      { date: "2026-09-15" },
    ),
    official(
      "It's a 128-bit digest.",
      "https://mempool.space/tx/e38caf86a0d304a4d8a10e023e75626387dbce287847d46076a48bf60be82ca2",
      confirmation(
        "https://blockstream.info/tx/e38caf86a0d304a4d8a10e023e75626387dbce287847d46076a48bf60be82ca2",
        "OP_RETURN spending a change output of 96861335409aa5dd85cc03734191832dfb5e5ff1476d4005ccdb69c286217fcf. Whitespace normalized.",
      ),
      { date: "2026-09-16" },
    ),
    official(
      "Passphrase: You'll have to discover the fmt through brute force. The key question greatly narrows the search space.",
      "https://mempool.space/tx/ec08d0014b545776344e84214c82d556e25f11eb91f5764fc2b5b3b18faf4c99",
      confirmation(
        "https://blockstream.info/tx/ec08d0014b545776344e84214c82d556e25f11eb91f5764fc2b5b3b18faf4c99",
        "OP_RETURN spending a change output of e38caf86a0d304a4d8a10e023e75626387dbce287847d46076a48bf60be82ca2. Whitespace normalized.",
      ),
      { date: "2026-09-17" },
    ),
    official(
      "The genesis block data can be viewed in binary, hex, decimal, or ASCII. If you figure out which part is being used as the entropy, just try all four forms. Want a valuable hint? Send 50k sats and I'll reveal the public keys for this address.",
      "https://mempool.space/tx/ed010443963e3601b35266a52108bd1b8dfa58e9e258a041098c05a474513fab",
      confirmation(
        "https://blockstream.info/tx/ed010443963e3601b35266a52108bd1b8dfa58e9e258a041098c05a474513fab",
        "OP_RETURN spending a change output of ec08d0014b545776344e84214c82d556e25f11eb91f5764fc2b5b3b18faf4c99. Whitespace normalized.",
      ),
      { date: "2026-09-17" },
    ),
    official(
      "Somewhere in the genesis block. The hints reveal the puzzle's shape, not the path to its solution. Brute force will be necessary to uncover it.",
      "https://mempool.space/tx/d78593ab6288e2c9792f8c5ad8d020893d1b1dd9631eb5b1ffa5765f13029cd7",
      confirmation(
        "https://blockstream.info/tx/d78593ab6288e2c9792f8c5ad8d020893d1b1dd9631eb5b1ffa5765f13029cd7",
        "OP_RETURN funded from the same input address as the announcement. Whitespace normalized.",
      ),
      { date: "2026-09-19" },
    ),
    official(
      "First 128 bits of SHA-256 hash of the genesis block's entropy. Encrypted pubkey: 50k sats output + 1k input.",
      "https://mempool.space/tx/ae906bdebdf7cd2e9b2490a727d5d91eaa203c2ae68f8461ea62e07ffe3b9b1c",
      confirmation(
        "https://blockstream.info/tx/ae906bdebdf7cd2e9b2490a727d5d91eaa203c2ae68f8461ea62e07ffe3b9b1c",
        "OP_RETURN funded from the same input address as the announcement. Whitespace normalized.",
      ),
      { date: "2026-09-24" },
    ),
    official(
      "It's a contiguous piece of the genesis block, exactly as a standard tool shows it. I got it by copy-pasting the tool's output.",
      "https://mempool.space/tx/e3ab67c0ad72980678f6da4e0751d765cd73c1457656232ac878cfcfec8ae882",
      confirmation(
        "https://blockstream.info/tx/e3ab67c0ad72980678f6da4e0751d765cd73c1457656232ac878cfcfec8ae882",
        "OP_RETURN funded from the same input address as the announcement, answering the shape questions in c5f4c7ca2959b3c166f4941bcaf9debb2174017b49909a05d0a7e8a584e0e4a6.",
      ),
      { date: "2026-09-25" },
    ),
    official(
      "The genesis block is only 2.5E-32 of the 2^128 possibilities. Revealing the seed's master fingerprint without the passphrase is basically giving away the entropy. All the secret pieces have to be cracked at the same time.",
      "https://mempool.space/tx/88fc7fd69dc89b2d716814d2a1ccdc8bdf419f158c7028b37c1cb83230cda4da",
      confirmation(
        "https://blockstream.info/tx/88fc7fd69dc89b2d716814d2a1ccdc8bdf419f158c7028b37c1cb83230cda4da",
        "OP_RETURN funded from the same input address as the announcement. The message opens with a player's decrypted offer for a master fingerprint; only the text after its \"Reason for decline:\" label is the author's and is recorded here.",
      ),
      { date: "2026-09-26" },
    ),
    official(
      "1) Apps/Tools used to generate the 12 words: bitcoin-cli, cut, jq, tr, sha256sum, iancoleman/bip39, OogaBoogaX/entropylab; 2) Genesis block is extremely small. This will have to be uncovered via brute-force; 3) Pasted from bitcoin-cli and also from an explorer.",
      "https://mempool.space/tx/dcd7d3990e9bc4407f2146fa77fff583c26b66c12eef7e0e0832fbbed062df51",
      confirmation(
        "https://blockstream.info/tx/dcd7d3990e9bc4407f2146fa77fff583c26b66c12eef7e0e0832fbbed062df51",
        "OP_RETURN spending the 1k output that 68171cd7aa964213998ac8960940fc20df9a25d5ed6c06ca6de4e16442cf6886 paid to the author address. It answers that transaction's three questions: the app that made the 12 words, the entropy type and event count, and where the text was pasted from. Whitespace normalized.",
      ),
      { date: "2026-09-27" },
    ),
    official(
      "1) N; 2) N.",
      "https://mempool.space/tx/457fc560caded5b020ba8d1c3543ceec0269880e1ff88bdbda14008de4079023",
      confirmation(
        "https://blockstream.info/tx/457fc560caded5b020ba8d1c3543ceec0269880e1ff88bdbda14008de4079023",
        "OP_RETURN spending the 1k output that 0774617b6bf04ba6723a1ddf1f77d4103a829117d972f4a98032420aa6159102 paid to the author address. It answers that transaction's two yes/no questions: whether the digest input is only the coinbase Times text, and whether it is exactly a tool's copy-pasted ASCII. Whitespace normalized.",
      ),
      { date: "2026-09-27" },
    ),
    official(
      "Declined for the same reason as before. The puzzle wallet was built using secret components that are extremely weak on their own. Those components won't be disclosed or reduced to a searchable checksum. Revealing any one of them independently would turn part of the puzzle into an oracle for solving the others. So you'll have to recover the actual secret pieces and test them together. I won't provide any derived value that isolates any individual secret.",
      "https://mempool.space/tx/d2758a2b6e2d01cb2ab5007f6340b88aa6d3b0ee31009c4c4df71be775e7ae3d",
      confirmation(
        "https://blockstream.info/tx/d2758a2b6e2d01cb2ab5007f6340b88aa6d3b0ee31009c4c4df71be775e7ae3d",
        "OP_RETURN spending the 1k output that 67c1b1e4b8c3a220ffbe46fadb484685db7471ee74b3883146ed5b8df3ecb196 paid to the author address. It declines that transaction's request for the first 8 hex of the SHA-256 of the passphrase and of the 12 words. Whitespace normalized.",
      ),
      { date: "2026-09-28" },
    ),
    official(
      "1) a; 2) b.",
      "https://mempool.space/tx/9da63c9f600f8a91b9ef90327f71422e66da22c8900f9df1491b4e78b06f56a1",
      confirmation(
        "https://blockstream.info/tx/9da63c9f600f8a91b9ef90327f71422e66da22c8900f9df1491b4e78b06f56a1",
        "OP_RETURN spending the 1k output that 4c6ef4099a2a4263e28bae8abf17246c6b26315e2b3a9da1e5b5e646d3cb7e8c paid to the author address. It picks from that transaction's options: 1a, jq, cut and tr changed the text before sha256sum; 2b, the first 32 hex of the digest went in as raw entropy, not through Ian Coleman's 12-word option. Whitespace normalized.",
      ),
      { date: "2026-09-28" },
    ),
    official(
      "1) N; 2) Y; 3) Y; 4) Y",
      "https://mempool.space/tx/1f0f0af2aef408c25c3c813476a130cae171af2190498754c695f8d8e7b43bc2",
      confirmation(
        "https://blockstream.info/tx/1f0f0af2aef408c25c3c813476a130cae171af2190498754c695f8d8e7b43bc2",
        "OP_RETURN spending the 1k output that 33736aa78237fe96f94edcf48f14fb3841ff0bf42bedc3688cb5803ee42315a3 paid to the author address. It answers that transaction's four yes/no questions: no, the two seeds did not come from two pastes, one from bitcoin-cli and one from an explorer; yes, both cosigners share the passphrase; yes, sha256sum read the pasted UTF-8 text, not bytes decoded from hex; yes, Ian Coleman's entropy type was Hex, fed the first 32 hex of the digest.",
      ),
      { date: "2026-09-30" },
    ),
    official(
      "1) hex; 2) substring/cut; 3) N",
      "https://mempool.space/tx/3678a0e393de3e664f5470580d7a504b981809d35f029f4bc592b8126a133446",
      confirmation(
        "https://blockstream.info/tx/3678a0e393de3e664f5470580d7a504b981809d35f029f4bc592b8126a133446",
        "OP_RETURN spending the 1k output that faf44a9e7d572e65f0dfa96c4f32e7393e3fab600da3cdfdd5c758c9fe493218 paid to the author address. It answers that transaction's three questions: the hashed form was hex, not binary or decimal; it was a substring cut from a tool's field, not the whole value; no trailing newline reached sha256sum.",
      ),
      { date: "2026-09-30" },
    ),
    official(
      "1) N; 2) genesis block; 3) Y; 4) Y",
      "https://mempool.space/tx/41a68f4a564a4fc52a25dd52c3169aaa549dcbd9310e945a06114ea934752cda",
      confirmation(
        "https://blockstream.info/tx/41a68f4a564a4fc52a25dd52c3169aaa549dcbd9310e945a06114ea934752cda",
        'OP_RETURN spending the 1k output that 759663153ca23f956b1f2b354550f9df547481df5b121a2a229e77d255685cef paid to the author address. It answers that transaction\'s four questions: no, the hex was not cut from the raw hex of getblock 0; the source, offered as the 80-byte header, the coinbase transaction hex or other, is "genesis block"; yes, the cut length is even; yes, both cosigners use the same cut length.',
      ),
      { date: "2026-10-01" },
    ),
    official(
      "1) Y; 2) N (bitcoin-cli/explorer); 3) Y; 4) N",
      "https://mempool.space/tx/b050d6450f7d12eef41fae3179791c572499b653ee24665ae25adb9fe46dfd49",
      confirmation(
        "https://blockstream.info/tx/b050d6450f7d12eef41fae3179791c572499b653ee24665ae25adb9fe46dfd49",
        "OP_RETURN spending the 1k output that 734da7fc7a60f741074688d55344b70a1dbc5dc42a47e67a6353c5f2de49e770 paid to the author address. It answers that transaction's four questions: yes, the cosigner with master fingerprint 0852014c used Ian Coleman's Hex entropy type; to whether its hex came from bitcoin-cli rather than an explorer, N with both tools named; yes, the cut is at most 32 characters; no, it is not at most 16.",
      ),
      { date: "2026-10-01" },
    ),
    official(
      "1) Y; cut -b N-M: it deleted everything outside the selected range. 2) Y. 3) Key question of the passphrase: Who received the first transaction? That's all I've got to say. 4) N.",
      "https://mempool.space/tx/719623a4f2c94413b3f954e0864685aa5b7e6aead664b4f5b9efd868b7dcd7c7",
      confirmation(
        "https://blockstream.info/tx/719623a4f2c94413b3f954e0864685aa5b7e6aead664b4f5b9efd868b7dcd7c7",
        "OP_RETURN spending the 1k output that d98ac606deeb8f2d9efdb11abafaabc505d8fccc7a026f0e876bda68f47429a4 paid to the author address. It answers that transaction's four questions about cosigner 0852014c: yes, a command removed hex digits before sha256sum, and it was cut -b; yes, one SHA-256 of the hex text, its first 32 hex digits as raw entropy, English BIP39, 12 words; to which first transaction, the passphrase's key question again; no, the passphrase has nothing but ASCII letters and spaces. Whitespace normalized.",
      ),
      { date: "2026-10-03" },
    ),
    official(
      "1) Y; 2) Y; 3) ¬_¬",
      "https://mempool.space/tx/d2ae17e2e91a18c78bcc9d9b99c153c5d6ff55dea217f925d438745c29e11042",
      confirmation(
        "https://blockstream.info/tx/d2ae17e2e91a18c78bcc9d9b99c153c5d6ff55dea217f925d438745c29e11042",
        "OP_RETURN spending the 1k output that 8c1e0c1b1e70d70c00142310a89240f2669f349e62673bcc3b92f0ca9d7dc29c paid to the author address. It answers that transaction's three questions: yes, 0852014c is the fingerprint of the BIP32 master key from the 12 words with the passphrase applied; yes, both escrow keys sit at m/48h/0h/Xh/2h/c/i with c=0 and i up to 9 or c=1 and i up to 4; to how many spaces the passphrase holds, a sideways glance and no number.",
      ),
      { date: "2026-10-03" },
    ),
    official(
      "1) N; 2) d; 3) Y.",
      "https://mempool.space/tx/221021e681efd10dad0d0988a9e27b937ef1ad1c1f90133f04866746874f4e3b",
      confirmation(
        "https://blockstream.info/tx/221021e681efd10dad0d0988a9e27b937ef1ad1c1f90133f04866746874f4e3b",
        "OP_RETURN spending the 1k output that 44444289a6d96b35e0ae50a4f8b7b99acedb1e2fabcad23ae3b20258d4e43ed8 paid to the author address. It answers that transaction's three questions about cosigner 0852014c: no, the hashed text is not a clean run of 18 to 32 hex digits found as is in the raw block hex, block hash, merkle root, chainwork, nextblockhash, target or an address hash160; d, it comes from one of those places with its length, case or ending changed; yes, the passphrase is two words with one space between them, each a given name or surname of the recipient.",
      ),
      { date: "2026-10-05" },
    ),
    official(
      "1) host; 2) b7f4182b",
      "https://mempool.space/tx/05ab6e90b0aea14b7a24d0a41d54c4aa3eb17239cc033d1c70f15c0259f1aa01",
      confirmation(
        "https://blockstream.info/tx/05ab6e90b0aea14b7a24d0a41d54c4aa3eb17239cc033d1c70f15c0259f1aa01",
        "OP_RETURN spending the 1k output that 10edb8315de15c0aae216198e5128c0a0a28712edde8767d2ca74d0b3d1480af paid to the author address. That transaction asked the author to run the puzzle's own steps on the sample text 000000000019d6689c08: sha256sum, the first 32 hex as Hex entropy in Ian Coleman's tool, 12 words, BIP39 passphrase \"Test Example\". The answer is the first word and the master fingerprint. SHA-256 of the text without a trailing newline gives exactly host and b7f4182b.",
      ),
      { date: "2026-10-06" },
    ),
    official(
      "1) a; 2) N; 3) c; 4) a.",
      "https://mempool.space/tx/3e53ba380eabacce422e278a0916627e42408f4dc11e192c61039647f694b1e1",
      confirmation(
        "https://blockstream.info/tx/3e53ba380eabacce422e278a0916627e42408f4dc11e192c61039647f694b1e1",
        "OP_RETURN spending the 1k output that 8f9e8dd494fd0f51f2ff192d13c57241a2f2b24702ed405e24316943f64fdb80 paid to the author address. It answers that transaction's four questions about the d in 221021e681efd10dad0d0988a9e27b937ef1ad1c1f90133f04866746874f4e3b: a, the hashed text's length falls outside 18 to 32; no, cut -b N-M does not start at byte 1 of the line it cut; c, that line came from an explorer page or API; a, the place is the raw block hex.",
      ),
      { date: "2026-10-06" },
    ),
    official(
      "1) b; 2) b; 3) Y; 4) d. 1) Y; 2) -; 3) c; 4) N.",
      "https://mempool.space/tx/9750cd4ab471da045914e964c7c9100bc6d975426a6e07c22a3194c69fe67e52",
      confirmation(
        "https://blockstream.info/tx/9750cd4ab471da045914e964c7c9100bc6d975426a6e07c22a3194c69fe67e52",
        'OP_RETURN spending the 1k output that e6fd1907568e6afadddc6946837be741b88876d9fcb5fb39e703ba21c4de0270 paid to the author address. Its first line answers that transaction\'s four questions about cosigner 0852014c: b, mempool.space supplied the raw block hex; b, it was copied from a browser HTML page; yes, the hex was one continuous run with no newline inside; d, "other" to how the earlier at most 32 and outside 18 to 32 answers fit together. Its second line answers the four questions of b94390c4f3da104ad344fe29b40b04e37efb578b3589bb84189d5f102ff33ada, which paid 9k and no 1k: yes, the hex was the usual lowercase raw block hex of length 570, the bytes of mempool.space /api/block/.../raw; "-" as asked after a yes; c, the hashed text has an even length of 66 or more; no, the cut -b range did not run past the end of the string. Whitespace normalized.',
      ),
      { date: "2026-10-07" },
    ),
    official(
      "1) Y; 2) Y; 3) c; 4) N; 5) Y; 6) N.",
      "https://mempool.space/tx/9d789e14f440e38e131848948ca86af1451969f57450f39d8840ca7920df0135",
      confirmation(
        "https://blockstream.info/tx/9d789e14f440e38e131848948ca86af1451969f57450f39d8840ca7920df0135",
        "OP_RETURN spending a change output of 88fc7fd69dc89b2d716814d2a1ccdc8bdf419f158c7028b37c1cb83230cda4da. It answers the six shorthand questions of 4a197e9b63581bbc8e8b32a65989a76af55c656a1d627768ec4540aca05a13b1, a 15k tip to the author address, about cosigner 040e2791 and the passphrase: yes, the 570-character raw hex; yes, Ian Coleman's Hex entropy type; c, the hashed text is 66 characters or longer; no to \"EOLpast?\"; yes, the passphrase's first word has fewer letters than the second; no, neither word has three letters.",
      ),
      { date: "2026-10-09" },
    ),
    official(
      "1) b; 2) Declined: no confirmation of candidates.",
      "https://mempool.space/tx/c41a5e9c9ccc9e16d52cf25789217dfc057a5b2e8801794854db1c136485a419",
      confirmation(
        "https://blockstream.info/tx/c41a5e9c9ccc9e16d52cf25789217dfc057a5b2e8801794854db1c136485a419",
        "OP_RETURN spending a change output of 9d789e14f440e38e131848948ca86af1451969f57450f39d8840ca7920df0135. It answers the two questions of d1bd1dccbe5f7b31a9f7ffe171f0a73df996db5cf4943be615c689d349a69f4e: b, the 2^23 behind the 2.5E-32 of September 26 counts cut -b ranges times passphrase forms; whether the passphrase is a form of Hal Finney's name, declined.",
      ),
      { date: "2026-10-10" },
    ),
    official(
      "tr -d '\\n'",
      "https://mempool.space/tx/d416a2765ab1a61dfed4d8acb6becb52b8e890db4de6eca9452468c4fa6ca915",
      confirmation(
        "https://blockstream.info/tx/d416a2765ab1a61dfed4d8acb6becb52b8e890db4de6eca9452468c4fa6ca915",
        "OP_RETURN spending the 15k output that 4a197e9b63581bbc8e8b32a65989a76af55c656a1d627768ec4540aca05a13b1 paid to the author address. It answers 6f9fe0aa1f929006de61fd29c67648260b0d5c4feba3416b45362e10fda46363, which asked for the exact tr command with its options and operands.",
      ),
      { date: "2026-10-14" },
    ),
    official(
      "1) a; 2) c; 3) Declined; 4) n.",
      "https://mempool.space/tx/a4db429eadc17e54e73385e0bd06720e8fb91c2d2b0569cef518dde43d0dd8db",
      confirmation(
        "https://blockstream.info/tx/a4db429eadc17e54e73385e0bd06720e8fb91c2d2b0569cef518dde43d0dd8db",
        "OP_RETURN spending a 546-sat output that d72a763128e07d76deb3751b64e4f1fad4546ccb9d62ab6665a1d46ae453f905 paid to the author address. It answers the four questions of b50873ca31a944c0fbf781ebabe6ce6160569b4ff97a52c1b41b6aed8ad1df59 about the 2^23: a, 1 to 32 passphrase forms; c, more than 2^17 cut ranges; whether each word's case is lower, Capitalized or UPPER, declined; no typo in the passphrase.",
      ),
      { date: "2026-10-16" },
    ),
    official(
      "1) Y; 2) Declined; 3) d; 4) Y.",
      "https://mempool.space/tx/3fee7cef9f6ec7b212368e2be38cf71bcb256441f88a3473a99af07182ba43b1",
      confirmation(
        "https://blockstream.info/tx/3fee7cef9f6ec7b212368e2be38cf71bcb256441f88a3473a99af07182ba43b1",
        "OP_RETURN from bc1q7h0hthfvden7nrvms7rncukkjgwh6z36g3uzsk, funded by output 0 of 31ad65376dafa211080f4315cc2d84e947f7cab8242396586787ef1f7853aad1, which split 14,500 sats of the author address into 25 outputs. It answers the four questions of ec831a9d72108dc8f844231cf106ce2029ca648f133a2f5fb4fe6c2c753e7b80 about the two BIP48 account numbers: yes, both come from Genesis data without hashing; whether from one piece or two, declined; d, a named header field's raw value; yes, at least one is 2^22 or more.",
      ),
      { date: "2026-10-16" },
    ),
    official(
      "1) Declined; 2) c85bcea3.",
      "https://mempool.space/tx/439cc93022c7cefda8f9eb43e4f3ad25120ef78c0bb390012a744a7de69627d1",
      confirmation(
        "https://blockstream.info/tx/439cc93022c7cefda8f9eb43e4f3ad25120ef78c0bb390012a744a7de69627d1",
        "OP_RETURN from bc1qauk64tcu4lqeyxcqlua5hfra7ensmn8s7nvyjw, funded by output 2 of 31ad65376dafa211080f4315cc2d84e947f7cab8242396586787ef1f7853aad1. It answers 29d4e3fefd5e9f57b3e50dc3c7121899e1ebf77575418624b67b022f6c7ccb21, a test vector for cosigner 0852014c with cut -b 2-67 and the passphrase Test Example: the first word declined, the master fingerprint c85bcea3. The published recipe gives d463151e for those inputs.",
      ),
      { date: "2026-10-16" },
    ),
    official(
      "Declined. For a test vector with predefined inputs, I can only provide the final result. Step-level answers would be the same as uncovering the individual secrets one by one.",
      "https://mempool.space/tx/3de07be481e97c9ae57e38fcfd52ad40a0c0629d05603c286f47faebd3c462ec",
      confirmation(
        "https://blockstream.info/tx/3de07be481e97c9ae57e38fcfd52ad40a0c0629d05603c286f47faebd3c462ec",
        "OP_RETURN from bc1qsz5930ds6rxh7eqfmcx8ss62n788sztkvw360t, funded by output 3 of 31ad65376dafa211080f4315cc2d84e947f7cab8242396586787ef1f7853aad1. It declines f1027314f59377f908384fcf1d232c7d724a70e240adcc3c4d0f122a2a129873, which asked for the hashed text, its length, the digest and the exact commands behind c85bcea3.",
      ),
      { date: "2026-10-16" },
    ),
    official(
      "1) e4caa034; 2) 9fb54bad; 3) e4caa034; 4) e79c9765; 5) 8b9b2fea; 6) 68ab4226; 7) 9290f941.",
      "https://mempool.space/tx/39a7dd0c74a15d11c2cc301167bcee243f458bdc54f2aa3e6a1426df44d868d6",
      confirmation(
        "https://blockstream.info/tx/39a7dd0c74a15d11c2cc301167bcee243f458bdc54f2aa3e6a1426df44d868d6",
        "OP_RETURN from bc1qrv8nm8s7ldr9m28t6ktkgnw7d43hlshunk3ydw, funded by output 4 of 31ad65376dafa211080f4315cc2d84e947f7cab8242396586787ef1f7853aad1. It answers f1aeed6d1fb79335f62427da1e64f20b9f71030ca1996c2968086fae0f5b5429 with the master fingerprint of cosigner 0852014c under the passphrase Test Example for seven cut -b ranges of the block: 1-1, 2-2, 3-3, 1-4, 1-2000, 263-400 and 1-66.",
      ),
      { date: "2026-10-16" },
    ),
    official(
      "1) e4caa034; 2) 9fb54bad; 3) 3bc42789.",
      "https://mempool.space/tx/484fef192e43bd6c72407ad4382037f6ff3c6df985df165b3a78713bc50aa4d8",
      confirmation(
        "https://blockstream.info/tx/484fef192e43bd6c72407ad4382037f6ff3c6df985df165b3a78713bc50aa4d8",
        "OP_RETURN from bc1qt8z3t8dah970etvvfznet4843neg0qwdt0ql0k, funded by output 5 of 31ad65376dafa211080f4315cc2d84e947f7cab8242396586787ef1f7853aad1. It answers 5b7ff44c779abced7889d70dce5299d3680140bc77f6d54e200c1c55b33ee472 with the master fingerprint of cosigner 0852014c under the passphrase Test Example for the literal texts 0, 1 and 000000000019d6689c08. The October 6 answer for that third text was b7f4182b, which standard BIP39 gives.",
      ),
      { date: "2026-10-17" },
    ),
  ],
});

/** CaesarCoder's puzzle built from data in Bitcoin's Genesis block. */
export class GenesisCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "genesis";

  /** Anonymous until the hint address signed for a PGP key after the sweep. */
  static readonly author = party("CaesarCoder", {
    key: "genesis-author",
    aliases: ["caesrcd"],
    about:
      "Funded the Genesis Block Wallet Puzzle, sold hints in OP_RETURN for eight weeks and only put a name to it once the prize was gone, with a PGP signature from the hint address.",
    addresses: ["bc1qyas2lnfgzjh3lyl4vfhc68daedc890zn8yetaj"],
    profiles: [
      profile("github", "https://github.com/caesrcd"),
      profile("twitter", "https://x.com/caesrcd"),
    ],
    facts: [
      fact(
        "Announced the puzzle in an OP_RETURN output in block 963629 on 2026-08-22.",
        "https://mempool.space/tx/b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
        { date: "2026-08-22" },
      ),
      fact(
        "The X account caesrcd posted the announcement text, the target address and a hexdump of the Genesis block 16 hours before the on-chain announcement, then answered questions under it.",
        "https://x.com/caesrcd/status/2090997418800095526",
        { date: "2026-08-22" },
      ),
      fact(
        "Sells hints for sats. The message offering paid hints promises better answers for larger payments.",
        "https://mempool.space/tx/248f690de194372564baa14e1bebf08154e2f2042ed205baa6157fdc0e3f22ea",
        { date: "2026-08-23" },
      ),
      fact(
        "Answered a paid question in September: BIP39, 12 words, a passphrase, and entropy from data that is public in the genesis block.",
        "https://mempool.space/tx/f8f04fc04e2c4f34dc2264f85ff7944c6aa822446bc4cc082e95a52aed5c2a4c",
        { date: "2026-09-11" },
      ),
      fact(
        "The X account caesrcd quoted its announcement on 2026-09-05, asking whether no one would be able to solve the puzzle and saying it was seriously thinking about switching to this new wallet setup.",
        "https://x.com/caesrcd/status/2096052655449657713",
        { date: "2026-09-05" },
      ),
      fact(
        "The X account caesrcd quoted Adam Back on a Blockstream bug to say that an LLM spotting bugs that are hard to catch by eye is not just as effective at fixing them.",
        "https://x.com/caesrcd/status/2098071674205712636",
        { date: "2026-09-10" },
      ),
      fact(
        "The X account caesrcd recalled the Coldcard incident, where weak entropy, weak passphrases and leaked multisig pubkeys got wallets hit, and wrote that this puzzle's pubkeys had not yet been exposed.",
        "https://x.com/caesrcd/status/2100944026774151611",
        { date: "2026-09-18" },
      ),
      fact(
        "Set the terms for the two public keys in OP_RETURN, a week after first offering them for 50k sats: 50k sats to the puzzle address plus 1k to the author address, delivered encrypted.",
        "https://mempool.space/tx/ae906bdebdf7cd2e9b2490a727d5d91eaa203c2ae68f8461ea62e07ffe3b9b1c",
        { date: "2026-09-24" },
      ),
      fact(
        "Started sending Electrum-encrypted OP_RETURN messages (base64 BIE1) the same day, readable only by the player whose pubkey they were encrypted to.",
        "https://mempool.space/tx/5ee1f8e2e5c7eaf571b6bbac6dc89263206d4db2c44ce71df94bb6d10924b81c",
        { date: "2026-09-24" },
      ),
      fact(
        "The X account caesrcd posted a screenshot of 0xflorent's OP_RETURN message about brute-forcing the puzzle with Claude ten minutes after the block that confirmed it, announcing a heavyweight white-hat on the puzzle.",
        "https://x.com/caesrcd/status/2103192783779750018",
        { date: "2026-09-24" },
      ),
      fact(
        "The X account caesrcd asked who wants the puzzle's two public keys, saying the encrypted pubkeys and the Genesis Block entropy clue are already on chain. Its image stacks four OP_RETURN messages: the 50k offer, the September 24 terms, a player's 50k request and the encrypted reply to that player.",
        "https://x.com/caesrcd/status/2107565388527456292",
        { date: "2026-10-06" },
      ),
      fact(
        "Split 14,500 sats of the hint address into 25 outputs of 569 sats, then answered the next paid questions from fresh addresses those outputs funded.",
        "https://mempool.space/tx/31ad65376dafa211080f4315cc2d84e947f7cab8242396586787ef1f7853aad1",
        { date: "2026-10-15" },
      ),
      fact(
        'Congratulated the solver in OP_RETURN an hour after the sweep, "Shoutout to the player who cracked the puzzle! Thanks to everyone who joined in.", from an address one of those outputs funded.',
        "https://mempool.space/tx/bcfc8cbeb5498d803dc1b1384233eb5e9f2da79c2077b9a0907bc0187e2e4465",
        { date: "2026-10-17" },
      ),
      fact(
        "Signed a PGP clearsigned message in OP_RETURN from the hint address naming the handle CaesarCoder, github.com/caesrcd and the key E2A0BF0D72D74483064D4FF9304952407A6E5C38. It verifies against the key GitHub serves for caesrcd.",
        "https://mempool.space/tx/473a314bcb3f5abc8dc4500e8d0ab80525ff65a846d55406c1e1e10fa8c8e46c",
        { date: "2026-10-17" },
      ),
      fact(
        "The X account caesrcd posted the bitcoin-cli command that decodes that signed message, quoting its own August 22 pre-announcement.",
        "https://x.com/caesrcd/status/2111512567294333206",
        { date: "2026-10-17" },
      ),
      fact(
        "The GitHub account caesrcd, named CaesarCoder, carries the same key fingerprint in its bio and links the X account caesrcd.",
        "https://github.com/caesrcd",
      ),
    ],
  });

  /** The address receiving the announcement and subsequent hint messages. */
  static readonly puzzles = [genesisBlock];

  /** Builds the canonical collection. */
  constructor() {
    super(GenesisCollection.key, GenesisCollection.author, GenesisCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const genesis = new GenesisCollection();
