import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QueueModel } from "@/service/queueModels";
import { QueueResult } from "@/service/types";
import { InOutType } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CalcSchema, calcSchema } from "./MMOneGeneral.schema";
import { Label } from "@/components/ui/label";

const MMOneGeneralPage = () => {
  const [queueResult, setQueueResult] = useState<QueueResult | null>(null);
  const { handleSubmit, register, formState, control, setValue } =
    useForm<CalcSchema>({
      resolver: zodResolver(calcSchema),
      defaultValues: {
        inOutAvg: [
          {
            lambda: "",
            miu: "",
            numberAnchor: "",
            type: InOutType.LESS_THAN_EQUAL,
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inOutAvg",
  });

  const orderConditions = (inOutAvg: CalcSchema["inOutAvg"]) => {
    const inOutAvgOrdered = inOutAvg.sort(
      (a, b) => +a.numberAnchor - +b.numberAnchor
    );
    setValue("inOutAvg", inOutAvgOrdered);
  };

  const onCalculate = (data: CalcSchema) => {
    orderConditions(data.inOutAvg);
    const restConditionIdx = data.inOutAvg.findIndex(
      (item) => item.type === InOutType.REST
    );
    if (
      restConditionIdx !== -1 &&
      restConditionIdx !== data.inOutAvg.length - 1
    ) {
      alert(
        "La condicion de ≥ debe ser la ultima, no puede haber numero limite mayor que ella"
      );
      return;
    }

    const inOutAvg = data.inOutAvg.map(
      ({ lambda, miu, numberAnchor, type }) => {
        return {
          lambda: +lambda,
          miu: +miu,
          numberAnchor: +numberAnchor,
          type,
        };
      }
    );
    const calculator = QueueModel.instance;

    const calculations = calculator.calculateCummulativeProbabilities({
      n: +data.iterations,
      maxCapacity: 0,
      numberServers: 1,
      inOutAvg,
    });
    setQueueResult(calculations);
  };

  return (
    <div className="rounded-md mx-auto border border-gray-600 p-5 shadow-lg max-w-4xl w-full space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit(onCalculate)}>
        <h1 className="font-bold text-lg">
          Calculadora para colas modelo M/M/1{" "}
        </h1>
        <h1 className="text-gray-300">
          Tasas con llegada y servicio promedio distintas en cada estado del
          sistema
        </h1>
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
        <div className="grid grid-cols-5">
          <span>Tasa de llegada</span>
          <span>Tasa de servicio</span>
          <span>Tipo</span>
          <span>Limite</span>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-5">
              <div>
                <Input
                  {...register(`inOutAvg.${index}.lambda`)}
                  className="bg-transparent border-gray-600 w-28"
                  type="text"
                  placeholder="λ"
                />
                {formState.errors.inOutAvg?.[index]?.lambda && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.inOutAvg[index].lambda.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...register(`inOutAvg.${index}.miu`)}
                  className="bg-transparent border-gray-600 w-28"
                  type="text"
                  placeholder="μ"
                />
                {formState.errors.inOutAvg?.[index]?.miu && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.inOutAvg[index].miu.message}
                  </p>
                )}
              </div>
              <div className="w-fit">
                <Controller
                  name={`inOutAvg.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(val)}
                      value={field.value}
                    >
                      <SelectTrigger className="w-28 bg-transparent border-gray-600">
                        <SelectValue placeholder="Selecciona condicion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={InOutType.LESS_THAN_EQUAL}>
                          {"≤"}
                        </SelectItem>
                        <SelectItem value={InOutType.REST}>{"≥"}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Input
                  {...register(`inOutAvg.${index}.numberAnchor`)}
                  className="bg-transparent border-gray-600 w-28"
                  type="text"
                />
                {formState.errors.inOutAvg?.[index]?.numberAnchor && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.inOutAvg[index].numberAnchor.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                onClick={() => remove(index)}
                className="px-4 py-2 w-fit"
                variant={"destructive"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() =>
              append({
                lambda: "",
                miu: "",
                numberAnchor: "",
                type: InOutType.LESS_THAN_EQUAL,
              })
            }
            className="bg-purple-600 hover:bg-purple-700"
          >
            Agregar condicion
          </Button>
        </div>
        <hr />
        {formState.errors.inOutAvg && (
          <p className="text-red-500 text-sm">
            {formState.errors.inOutAvg.message ||
              formState.errors.inOutAvg.root?.message}
          </p>
        )}
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Calcular
        </Button>
      </form>
      {queueResult && (
        <div className="p-2 rounded-lg shadow-md bg-gray-600">
          <div className="flex flex-wrap gap-4 w-full border-b-2 border-white">
            <p className="w-full flex-1 font-bold p-2">W: {queueResult.W}</p>
            <p className="w-full flex-1 font-bold p-2">Wq: {queueResult.Wq}</p>
            <p className="w-full flex-1 font-bold p-2">L: {queueResult.L}</p>
            <p className="w-full flex-1 font-bold p-2">Lq: {queueResult.Lq}</p>
          </div>
          <Table>
            <TableCaption>Probabilidades del problema.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-white uppercase">
                  n
                </TableHead>
                <TableHead className="font-bold text-white uppercase">
                  probabilidad
                </TableHead>
                <TableHead className="font-bold text-white uppercase">
                  probabilidad acumulada
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queueResult.Pn.map((prob, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{idx}</TableCell>
                  <TableCell>{prob.probability}</TableCell>
                  <TableCell>{prob.cummulativeProbability}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MMOneGeneralPage;
