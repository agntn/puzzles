import { fileURLToPath } from "node:url";
import { checkoutCommit } from "../../src/checkout.ts";
import { version } from "../../src/version.ts";

/** Where the library points asset links: the repository at this package version's release tag. */
export const ASSETS = `https://raw.githubusercontent.com/agntn/puzzles/v${version}`;

/** Where the CLI here points them: the checkout's commit, or the tag without `origin/main`. */
const checkout = checkoutCommit(fileURLToPath(new URL("../../", import.meta.url)));
export const CHECKOUT_ASSETS = `https://raw.githubusercontent.com/agntn/puzzles/${checkout ?? `v${version}`}`;
