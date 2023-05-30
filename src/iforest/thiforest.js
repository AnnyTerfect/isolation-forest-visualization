import * as math from "mathjs";
import { cumsum } from "./math.js";

function generateMatrix(P, i) {
  const N = P.length;
  const X = [0, ...cumsum(P)];
  const matrix = math.zeros((i + 1) * (N + 1 - i), (i + 1) * (N + 1 - i));

  for (let i1 = 0; i1 < i + 1; i1++) {
    for (let j1 = 0; j1 < N + 1 - i; j1++) {
      const demoninator = X[N - j1] - X[i1];
      for (let i2 = i1 + 1; i2 < i + 1; i2++) {
        const m = i1 * (N + 1 - i) + j1;
        const n = i2 * (N + 1 - i) + j1;
        matrix.set([m, n], (P[i2 - 1] / demoninator));
      }
      for (let j2 = j1 + 1; j2 < N + 1 - i; j2++) {
        const m = i1 * (N + 1 - i) + j1;
        const n = i1 * (N + 1 - i) + j2;
        matrix.set([m, n], (P[N - j2] / demoninator));
      }
    }
  }
  matrix.set([(i + 1) * (N + 1 - i) - 1, (i + 1) * (N + 1 - i) - 1], 1);
  return matrix;
}

function calcDepths(P) {
  return new Promise((resolve, reject) => {
    const N = P.length;
    const depths = [];

    for (let i = 0; i < P.length + 1; i++) {
      const A = generateMatrix(P, i);
      const X = math.zeros(1, (i + 1) * (N + 1 - i));
      const Y = math.zeros((i + 1) * (N + 1 - i), 1);
      X.set([0, 0], 1);
      Y.set([(i + 1) * (N + 1 - i) - 1, 0], 1);

      const A_pow = [math.identity((i + 1) * (N + 1 - i))];
      for (let i = 0; i < N; i++) {
        A_pow.push(math.multiply(A_pow[i], A));
      }

      let averageStep = 0;
      for (let i = 1; i < N + 1; i++) {
        averageStep += math
          .chain(i)
          .multiply(X)
          .multiply(math.subtract(A_pow[i], A_pow[i - 1]))
          .multiply(Y)
          .done()
          .get([0, 0]);
      }
      depths.push(averageStep);
    }

    resolve(depths);
  });
}

export { calcDepths };