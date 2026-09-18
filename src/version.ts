import pkg from "../package.json" with { type: "json" };

/** Package version. */
export const version: string = pkg.version;
