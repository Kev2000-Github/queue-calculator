import { CummulativeTable } from "@/components/resultTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueueModel } from "@/service/queueModels";
import { QueueResult } from "@/service/types";
import { InOutType } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CalcSchema, calcSchema } from "./MMC.schema";

const MMCPage = () => {
  const [queueResult, setQueueResult] = useState<QueueResult | null>(null);
  const { handleSubmit, register, formState } = useForm<CalcSchema>({
    resolver: zodResolver(calcSchema),
  });

  const onCalculate = (data: CalcSchema) => {
    const calculator = QueueModel.instance;

    const calculations = calculator.calculateCummulativeProbabilities({
      n: +data.iterations,
      maxCapacity: 0,
      numberServers: +data.servers,
      inOutAvg: [
        {
          type: InOutType.ALL,
          numberAnchor: 0,
          lambda: +data.lambda,
          miu: +data.miu,
        },
      ],
    });
    setQueueResult(calculations);
  };
  return (
    <div className="rounded-md mx-auto border border-gray-600 p-5 shadow-lg max-w-4xl w-full space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit(onCalculate)}>
        <h1 className="font-bold text-lg">
          Calculadora para colas modelo M/M/C
        </h1>
        <h1 className="text-gray-300">
          Tipo simple con tasa media de llegada λ y tasa media de salida μ
          constante
        </h1>
        <div className="flex gap-4">
          <div className="w-full flex-1 space-y-2">
            <Label htmlFor="lambda">Tasa de llegada (λ):</Label>
            <Input
              {...register("lambda")}
              id="lambda"
              className="bg-transparent border-gray-600"
              type="text"
              placeholder="Tasa de llegada"
            />
            {formState.errors.lambda && (
              <p className="text-red-500 text-sm">
                {formState.errors.lambda.message}
              </p>
            )}
          </div>
          <div className="w-full flex-1 space-y-2">
            <Label htmlFor="miu">Tasa de servicio (μ):</Label>
            <Input
              {...register("miu")}
              id="miu"
              className="bg-transparent border-gray-600"
              type="text"
              placeholder="Tasa de servicio"
            />
            {formState.errors.miu && (
              <p className="text-red-500 text-sm">
                {formState.errors.miu.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-fit flex-1 space-y-2">
            <Label htmlFor="servers">Numero de servidores:</Label>
            <Input
              {...register("servers")}
              id="servers"
              className="bg-transparent border-gray-600"
              type="text"
              placeholder="Iteraciones"
            />
            {formState.errors.servers && (
              <p className="text-red-500 text-sm">
                {formState.errors.servers.message}
              </p>
            )}
          </div>
          <div className="w-fit flex-1 space-y-2">
            <Label htmlFor="iterations">Numero de iteraciones:</Label>
            <Input
              {...register("iterations")}
              id="iterations"
              className="bg-transparent border-gray-600"
              type="text"
              placeholder="Iteraciones"
            />
            {formState.errors.iterations && (
              <p className="text-red-500 text-sm">
                {formState.errors.iterations.message}
              </p>
            )}
          </div>
          <div className="w-fit flex-1 space-y-2">
            <Label className="text-nowrap" htmlFor="maxCapacity">
              Maxima capacidad del sistema:
            </Label>
            <Input
              {...register("maxCapacity")}
              id="maxCapacity"
              className="bg-transparent border-gray-600"
              type="text"
              placeholder="N"
            />
            {formState.errors.maxCapacity && (
              <p className="text-red-500 text-sm">
                {formState.errors.maxCapacity.message}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Calcular
        </Button>
      </form>
      {queueResult && <CummulativeTable {...queueResult} />}
    </div>
  );
};

export default MMCPage;
