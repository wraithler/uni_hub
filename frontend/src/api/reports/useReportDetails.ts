import api from "@/api/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { reportQueryKeys } from "@/api/reports/reportQueryKeys.ts";

type UseReportDetailProps = {
  id: number;
};

export function useReportDetail({ id }: UseReportDetailProps) {
  const getReportFn = async () => {
    const response = await api.get(`/reports/${id}/`);
    return response.data;
  };

  return useQuery({
    queryKey: reportQueryKeys.detail(id),
    queryFn: getReportFn,
  });
}