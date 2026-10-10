/**
 * Every collection shipped with the package, in manifest order. Only the key lives here. A module
 * is imported on the first lookup for its key, so importing the package evaluates no records and a
 * bundler splits each collection into its own chunk. The list keeps its literal type, so
 * `getCollection("bits")` knows the query type of the collection it loads.
 */
export const builtins = [
  { key: "80-bit", load: () => import("./80-bit.ts").then((m) => m.eightyBit) },
  { key: "ballet", load: () => import("./ballet.ts").then((m) => m.ballet) },
  { key: "bitaddress", load: () => import("./bitaddress.ts").then((m) => m.bitaddress) },
  { key: "bitaps", load: () => import("./bitaps.ts").then((m) => m.bitaps) },
  { key: "bitimage", load: () => import("./bitimage.ts").then((m) => m.bitimage) },
  { key: "bits", load: () => import("./bits.ts").then((m) => m.bits) },
  { key: "book-quiz", load: () => import("./book-quiz.ts").then((m) => m.bookQuiz) },
  {
    key: "brave-new-world",
    load: () => import("./brave-new-world.ts").then((m) => m.braveNewWorld),
  },
  { key: "coin-artist", load: () => import("./coin-artist.ts").then((m) => m.coinArtist) },
  { key: "doges-gambit", load: () => import("./doges-gambit.ts").then((m) => m.dogesGambit) },
  { key: "dug", load: () => import("./dug.ts").then((m) => m.dug) },
  { key: "genesis", load: () => import("./genesis.ts").then((m) => m.genesis) },
  { key: "great-riddle", load: () => import("./great-riddle.ts").then((m) => m.greatRiddle) },
  { key: "grycoin", load: () => import("./grycoin.ts").then((m) => m.grycoin) },
  { key: "gsmg", load: () => import("./gsmg.ts").then((m) => m.gsmg) },
  { key: "hash-collision", load: () => import("./hash-collision.ts").then((m) => m.hashCollision) },
  {
    key: "hunting-time",
    load: () => import("./hunting-time.ts").then((m) => m.huntingTimeCollection),
  },
  {
    key: "iamabananaamaa",
    load: () => import("./iamabananaamaa.ts").then((m) => m.iAmABananaAmaa),
  },
  { key: "ledger-donjon", load: () => import("./ledger-donjon.ts").then((m) => m.ledgerDonjon) },
  {
    key: "liberte-guidant-le-peuple",
    load: () =>
      import("./liberte-guidant-le-peuple.ts").then((m) => m.liberteGuidantLePeupleCollection),
  },
  { key: "luckylurker", load: () => import("./luckylurker.ts").then((m) => m.luckyLurker) },
  { key: "mineshop", load: () => import("./mineshop.ts").then((m) => m.mineshop) },
  { key: "mini", load: () => import("./mini.ts").then((m) => m.mini) },
  {
    key: "move-over-brokers",
    load: () => import("./move-over-brokers.ts").then((m) => m.moveOverBrokers),
  },
  { key: "movie-enigma", load: () => import("./movie-enigma.ts").then((m) => m.movieEnigma) },
  {
    key: "natasha-otomoski",
    load: () => import("./natasha-otomoski.ts").then((m) => m.natashaOtomoski),
  },
  {
    key: "path-to-greatness",
    load: () => import("./path-to-greatness.ts").then((m) => m.pathToGreatness),
  },
  { key: "phy", load: () => import("./phy.ts").then((m) => m.phy) },
  {
    key: "picture-puzzle",
    load: () => import("./picture-puzzle.ts").then((m) => m.picturePuzzle),
  },
  { key: "powerful-moss", load: () => import("./powerful-moss.ts").then((m) => m.powerfulMoss) },
  {
    key: "proof-of-writing",
    load: () => import("./proof-of-writing.ts").then((m) => m.proofOfWriting),
  },
  { key: "quizchain", load: () => import("./quizchain.ts").then((m) => m.quizchain) },
  { key: "quizchain2", load: () => import("./quizchain2.ts").then((m) => m.quizchain2) },
  { key: "real-big-block", load: () => import("./real-big-block.ts").then((m) => m.realBigBlock) },
  { key: "rushwallet", load: () => import("./rushwallet.ts").then((m) => m.rushwallet) },
  {
    key: "satoshi-birthday-quiz",
    load: () => import("./satoshi-birthday-quiz.ts").then((m) => m.satoshiBirthdayQuiz),
  },
  { key: "satoshi-maze", load: () => import("./satoshi-maze.ts").then((m) => m.satoshiMaze) },
  {
    key: "school-of-bitcoin",
    load: () => import("./school-of-bitcoin.ts").then((m) => m.schoolOfBitcoin),
  },
  { key: "seed-phrase", load: () => import("./seed-phrase.ts").then((m) => m.seedPhrase) },
  {
    key: "smith-lyle-moore",
    load: () => import("./smith-lyle-moore.ts").then((m) => m.smithLyleMoore),
  },
  { key: "teikhos", load: () => import("./teikhos.ts").then((m) => m.teikhos) },
  {
    key: "trivia-brainwallet",
    load: () => import("./trivia-brainwallet.ts").then((m) => m.triviaBrainwallet),
  },
  { key: "walking-banks", load: () => import("./walking-banks.ts").then((m) => m.walkingBanks) },
  { key: "warp", load: () => import("./warp.ts").then((m) => m.warp) },
  {
    key: "wealth-in-poetry",
    load: () => import("./wealth-in-poetry.ts").then((m) => m.wealthInPoetry),
  },
  { key: "weave", load: () => import("./weave.ts").then((m) => m.weave) },
  { key: "wickex", load: () => import("./wickex.ts").then((m) => m.wickex) },
  { key: "zden", load: () => import("./zden.ts").then((m) => m.zden) },
] as const;
