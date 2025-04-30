import { useQuery } from "@tanstack/react-query";
import { reportQueryKeys } from "./reportQueryKeys.ts";
import api from "../apiClient.ts";
import { ReportQueryParams } from "@/api/reports/reportQueryParameters.ts";

export function useReports(params: ReportQueryParams) {
  const getReportsFn = async () => {
    const response = await api.get("/reports/", {
      params,
    });
    return response.data;
  };

  return useQuery({
    queryKey: [reportQueryKeys.all, params],
    queryFn: getReportsFn,
    placeholderData: (prev) => prev,
  });
}