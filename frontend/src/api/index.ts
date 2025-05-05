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

export function isApplicationErrorResponse(
  error: unknown,
): error is ApplicationErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as ApplicationErrorResponse).response === "object" &&
    (error as ApplicationErrorResponse).response !== null &&
    "reason" in (error as ApplicationErrorResponse).response
  );
}

export type TSFix = any;
export const STALE_TIME = 5 * 60 * 1000;
