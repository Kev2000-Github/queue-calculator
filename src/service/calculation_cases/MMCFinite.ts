import {
    CumulativeProbabilityData,
    ICalculationProps,
    QueueProbability,
  } from "../types";
import { ICalculator } from "./ICalculator";
import { factorial, toFixedIfNecessary } from "@/utils/utils";
import { DECIMAL_PLACES } from "@/utils/constants";

export class MMCFinite implements ICalculator {
    constructor() {}

    public calculateCummulativeProbabilities({
        numberServers,
        n,
        inOutAvg,
        maxCapacity
    }: ICalculationProps): CumulativeProbabilityData {
        const {lambda, miu} = inOutAvg[0];
        const rho = lambda / miu;
        const rhoC = rho / numberServers;
        const helper = maxCapacity - numberServers + 1

        let last_operand_p0 = 0
        if (rhoC == 1){
            last_operand_p0 = helper;
        } else {
            last_operand_p0 =
            (1 - Math.pow(rhoC, helper)) /
            (1 - rhoC);
        }
        let p0 = 0;
        for (let i = 0; i < numberServers; i++){
            p0 += Math.pow(rho, i) / factorial(i);
        }
        p0 += (Math.pow(rho, numberServers) / factorial(numberServers)) * last_operand_p0;
        p0 = 1 / p0;
        const Pn: QueueProbability[] = [
            {
              probability: p0,
              cummulativeProbability: p0,
            },
          ];
        for (let i = 1; i <= n; i++){
            let pi = 0;
            if (i < numberServers){
                pi = (Math.pow(rho, i) / factorial(i)) * p0;
            } else if (i >= numberServers && i <= maxCapacity) {
                pi = (Math.pow(rho, i) /
                (factorial(numberServers) * Math.pow(numberServers, i - numberServers))) * p0;
            }
            Pn.push({
                probability: pi,
                cummulativeProbability: Pn[i - 1].cummulativeProbability + pi
            })
        }

        const lambdaPer = lambda * Pn[maxCapacity].probability;
        const lambdaEff = lambda - lambdaPer;
        const rhoEff = lambdaEff / miu;
        let Lq = 0
        if (rhoC == 1){
            Lq = (Math.pow(rho, numberServers) * (maxCapacity - numberServers) *
            helper * p0) / (factorial(2 * numberServers))
        } else {
            Lq = (Math.pow(rho, numberServers + 1) /
            (factorial(numberServers - 1) * Math.pow(numberServers - rho, 2))) *
            (1 - Math.pow(rhoC, helper) - (helper * (1 - rhoC) *
            Math.pow(rhoC, maxCapacity - numberServers))) * p0
        }
        let L = Lq + rhoEff;
        let W = L / lambdaEff;
        let Wq = Lq / lambdaEff;

        return {
            L: toFixedIfNecessary(L, DECIMAL_PLACES),
            Lq: toFixedIfNecessary(Lq, DECIMAL_PLACES),
            W: toFixedIfNecessary(W, DECIMAL_PLACES),
            Wq: toFixedIfNecessary(Wq, DECIMAL_PLACES),
            Pn: Pn.map((p) => ({
                probability: toFixedIfNecessary(p.probability, DECIMAL_PLACES),
                cummulativeProbability: toFixedIfNecessary(
                  p.cummulativeProbability,
                  DECIMAL_PLACES
                ),
            })),
        }
    }
}
