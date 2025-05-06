import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/api/apiClient.ts";
import { reportQueryKeys } from "@/api/reports/reportQueryKeys.ts";
import { TSFix } from "@/api";
import { Report } from "./reportTypes";

export function useReportUpdate() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const updateReportFn = async (updatedReport: Report) => {
    const response = await api.post(
      `/reports/${id}/update/`,
      updatedReport,
    );
    return response.data;
  };

  return useMutation({
    mutationFn: updateReportFn,
    onMutate: async (updatedReport) => {
      await queryClient.cancelQueries({
        queryKey: reportQueryKeys.detail(Number(id)),
      });
      
      const previousReport = queryClient.getQueryData(
        reportQueryKeys.detail(Number(id)),
      );
      
      queryClient.setQueryData(
        reportQueryKeys.detail(Number(id)),
        updatedReport,
      );
      
      return {
        previousReport: previousReport,
        updatedReport: updatedReport,
      };
    },
    onError: (_err, _updatedReport, context?: TSFix) => {
      queryClient.setQueryData(
        reportQueryKeys.detail(Number(id)),
        context.previousReport,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reportQueryKeys.all });
    },
  });
}