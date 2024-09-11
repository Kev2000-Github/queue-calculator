import z from "zod";

export const zodNumber = z
  .string()
  .refine((val) => !isNaN(Number(val)) && val.trim() !== "", {
    message: "Ingrese un numero valido",
  });

export const zodNumberPositive = zodNumber.refine((val) => +val > 0, {
  message: "El numero debe ser positivo",
});

export const zodInt = zodNumber.refine((val) => Number.isInteger(+val), {
  message: "El numero debe ser entero",
});

export const zodIntPositive = zodInt.refine((val) => +val > 0, {
  message: "El numero debe ser positivo",
});
