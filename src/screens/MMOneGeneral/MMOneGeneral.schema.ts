import { InOutType } from "@/utils/constants";
import { zodIntPositive, zodNumberPositive } from "@/utils/schema";
import z from "zod";

export const calcSchema = z.object({
  iterations: zodIntPositive,
  inOutAvg: z
    .array(
      z.object({
        type: z.nativeEnum(InOutType),
        numberAnchor: zodIntPositive,
        lambda: zodNumberPositive,
        miu: zodNumberPositive,
      })
    )
    .min(1, "Por favor ingrese datos")
    .refine(
      (items) => {
        const restTypes = items.filter((item) => item.type === InOutType.REST);
        if (restTypes.length > 1) {
          return false;
        }
        return true;
      },
      { message: "Solo se puede tener una condicion de ≥" }
    ),
});

export type CalcSchema = z.infer<typeof calcSchema>;
