import { zodIntPositive, zodNumberPositive } from "@/utils/schema";
import z from "zod";

export const calcSchema = z
  .object({
    iterations: zodIntPositive,
    lambda: zodNumberPositive,
    miu: zodNumberPositive,
    servers: zodIntPositive,
    maxCapacity: zodIntPositive,
  })
  .refine((data) => data.maxCapacity >= data.servers, {
    message:
      "La capacidad maxima debe ser mayor o igual a la cantidad de servidores",
  });

export type CalcSchema = z.infer<typeof calcSchema>;
