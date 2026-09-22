# Parts

The constructors in `src/core/parts.ts`, exported from the package root too. They keep optional fields absent instead of empty, so build every address, key, transaction, asset, party and hint with them.

```ts
p2pkh(value, hash160?);
p2wpkh(value, hash160?);
p2wsh(value);
p2sh(value, hash160, redeemScript(hash, script)?);
standard(value, hash160?); // Ethereum, Arweave

compressed(value);
uncompressed(value);

funding(txid, date, amount);
increase(txid, date, amount);
decrease(txid, date, amount);
pubkeyReveal(txid, date, amount);
claim(txid, date, amount);
sweep(txid, date, amount);

assets({ puzzle, solution, hints, sourceUrl });
party(name, { key, kind, aliases, about, addresses, profiles, facts }); // an author; a solver takes name, addresses, profiles
profile(name, url);
fact(text, source, { date? }); // one sentence a public page states about a party
official(text, source, confirmation?, { date?, answer? }); // from the author
community(text, source, confirmation?, { date?, answer? }); // from anyone else, right or not
confirmation(url, description?); // optional, an archive or the author's republication of the same hint
answer(text, source, { date? }); // a published answer to that one hint
```

A hint's `source` is where it was published. The optional `confirmation` links to an archive of that page or to another place the author published the same hint, not to a solver's reconstruction or general context about the puzzle. An `answer` is a published response to that hint with its own source, not a verified solution, and it never goes into the hint text. None of them says the hint is right; `kind` says who gave it. A hint shared by a whole collection sits on the collection once, `super(key, author, puzzles, hints)`, and a puzzle inherits it:

```ts
collection.hints; // readonly Hint[], the shared ones
collection.hintsFor(query); // the collection's, then the puzzle's own
collection.hintsById(id);
```

Key material chains from whichever starter fits, then adds what else is known:

```ts
hex("00…01", 1).wif("KwDi…"); // raw key plus its WIF, 1-bit search space
bits(135); // nothing published beyond the range
wif("5J34…").passphrase("HY4r0uWn").salt("a@b.c"); // WarpWallet
encryptedWif("6PnW…", { passphrase: "335Y-…" }); // BIP38
passphrase("594Y-…"); // passphrase known, key not published
seed("session cigar grape…", "m/84'/0'/0'/0/0").xpub("zpub…");
derivation("m/84'/0'/0'/0/0").shares(3, 5, [share(1, "…"), share(2, "…")]);
mini("S6c56bnX…");
seed("…", "m/44'/0'/0'/0/0").entropy("1808d3…", source(url, "kitten tweet"), "Required");
```
