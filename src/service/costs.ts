import { InOutType } from "@/utils/constants";
import { QueueModel } from "./queueModels";
import { CostProps, CostResult } from "./types";

export class Cost{
    public constructor() {}

    public calculateCosts(models: CostProps[], costPerClient: number): CostResult[] | null{
        const result: CostResult[] = [];
        const calculator = QueueModel.instance;
        models.forEach((item) => {
            const modelResult = calculator.calculateCummulativeProbabilities({
                n: 1,
                maxCapacity: 0,
                numberServers: item.servers,
                inOutAvg: [{
                    lambda: item.lambda,
                    miu: item.miu,
                    type: InOutType.ALL,
                    numberAnchor: 0
                }]
            });
            if (modelResult){
                const ewc = costPerClient * modelResult.L;
                result.push({
                    L: modelResult.L,
                    EOC: item.costPerTime,
                    EWC: ewc,
                    ETC: item.costPerTime + ewc

                })
            }
        })
        return result
    }
}
