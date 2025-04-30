import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/api/apiClient";
import { reportQueryKeys } from "@/api/reports/reportQueryKeys";
import { toast } from "sonner";
import { 
  Report, 
  ReportStatus, 
  ReportResolveInput, 
  MutationContext 
} from "./reportTypes";

export function useReportResolve() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const resolveReportFn = async (resolveData: ReportResolveInput) => {
    const response = await api.post<Report>(
      `/reports/${id}/resolve/`,
      resolveData
    );
    return response.data;
  };

  return useMutation<Report, Error, ReportResolveInput, MutationContext>({
    mutationFn: resolveReportFn,
    onSuccess: (data) => {
      const statusMessages: Record<ReportStatus, string> = {
        'RESOLVED': 'The report has been resolved',
        'CLOSED': 'The report has been closed',
        'REJECTED': 'The report has been rejected',
        'UNDER_REVIEW': 'The report is now under review',
        'PENDING': 'The report status has been updated to pending'
      };
      
      toast.success(statusMessages[data.status] || 'Report status updated');
    },
    onError: (_err, _resolveData) => {
      toast.error('Failed to update report status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reportQueryKeys.detail(Number(id)) });
      queryClient.invalidateQueries({ queryKey: reportQueryKeys.all });
    },
  });
}