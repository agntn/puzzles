import { NamedCollection } from "../core/collection.ts";
import { confirmation, official, party, standard } from "../core/parts.ts";
import { bitcoinPuzzle } from "../core/puzzle.ts";

/** The Genesis block puzzle announced through Bitcoin OP_RETURN messages. */
export const genesisBlock = bitcoinPuzzle({
  id: "genesis/block",
  address: standard("bc1qfkhx02v89u2qyyyljeczw6hu9sr437y44t7ae5yf09thrdukfqesnjg2wj"),
  sourceUrl:
    "https://mempool.space/tx/b691de3657880d9a1eabd2783b1a9fa8c5313ced338495bf10e85727012d7a77",
  startedAt: "2026-08-22 19:45:38",
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
  ],
});

/** An anonymous author's puzzle based on data in Bitcoin's Genesis block. */
export class GenesisCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "genesis";

  /** No public identity is established for the announcer. */
  static readonly author = party("Anonymous", {
    addresses: ["bc1qyas2lnfgzjh3lyl4vfhc68daedc890zn8yetaj"],
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
