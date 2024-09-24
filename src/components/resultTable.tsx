import { Table } from "lucide-react";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { CumulativeProbabilityData } from "@/service/types";

export const CummulativeTable = (queueResult: CumulativeProbabilityData) => {
  return (
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
            <TableHead className="font-bold text-white uppercase">n</TableHead>
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
  );
};
