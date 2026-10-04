import { puzzle } from "../../core/puzzle.ts";
import { funding, increase } from "../../core/parts.ts";

/** Puzzle `weave/10`. */
export const weave10 = puzzle({
  id: "weave/10",
  chain: "arweave",
  address: "bkjJGw3NLxs8OAyRxgTL-QFpiB3lBJqZ76kDhWdB-Rs",
  sourceUrl: "https://arweave.net/1fLPMP_smP6ipdIYbYUAZtFPwO4crdYr4kMVf5uTivg",
  startedAt: "2020-04-14 09:17:16",
  prize: 500.02225493,
  transactions: [
    funding("uurk6fxEsygKJmr-fJyC-3sPneslNV3ZtUx0fZxZAG0", "2020-04-14 09:17:16", 500),
    increase("iI9rjoVNoZoWAHudVCN9wWlJL5YFMeo2r0SoUC0LbG4", "2022-01-07 05:06:10", 0.021863),
    increase("ChM61oJsB8p3W63jxJjSQX3rjJRA3FzZ2F5kQ0a1GWQ", "2024-09-28 13:07:00", 0.0001),
    increase("KKw55MWbTtbw54mCxg77guHwUs5dNTJP9ThNr0CYzt4", "2024-10-21 21:11:42", 0.000001),
    increase("Nv63dxWDroFbli8qsi5Ta8PL8KB7hvnc3e9ZEemowbw", "2024-10-29 00:20:23", 0.000001),
    increase("mIPaMftJhXle_iE9ezin45538KBc5JP2blBu3xS3P4E", "2025-04-02 20:53:36", 0.000001),
    increase("UO-F1lFXv_F4dtz7PfpVcSiYCZM_vY9I8KHSvQgql6Y", "2025-04-24 15:14:03", 0.000001),
    increase("RrWVvQf90nLLMD356_mV372BqC96_Zn-yby9-7ci6r8", "2025-05-03 09:12:11", 0.000001),
    increase("pGqJYirSEQ2KIGz3pownU1LLWe-6_YSHLYNzMdXKfgs", "2025-05-22 18:36:20", 0.000001),
    increase("W_V6dhrB9nxKQUYOWTrJp2Iazi14FnhwxoC_xjIHy9k", "2025-06-19 22:37:50", 0.00001),
    increase("BS7ShTDtll_cOTLVcuoI9ShtR-slDxEh2kl3R_yTRwg", "2025-07-07 19:04:54", 0.00001),
    increase("Uf20u0MPh-mepqkHYYH31mTd4ibyyZ-Sl6deeyYtcJ4", "2025-08-03 22:21:15", 0.00012),
    increase("4M5Whco4CcU7FkIlhII_j81V_5IYxxSu7ljEWBaLiIs", "2025-08-14 14:53:41", 0.00002),
    increase("FKZ_TtmvFzBxfgxAnx76lp36cinHXDa2jF3uoZa5Cb4", "2025-08-27 14:49:19", 0.00002),
    increase("fqDnw6TGuBEmWvYDNyl9WHdEgauKvKGFfrVW4KkkQa4", "2025-09-26 16:28:06", 0.00010593),
  ],
});
