
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/api/apiClient";
import { toast } from "sonner";
import { eventQueryKeys } from "./eventQueryKeys";
import { Event } from "./eventTypes";

export function useEventCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createEventFn = async (newEvent: Event) => {
    const response = await api.post("/events/create/", newEvent);
    return response.data;
  };

  return useMutation({
    mutationFn: createEventFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: eventQueryKeys.all });
    },
    onSuccess: (data: Event) => {
      toast.success("Your event was created successfully!", {
        action: {
          label: "View Event",
          onClick: () => navigate(`/events/${data.id}`),
        },
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
    },
  });
}
