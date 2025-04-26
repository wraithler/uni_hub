import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { reportQueryKeys } from "@/api/reports/reportQueryKeys.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TSFix } from "@/api";
import { Report, ReportCreateInput } from "@/api/reports/reportTypes.ts";

export function useReportCreate() {
  const queryClient = useQueryClient();
//   const toast = useToast();
  const navigate = useNavigate();

  const createReportFn = async (newReport: ReportCreateInput) => {
    const response = await api.post("/reports/create/", newReport);
    return response.data;
  };

  return useMutation({
    mutationFn: createReportFn,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: reportQueryKeys.all });
    },
    onSettled: (data: Report) => {
      toast.success("Your report was created successfully!", {
        label: "View Report",
        onClick: () => {
          navigate(`/reports/${data.id}`);
        },
      });
    },
    onError: (_err, _newReport, context?: TSFix) => {
      queryClient.setQueryData(
        reportQueryKeys.all,
        context.previousReports
      );
    },
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: reportQueryKeys.all });
    }
  });
}