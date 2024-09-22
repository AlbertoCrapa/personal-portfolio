import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSpring, useTransform } from "framer-motion";

let previousItems = [];

export function randomWithoutRepetition(arr) {
  if (arr.length === 0) {
    throw new Error("Array must contain at least one item.");
  }
  if (previousItems.length === arr.length) {
    previousItems = [];
  }
  const availableItems = arr.filter(item => !previousItems.includes(item));
  const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
  previousItems.push(randomItem);

  return randomItem;
}


export function useSmoothTransform(value, springOptions, transformer) {
  return useSpring(useTransform(value, transformer), springOptions);
}
 
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}






