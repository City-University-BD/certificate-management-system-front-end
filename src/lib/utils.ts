import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/utils/globalStore.ts
let userSignature: string | null = null;

export const getSignature = () => userSignature;

export const setSignature = (value: string | null) => {
  userSignature = value;
};

