import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/api/apiClient";
import { reportQueryKeys } from "@/api/reports/reportQueryKeys";
import { toast } from "sonner";

export type ReportStatus = 
  | "PENDING" 
  | "UNDER_REVIEW" 
  | "RESOLVED" 
  | "CLOSED" 
  | "REJECTED";

export interface Report {
  id: number;
  reported_by: number;
  reported_user?: number;
  community?: number;
  category: number;
  title: string;
  description: string;
  evidence_links?: any;
  status: ReportStatus;
  reviewed_by?: number;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportResolveInput {
  status: ReportStatus;
  resolution_notes?: string;
}

interface MutationContext {
  previousReport: Report | undefined;
}

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
    onMutate: async (resolveData) => {
      await queryClient.cancelQueries({
        queryKey: reportQueryKeys.detail(Number(id)),
      });
      
      const previousReport = queryClient.getQueryData<Report>(
        reportQueryKeys.detail(Number(id))
      );
      
      // Create an optimistic update with the new status
      if (previousReport) {
        const optimisticReport = {
          ...previousReport,
          status: resolveData.status,
          resolution_notes: resolveData.resolution_notes || previousReport.resolution_notes,
        };
        
        queryClient.setQueryData(
          reportQueryKeys.detail(Number(id)),
          optimisticReport
        );
      }
      
      return {
        previousReport,
      };
    },
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
    onError: (_err, _resolveData, context) => {
      toast.error('Failed to update report status');
      
      if (context) {
        queryClient.setQueryData(
          reportQueryKeys.detail(Number(id)),
          context.previousReport
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reportQueryKeys.detail(Number(id)) });
      queryClient.invalidateQueries({ queryKey: reportQueryKeys.all });
    },
  });
}