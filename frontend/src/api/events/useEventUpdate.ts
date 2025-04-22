import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/api/apiClient";
import { eventQueryKeys } from "./eventQueryKeys";
import { TSFix } from "@/api";
import { Event } from "./eventTypes";

export function useEventUpdate() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const updateEventFn = async (updatedEvent: Event) => {
    const response = await api.patch(`/events/${id}/update/`, updatedEvent);
    return response.data;
  };

  return useMutation({
    mutationFn: updateEventFn,
    onMutate: async (updatedEvent) => {
      await queryClient.cancelQueries({
        queryKey: eventQueryKeys.detail(Number(id)),
      });
      const previousEvent = queryClient.getQueryData(
        eventQueryKeys.detail(Number(id))
      );
      queryClient.setQueryData(
        eventQueryKeys.detail(Number(id)),
        updatedEvent
      );
      return {
        previousEvent,
        updatedEvent,
      };
    },
    onError: (_err, _updatedEvent, context?: TSFix) => {
      queryClient.setQueryData(
        eventQueryKeys.detail(Number(id)),
        context?.previousEvent
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
    },
  });
}
