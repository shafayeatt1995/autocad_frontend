import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
