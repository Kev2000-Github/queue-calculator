import z from "zod";

const zodNumber = z
  .string()
  .refine((val) => !isNaN(Number(val)) && val.trim() !== "", {
    message: "Ingrese un numero valido",
  });

const zodInt = zodNumber.refine((val) => Number.isInteger(+val), {
  message: "El numero debe ser entero",
});

export const calcSchema = z.object({
  iterations: zodInt,
  lambda: zodNumber,
  miu: zodNumber,
});

export type CalcSchema = z.infer<typeof calcSchema>;
