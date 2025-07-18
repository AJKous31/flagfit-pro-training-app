import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx and tailwind-merge
 * This is useful for conditional styling and avoiding Tailwind class conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}