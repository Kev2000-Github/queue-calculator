import {
  CumulativeProbabilityData,
  ICalculationProps,
  QueueProbability,
} from "../types";
import { ICalculator } from "./ICalculator";
import { toFixedIfNecessary } from "@/utils/utils";
import { DECIMAL_PLACES } from "@/utils/constants";

export class MM1Infinite implements ICalculator {
  constructor() {}

  public calculateCummulativeProbabilities({
    n,
    inOutAvg,
  }: ICalculationProps): CumulativeProbabilityData {
    const { lambda, miu } = inOutAvg[0];

    const rho = lambda / miu;
    const p0 = 1 - rho;
    const L = rho / p0;
    const W = 1 / (miu - lambda);
    const Wq = W - 1 / miu;
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
}
