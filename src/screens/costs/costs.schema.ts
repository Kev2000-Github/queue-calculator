import { zodIntPositive, zodNumberPositive } from "@/utils/schema";
import z from "zod";

export const calcSchema = z.object({
  costPerClient: zodNumberPositive,
  inOutAvg: z
    .array(
      z.object({
        lambda: zodNumberPositive,
        miu: zodNumberPositive,
        servers: zodIntPositive,
        costPerTime: zodNumberPositive,
      })
    )
    .min(1, "Por favor ingrese datos")
    // .refine(
    //   (items) => {
    //     items.forEach((item) => {
    //       if (+item.servers == 1){
    //         const rho = +item.lambda / +item.miu;
    //         if (rho >= 1) {
    //           return false;
    //         }
    //       }
    //       return true;
    //     })
    //   },
    //   {
    //     message:
    //       "ρ debe ser menor a 1 para la condicion que tiende al infinito, el sistema no es estable",
    //   }
    // ),
});

export type CalcSchema = z.infer<typeof calcSchema>;
