import {
  CumulativeProbabilityData,
  ICalculationProps,
  QueueProbability,
} from "../types";
import { ICalculator } from "./ICalculator";
import { toFixedIfNecessary } from "@/utils/utils";
import { DECIMAL_PLACES } from "@/utils/constants";

export class MM1Finite implements ICalculator {
  constructor() {}

  public calculateCummulativeProbabilities({
    n,
    maxCapacity,
    inOutAvg,
  }: ICalculationProps): CumulativeProbabilityData {
    const { lambda, miu } = inOutAvg[0];

    const rho = lambda / miu;
    const p0 = (1 - rho) / (1 - Math.pow(rho, maxCapacity + 1));
    const Pn: QueueProbability[] = [
      {
        probability: p0,
        cummulativeProbability: p0,
      },
    ];
    for (let i = 1; i <= n; i++) {
      if (i <= maxCapacity) {
        const Pi = p0 * Math.pow(rho, i);
        Pn.push({
          probability: Pi,
          cummulativeProbability: Pn[i - 1].cummulativeProbability + Pi,
        });
      } else {
        Pn.push({
          probability: 0,
          cummulativeProbability: Pn[i - 1].cummulativeProbability,
        });
      }
    }

    const lambdaPer = lambda * Pn[maxCapacity - 1].probability;
    const lambdaEff = lambda - lambdaPer;
    const rhoEff = lambdaEff / miu;
    const L =
      (rhoEff *
        (1 -
          (maxCapacity + 1) * Math.pow(rhoEff, maxCapacity) +
          maxCapacity * Math.pow(rhoEff, maxCapacity + 1))) /
      ((1 - rho) * (1 - Math.pow(rho, maxCapacity + 1)));
    const W = L / lambdaEff;
    const Wq = W - 1 / miu;
    const Lq = lambdaEff * Wq;

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
