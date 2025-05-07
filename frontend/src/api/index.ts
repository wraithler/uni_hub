export type PaginationProps = {
  limit?: number;
  offset?: number;
};

export type PaginationResponse = {
  limit: number;
  offset: number;
  count: number;
  next: string | null;
  previous: string | null;
};

export interface ApplicationErrorResponse {
  response: {
    error: string;
    extra?: {
      reason?: "spam" | string;
      [key: string]: unknown;
    };
  };
}

export function formatTimestampRange(start: string, end: string): { date: string; time: string } {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayName = days[startDate.getUTCDay()];
  const dateNum = startDate.getUTCDate();
  const monthName = months[startDate.getUTCMonth()];

  // Ordinal suffix (1st, 2nd, 3rd, etc.)
  function getOrdinal(n: number): string {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  const dateString = `${dayName} ${dateNum}${getOrdinal(dateNum)} ${monthName}`;

  // Format time in HH:MM (24-hour format)
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatTime = (d: Date) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;

  const timeString = `${formatTime(startDate)} - ${formatTime(endDate)}`;

  return { date: dateString, time: timeString };
}


export type TSFix = any;
export const STALE_TIME = 5 * 60 * 1000;
