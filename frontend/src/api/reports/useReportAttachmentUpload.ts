
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/api/apiClient";
import { reportQueryKeys } from "@/api/reports/reportQueryKeys";
import { toast } from "sonner";
import { Report, ReportAttachment, ReportAttachmentUploadInput, MutationContext} from "./reportTypes";

export function useReportAttachmentUpload() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const uploadAttachmentFn = async (data: ReportAttachmentUploadInput) => {

    const formData = new FormData();
    formData.append("file", data.file);
    
    if (data.description) {
      formData.append("description", data.description);
    }

    const response = await api.post<ReportAttachment>(
      `/reports/${id}/attachments/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return response.data;
  };

  return useMutation<ReportAttachment, Error, ReportAttachmentUploadInput, MutationContext>({
    mutationFn: uploadAttachmentFn,
    onMutate: async (_: ReportAttachmentUploadInput) => {
      await queryClient.cancelQueries({
        queryKey: reportQueryKeys.detail(Number(id)),
      });

      const previousReport = queryClient.getQueryData<Report>(
        reportQueryKeys.detail(Number(id))
      );
      
      return {
        previousReport,
      };
    },
    onSuccess: () => {
      toast.success("Attachment uploaded successfully");
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload attachment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: reportQueryKeys.detail(Number(id)) 
      });
    },
  });
}


export function useReportBulkAttachmentUpload() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const uploadAttachmentsFn = async (data: ReportAttachmentUploadInput[]) => {
    const uploadPromises = data.map(item => {
      const formData = new FormData();
      formData.append("file", item.file);
      
      if (item.description) {
        formData.append("description", item.description);
      }
      
      return api.post<ReportAttachment>(
        `/reports/${id}/attachments/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    });

    const responses = await Promise.all(uploadPromises);
    return responses.map(response => response.data);
  };

  return useMutation<ReportAttachment[], Error, ReportAttachmentUploadInput[], MutationContext>({
    mutationFn: uploadAttachmentsFn,
    onMutate: async (_: ReportAttachmentUploadInput[]) => {
      await queryClient.cancelQueries({
        queryKey: reportQueryKeys.detail(Number(id)),
      });

      const previousReport = queryClient.getQueryData<Report>(
        reportQueryKeys.detail(Number(id))
      );
      
      return {
        previousReport,
      };
    },
    onSuccess: (data) => {
      toast.success(`${data.length} attachment${data.length !== 1 ? 's' : ''} uploaded successfully`);
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload attachments");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: reportQueryKeys.detail(Number(id)) 
      });
    },
  });
}