import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/62`. */
export const b1000Puzzle62 = bitcoinPuzzle({
  id: "b1000/62",
  address: p2pkh("1Me6EfpwZK5kQziBwBfvLiHjaPGxCKLoJi", "e26646db84b0602f32b34b5a62ca3cae1f91b779"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03231a67e424caf7d01a00d5cd49b0464942255b8e48766f96602bdfa4ea14fea8"),
  key: hex("000000000000000000000000000000000000000000000000363d541eb611abee", 62).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYpCemuaUp7NigjvtJug",
  ),
  prize: 0.62,
  solvedAt: "2019-09-08 10:51:01",
  solveTime: 146594627,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.062,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.558,
    ),
    increase(
      "1377682be6c1b875153d7c2d5bceb9985cdf6b6d1054d96b20c4e8ccc7963195",
      "2019-06-11 10:21:45",
      0.000061,
    ),
    increase(
      "c6c7ec1a1435c9f049857fc8cf37ab14b90ee2a83e28e9bd059175ae17e955f8",
      "2019-06-20 19:31:16",
      0.00001,
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
    claim(
      "d96269bdbae871174f629f4ec136d8c2c99cb1a1db15d12903418dfc92df5465",
      "2019-09-08 10:51:01",
      0.620091,
    ),
  ],
});
