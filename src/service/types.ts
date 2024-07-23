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
