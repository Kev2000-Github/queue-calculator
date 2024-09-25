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
    const partialProbabilities: number[] = [1];

    let index = 1;
    for (const { lambda, miu, numberAnchor, type } of inOutAvg) {
      if (type === InOutType.LESS_THAN_EQUAL) {
        const limit = numberAnchor;
        while (index <= limit) {
          const prevPartialProbability = partialProbabilities[index - 1];
          partialProbabilities.push(prevPartialProbability * (lambda / miu));
          index++;
        }
      } else if (type === InOutType.REST) {
        const rho = lambda / miu;
        if (rho >= 1) return null;
        const prevPartialProbability = partialProbabilities[index - 1];
        const partialProbRest = prevPartialProbability * (1 / (1 - rho));
        partialProbabilities.pop();
        partialProbabilities.push(partialProbRest);
        break;
      }
    }

    const p0 = 1 / partialProbabilities.reduce((acc, curr) => acc + curr, 0);

    const Pn: QueueProbability[] = [
      {
        probability: p0,
        cummulativeProbability: p0,
      },
    ];

    //Complete probabilities
    const lessLimits = inOutAvg.filter(
      (item) => item.type === InOutType.LESS_THAN_EQUAL
    );
    const restLimit = inOutAvg.find((item) => item.type === InOutType.REST);

    index = 1;
    for (const { numberAnchor, lambda, miu } of lessLimits) {
      while (index <= numberAnchor) {
        const prevProbability = Pn[index - 1].probability;
        const probability = prevProbability * (lambda / miu);
        Pn.push({
          probability,
          cummulativeProbability:
            Pn[index - 1].cummulativeProbability + probability,
        });
        index++;
      }
    }
    if (restLimit) {
      while (index < n) {
        const prevProbability = Pn[index - 1].probability;
        const probability =
          (prevProbability * restLimit.lambda) / restLimit.miu;
        Pn.push({
          probability,
          cummulativeProbability:
            Pn[index - 1].cummulativeProbability + probability,
        });
        index++;
      }
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
