import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { CalcSchema, calcSchema } from "./schema";
import { QueueMethods } from "./service/queueMethods";
import { QueueResult } from "./service/types";

function App() {
  const [queueResult, setQueueResult] = useState<QueueResult | null>(null);
  const { handleSubmit, register, formState } = useForm<CalcSchema>({
    resolver: zodResolver(calcSchema),
  });

  const onCalculate = (data: CalcSchema) => {
    const calculations = QueueMethods.calcCumulativeProbabilities(
      +data.lambda,
      +data.miu,
      +data.iterations
    );
    setQueueResult(calculations);
  };

  return (
    <main className="w-full bg-gray-800 min-h-screen text-white flex items-center flex-col gap-4 p-5">
      <h1 className="font-bold text-2xl">Calculadora de cola</h1>
      <div className="rounded-md border border-gray-600 p-5 shadow-lg max-w-4xl w-full space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onCalculate)}>
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
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            Calcular
          </Button>
        </form>
        {queueResult && (
          <div className="p-2 rounded-lg shadow-md bg-gray-600">
            <div className="flex flex-wrap gap-4 w-full border-b-2 border-white">
              <p className="w-full flex-1 font-bold p-2">W: {queueResult.W}</p>
              <p className="w-full flex-1 font-bold p-2">
                Wq: {queueResult.Wq}
              </p>
              <p className="w-full flex-1 font-bold p-2">L: {queueResult.L}</p>
              <p className="w-full flex-1 font-bold p-2">
                Lq: {queueResult.Lq}
              </p>
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
    </main>
  );
}

export default App;
