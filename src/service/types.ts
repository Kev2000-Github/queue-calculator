import { InOutType } from "@/utils/constants";

export type QueueProbability = {
  probability: number;
  cummulativeProbability: number;
};

export type QueueResult = {
  W: number;
  Wq: number;
  L: number;
  Lq: number;
  Pn: QueueProbability[];
};

export type CumulativeProbabilityData = {
  L: number;
  W: number;
  Wq: number;
  Lq: number;
  Pn: {
    probability: number;
    cummulativeProbability: number;
  }[];
};

export type ICalculationProps = {
  n: number;
  maxCapacity: number;
  numberServers: number;
  inOutAvg: InOutAvg[];
};

export type InOutAvg = {
  type: InOutType;
  numberAnchor: number;
  lambda: number;
  miu: number;
};
