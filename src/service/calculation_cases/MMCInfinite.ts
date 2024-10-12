import {
  CumulativeProbabilityData,
  ICalculationProps,
  QueueProbability,
} from "../types";
import { ICalculator } from "./ICalculator";
import { factorial, toFixedIfNecessary } from "@/utils/utils";
import { DECIMAL_PLACES } from "@/utils/constants";

export class MMCInfinite implements ICalculator {
  constructor() {}

  public calculateCummulativeProbabilities({
    numberServers,
    n,
    inOutAvg,
  }: ICalculationProps): CumulativeProbabilityData {
    const { lambda, miu } = inOutAvg[0];

    const rho = lambda / miu;

    let p0 = 0;
    for (let i = 0; i < numberServers; i++) {
      p0 += Math.pow(rho, i) / factorial(i);
    }
    p0 +=
      (Math.pow(rho, numberServers) / factorial(numberServers)) * (1 / (1 - rho / numberServers));
    p0 = 1 / p0;

    const Lq =
      (p0 * Math.pow(rho, numberServers + 1)) /
      (factorial(numberServers - 1) * Math.pow(numberServers - rho, 2));
    const L = Lq + rho;
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
      if (i < numberServers) {
        Pi = (Math.pow(rho, i) * p0) / factorial(i);
      } else {
        Pi =
          (Math.pow(rho, i) * p0) /
          (factorial(numberServers) *
            Math.pow(numberServers, i - numberServers));
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
