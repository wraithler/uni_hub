
import { ReportQueryParams } from "./reportQueryParameters.ts";
import api from "../apiClient.ts";
import { reportQueryKeys } from "./reportQueryKeys.ts";
import {usePaginatedQuery} from "@/lib/tanstackExtension.ts";

export function useReportsPaginated(params: ReportQueryParams) {
  const getReportsPaginatedFn = async () => {
    const response = await api.get("/reports/", { params });
    return response.data;
  };

  return usePaginatedQuery({
    queryKey: reportQueryKeys.pagination(params),
    queryFn: getReportsPaginatedFn,
    params,
    limit: params.limit || 10
  });
}