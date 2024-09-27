import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function timeSince(date: Date | number) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];

  for (const [intervalSeconds, label] of intervals) {
    const interval = seconds / intervalSeconds;
    if (interval >= 1) {
      const count = Math.floor(interval);
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now"; // If less than a second has passed
}
