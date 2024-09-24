import {
  zodIntPositive,
  zodIntPositiveOptional,
  zodNumberPositive,
} from "@/utils/schema";
import z from "zod";

export const calcSchema = z.object({
  iterations: zodIntPositive,
  lambda: zodNumberPositive,
  miu: zodNumberPositive,
  maxCapacity: zodIntPositiveOptional,
});

export type CalcSchema = z.infer<typeof calcSchema>;
