import { SingletonCollection } from "../core/collection.ts";
import {
  confirmation,
  fact,
  funding,
  increase,
  official,
  party,
  technique,
} from "../core/parts.ts";
import { puzzle } from "../core/puzzle.ts";

/** The Genesis block puzzle announced through Bitcoin OP_RETURN messages. */
export const genesisBlock = puzzle({
  id: "genesis",
  chain: "bitcoin",
  address: "bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj",
  sourceUrl:
    "https://mempool.space/tx/b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
  startedAt: "2026-08-22 19:45:38",
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
  ],
  hints: [
    official(
      "I made a Bitcoin puzzle using information contained in the genesis block created by Satoshi to generate the wallet. The entropy is extremely low. I didn't even need to back anything up. Everything I needed was already in the genesis block. Good luck!",
      "https://mempool.space/tx/b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
      confirmation(
        "https://blockstream.info/tx/b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
        "Announcement in OP_RETURN. Whitespace normalized.",
      ),
      { date: "2026-08-22" },
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
  ],
});

/** An anonymous author's puzzle based on data in Bitcoin's Genesis block. */
export class GenesisCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "genesis";

  /** No public identity is established for the announcer. */
  static readonly author = party("Anonymous", {
    key: "genesis-author",
    about:
      "Whoever funded the Genesis Block Wallet Puzzle and answers questions in OP_RETURN. No name, no profile, just transactions and one X account that spoke first.",
    addresses: ["bc1qyas2lnfgzjh3lyl4vfhc68daedc890zn8yetaj"],
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
