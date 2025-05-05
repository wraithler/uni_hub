import { ReportQueryParams } from "./reportQueryParameters.ts";

export const reportQueryKeys = {
  all: ["reports"],
  details: () => [...reportQueryKeys.all, "detail"],
  detail: (id: number) => [...reportQueryKeys.details(), id],
  pagination: ({
    limit,
    offset,
    status,
    reported_by,
    reported_user,
    community,
    is_my_report,
    sort_by,
  }: ReportQueryParams) => [
    ...reportQueryKeys.all,
    "pagination",
    {
      limit,
      offset,
      status,
      reported_by,
      reported_user,
      community,
      is_my_report,
      sort_by,
    },
  ],
};