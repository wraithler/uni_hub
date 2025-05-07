import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nameToAvatarFallback(name: string) {
  // take first letter of first two words in name
  const words = name.split(" ");
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function timeAgo(djangoTimestamp: string): string {
    const now = new Date();
    const past = new Date(djangoTimestamp);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        y: 31536000, // 365 days
        mo: 2592000, // 30 days
        w: 604800,   // 7 days
        d: 86400,    // 24 hours
        h: 3600,     // 1 hour
        m: 60,       // 1 minute
        s: 1         // 1 second
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count >= 1) {
            return `${count}${unit} ago`;
        }
    }

    return 'just now';
}
