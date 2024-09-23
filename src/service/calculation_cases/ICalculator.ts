import { CumulativeProbabilityData, ICalculationProps } from "../types";

export abstract class ICalculator {
  public abstract calculateCummulativeProbabilities(
    props: ICalculationProps
  ): CumulativeProbabilityData | null;
}
