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

export const zodNumberOptional = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      return !isNaN(Number(val)) && val.trim() !== "";
    },
    {
      message: "Ingrese un numero valido",
    }
  );

export const zodNumberPositiveOptional = zodNumberOptional.refine(
  (val) => {
    if (!val) return true;
    return +val > 0;
  },
  {
    message: "El numero debe ser positivo",
  }
);

export const zodIntOptional = zodNumberOptional.refine(
  (val) => {
    if (!val) return true;
    return Number.isInteger(+val);
  },
  {
    message: "El numero debe ser entero",
  }
);

export const zodIntPositiveOptional = zodIntOptional.refine(
  (val) => {
    if (!val) return true;
    return +val > 0;
  },
  {
    message: "El numero debe ser positivo",
  }
);
