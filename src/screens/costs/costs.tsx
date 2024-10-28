import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CostResult } from "@/service/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { CalcSchema, calcSchema } from "./costs.schema";
import { Label } from "@/components/ui/label";
import { Cost } from "@/service/costs";

const CostsPage = () => {
  const [costResult, setCostResult] = useState<CostResult[] | null>(null);
  const { handleSubmit, register, formState, control } =
    useForm<CalcSchema>({
      resolver: zodResolver(calcSchema),
      defaultValues: {
        inOutAvg: [
          {
            lambda: "",
            miu: "",
            servers: "1",
            costPerTime: "",
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inOutAvg",
  });

  const onCalculate = (data: CalcSchema) => {
    const inOutAvg = data.inOutAvg.map(
      ({ lambda, miu, servers, costPerTime }) => {
        return {
          lambda: +lambda,
          miu: +miu,
          servers: +servers,
          costPerTime: +costPerTime,
        };
      }
    );
    const calculator = new Cost();

    const calculations = calculator.calculateCosts(inOutAvg, +data.costPerClient);
    setCostResult(calculations);
  };

  return (
    <div className="rounded-md mx-auto border border-gray-600 p-5 shadow-lg max-w-4xl w-full space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit(onCalculate)}>
        <h1 className="font-bold text-lg">
          Calculadora para costos{" "}
        </h1>
        <div className="w-fit flex-1 space-y-2">
          <Label htmlFor="costPerClient">Costo por espera de cliente:</Label>
          <Input
            {...register("costPerClient")}
            id="costPerClient"
            className="bg-transparent border-gray-600"
            type="text"
            placeholder="Costo de espera"
          />
          {formState.errors.costPerClient && (
            <p className="text-red-500 text-sm">
              {formState.errors.costPerClient.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-5">
          <span>Tasa de llegada</span>
          <span>Tasa de servicio</span>
          <span>Número de servidores</span>
          <span>Costo por unidad de tiempo</span>
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
              <div>
                <Input
                  {...register(`inOutAvg.${index}.servers`)}
                  className="bg-transparent border-gray-600 w-28"
                  type="text"
                  placeholder="Servidores"
                />
                {formState.errors.inOutAvg?.[index]?.servers && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.inOutAvg[index].servers.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...register(`inOutAvg.${index}.costPerTime`)}
                  className="bg-transparent border-gray-600 w-28"
                  type="text"
                  placeholder="Costo"
                />
                {formState.errors.inOutAvg?.[index]?.costPerTime && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.inOutAvg[index].costPerTime.message}
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
                servers: "1",
                costPerTime: "",
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
      {costResult && (
        <div className="p-2 rounded-lg shadow-md bg-gray-600">
          <Table>
            <TableCaption>Costos del problema.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-white uppercase">
                  n
                </TableHead>
                <TableHead className="font-bold text-white uppercase">
                  L
                </TableHead>
                <TableHead className="font-bold text-white uppercase">
                  EOC
                </TableHead>
                <TableHead className="font-bold text-white uppercase">
                  EWC
                </TableHead>
                <TableHead className="font-bold text-white uppercase">
                  ETC
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costResult.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{idx}</TableCell>
                  <TableCell>{item.L}</TableCell>
                  <TableCell>{item.EOC}</TableCell>
                  <TableCell>{item.EWC}</TableCell>
                  <TableCell>{item.ETC}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CostsPage;
