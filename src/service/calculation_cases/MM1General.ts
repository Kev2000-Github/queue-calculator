import {
  CumulativeProbabilityData,
  ICalculationProps,
  QueueProbability,
} from "../types";
import { ICalculator } from "./ICalculator";
import { toFixedIfNecessary } from "@/utils/utils";
import { DECIMAL_PLACES, InOutType } from "@/utils/constants";

export class MM1General implements ICalculator {
  constructor() {}

  public calculateCummulativeProbabilities({
    n,
    inOutAvg,
  }: ICalculationProps): CumulativeProbabilityData | null {
    //Probabilities with Po multiplication pending
    const partialProbabilities: number[] = [];

    let index = 1;
    for (const { lambda, miu, numberAnchor, type } of inOutAvg) {
      if (type === InOutType.LESS_THAN_EQUAL) {
        const limit = numberAnchor;
        while (index <= limit) {
          const prevPartialProbability = partialProbabilities[index - 1] || 1;
          partialProbabilities.push(prevPartialProbability * (lambda / miu));
          index++;
        }
      } else if (type === InOutType.REST) {
        const rho = lambda / miu;
        if (rho >= 1) return null;
        partialProbabilities.push(1 / (1 - rho));
        break;
      }
    }

    const p0 = 1 / partialProbabilities.reduce((acc, curr) => acc + curr, 0);

    //Complete probabilities
    const Pn: QueueProbability[] = [
      {
        probability: p0,
        cummulativeProbability: p0,
      },
    ];
    for (let i = 1; i <= n; i++) {
      const Pi = p0 * (partialProbabilities[i - 1] || 0);
      Pn.push({
        probability: Pi,
        cummulativeProbability: Pn[i - 1].cummulativeProbability + Pi,
      });
    }

    const L = Pn.reduce((acc, curr, index) => {
      return acc + curr.probability * (index + 1);
    }, 0);
    const W = 0;
    const Wq = 0;
    const Lq = 0;

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
