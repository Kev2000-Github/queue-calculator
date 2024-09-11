import { zodIntPositive, zodNumberPositive } from "@/utils/schema";
import z from "zod";

export const calcSchema = z.object({
  iterations: zodIntPositive,
  lambda: zodNumberPositive,
  miu: zodNumberPositive,
});

export type CalcSchema = z.infer<typeof calcSchema>;
