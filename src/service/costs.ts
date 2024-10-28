import { DECIMAL_PLACES, InOutType } from "@/utils/constants";
import { QueueModel } from "./queueModels";
import { CostProps, CostResult } from "./types";
import { toFixedIfNecessary } from "@/utils/utils";

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
                const eoc = item.servers == 1 ? item.costPerTime : item.costPerTime * item.servers;
                const ewc = costPerClient * modelResult.L;
                result.push({
                    L: toFixedIfNecessary(modelResult.L, DECIMAL_PLACES),
                    EOC: toFixedIfNecessary(eoc, DECIMAL_PLACES),
                    EWC: toFixedIfNecessary(ewc, DECIMAL_PLACES),
                    ETC: toFixedIfNecessary(item.costPerTime + ewc, DECIMAL_PLACES)

                })
            }
        })
        return result
    }
}
