import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toFixedIfNecessary(value: number, decimals: number) {
  return +value.toFixed(decimals);
}
