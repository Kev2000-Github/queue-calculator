import { factorial, toFixedIfNecessary } from "@/utils/utils";
import { QueueProbability, QueueResult } from "./types";

const DECIMAL_PLACES = 6;

export class QueueMethods {
  constructor() {}

  public static calcCumulativeProbabilities(
    lambda: number,
    miu: number,
    n: number
  ): QueueResult {
    const rho = lambda / miu;
    const p0 = 1 - rho;
    const L = rho / p0;
    const W = 1 / (miu - lambda);
    const Wq = (rho / miu) * p0;
    const Lq = Math.pow(rho, 2) / p0;
    const Pn: QueueProbability[] = [
      {
        probability: p0,
        cummulativeProbability: p0,
      },
    ];
    for (let i = 1; i <= n; i++) {
      const Pi = p0 * Math.pow(rho, i);
      Pn.push({
        probability: Pi,
        cummulativeProbability: Pn[i - 1].cummulativeProbability + Pi,
      });
    }
    return {
      L: toFixedIfNecessary(L, DECIMAL_PLACES),
      W: toFixedIfNecessary(W, DECIMAL_PLACES),
      Wq: toFixedIfNecessary(Wq, DECIMAL_PLACES),
      Lq: toFixedIfNecessary(Lq, DECIMAL_PLACES),
      Pn: Pn.map((p) => ({
        probability: toFixedIfNecessary(p.probability, DECIMAL_PLACES),
        cummulativeProbability: toFixedIfNecessary(
          p.cummulativeProbability,
          DECIMAL_PLACES
        ),
      })),
    };
  }

  public static calcCumulativeProbabilitiesMMC(
    lambda: number,
    miu: number,
    c: number,
    n: number
  ): QueueResult {
    const rho = lambda / (miu * c);

    let p0 = 0;
    for (let i = 0; i < c; i++) {
      p0 += Math.pow(rho * c, i) / factorial(i);
    }
    p0 += Math.pow(rho * c, c) / (factorial(c) * (1 - rho));
    p0 = 1 / p0;

    const Lq =
      (p0 * Math.pow(rho * c, c) * rho) / (factorial(c) * Math.pow(1 - rho, 2));
    const L = Lq + rho * c;
    const W = L / lambda;
    const Wq = Lq / lambda;
    const Pn: QueueProbability[] = [
      {
        probability: p0,
        cummulativeProbability: p0,
      },
    ];
    for (let i = 1; i <= n; i++) {
      let Pi = 0;
      if (i < c) {
        Pi = (Math.pow(rho * c, i) * p0) / factorial(i);
      } else {
        Pi = (Math.pow(rho * c, i) * p0) / (factorial(c) * Math.pow(c, i - c));
      }
      Pn.push({
        probability: Pi,
        cummulativeProbability: Pn[i - 1].cummulativeProbability + Pi,
      });
    }
    return {
      L: toFixedIfNecessary(L, DECIMAL_PLACES),
      W: toFixedIfNecessary(W, DECIMAL_PLACES),
      Wq: toFixedIfNecessary(Wq, DECIMAL_PLACES),
      Lq: toFixedIfNecessary(Lq, DECIMAL_PLACES),
      Pn: Pn.map((p) => ({
        probability: toFixedIfNecessary(p.probability, DECIMAL_PLACES),
        cummulativeProbability: toFixedIfNecessary(
          p.cummulativeProbability,
          DECIMAL_PLACES
        ),
      })),
    };
  }
}
