import {
  zodIntPositive,
  zodIntPositiveOptional,
  zodNumberPositive,
} from "@/utils/schema";
import z from "zod";

export const calcSchema = z
  .object({
    iterations: zodIntPositive,
    lambda: zodNumberPositive,
    miu: zodNumberPositive,
    maxCapacity: zodIntPositiveOptional,
  })
  .refine(
    (item) => {
      if (!item.maxCapacity && item.lambda >= item.miu) {
        return false;
      }
      return true;
    },
    {
      message:
        "ρ debe ser menor a 1 para la condicion que tiende al infinito, el sistema no es estable",
    }
  );

export type CalcSchema = z.infer<typeof calcSchema>;
