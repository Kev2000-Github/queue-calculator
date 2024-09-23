import { InOutType, QueueType } from "@/utils/constants";
import {
  CumulativeProbabilityData,
  ICalculationProps,
  InOutAvg,
} from "./types";
import { ICalculator } from "./calculation_cases/ICalculator";
import { MMCInfinite } from "./calculation_cases/MMCInfinite";
import { MM1Finite } from "./calculation_cases/MM1Finite";
import { MM1General } from "./calculation_cases/MM1General";
import { MM1Infinite } from "./calculation_cases/MM1Infinite";

export class QueueModel {
  static _instance: QueueModel;

  private constructor() {}

  public static get instance() {
    if (!QueueModel._instance) {
      QueueModel._instance = new QueueModel();
    }
    return QueueModel._instance;
  }

  public getQueueType(
    N: number,
    C: number,
    inOutAvg: InOutAvg[]
  ): QueueType | null {
    const specializedCondition =
      inOutAvg.length === 1 && inOutAvg[0].type === InOutType.ALL;

    if (
      // specialized case MM1 infinite
      specializedCondition &&
      C === 1 &&
      N === 0
    ) {
      return QueueType.MM1_INFINITE;
    } else if (
      // specialized case MM1 finite
      specializedCondition &&
      C === 1 &&
      N > 0
    ) {
      return QueueType.MM1_FINITE;
    } else if (
      // specialized case MMC infinite
      specializedCondition &&
      C > 1 &&
      N === 0
    ) {
      return QueueType.MMC_INFINITE;
    } else if (
      // specialized case MMC finite
      specializedCondition &&
      C > 1 &&
      N > 0
    ) {
      return QueueType.MMC_FINITE;
    } else if (
      // general case MM1
      this.isValidInOutAvgGeneral(inOutAvg) &&
      C === 1
    ) {
      return QueueType.MM1_GENERAL;
    } else if (
      // general case MMC
      this.isValidInOutAvgGeneral(inOutAvg) &&
      C > 1
    ) {
      return QueueType.MMC_GENERAL;
    } else {
      return null;
    }
  }

  public calculateCummulativeProbabilities(
    props: ICalculationProps
  ): CumulativeProbabilityData | null {
    const { inOutAvg, maxCapacity, numberServers } = props;
    const type = this.getQueueType(maxCapacity, numberServers, inOutAvg);
    let calculator: ICalculator | null = null;

    switch (type) {
      default:
        return null;
      case QueueType.MM1_INFINITE:
        calculator = new MM1Infinite();
        return calculator.calculateCummulativeProbabilities(props);
      case QueueType.MM1_FINITE:
        calculator = new MM1Finite();
        return calculator.calculateCummulativeProbabilities(props);
      case QueueType.MMC_INFINITE:
        calculator = new MMCInfinite();
        return calculator.calculateCummulativeProbabilities(props);
      case QueueType.MM1_GENERAL:
        calculator = new MM1General();
        return calculator.calculateCummulativeProbabilities(props);
    }
  }

  private countTypes(types: InOutType[], type: InOutType): number {
    return types.filter((currentType) => currentType === type).length;
  }

  private isValidInOutAvgGeneral(inOutAvg: InOutAvg[]) {
    const inOutAvgTypes = inOutAvg.map((inOutAvg) => inOutAvg.type);

    return (
      inOutAvg.length > 1 &&
      this.countTypes(inOutAvgTypes, InOutType.ALL) === 0 &&
      this.countTypes(inOutAvgTypes, InOutType.LESS_THAN_EQUAL) > 0 &&
      this.countTypes(inOutAvgTypes, InOutType.REST) < 2
    );
  }
}
