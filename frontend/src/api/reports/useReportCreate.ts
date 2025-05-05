import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { reportQueryKeys } from "@/api/reports/reportQueryKeys.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TSFix } from "@/api";
import { Report } from "@/api/reports/reportTypes.ts";

export function useReportCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const createReportFn = async (newReport: Report) => {
    const response = await api.post("/reports/create/", newReport);
    return response.data;
  };
  
  return useMutation({
    mutationFn: createReportFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: reportQueryKeys.all });
    },
    onSuccess: (data: Report) => {
      toast.success("Your report was created successfully!", {
        action: {
          label: "View Report",
          onClick: () => {
            navigate(`/reports/${data.id}`);
          },
        },
      });
    },
    onError: (_err, _newReport, context: TSFix) => {
      queryClient.setQueryData(
        reportQueryKeys.all,
        context.previousReports
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reportQueryKeys.all });
    }
  });
}
