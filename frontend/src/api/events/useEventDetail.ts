import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { eventQueryKeys } from "./eventQueryKeys";

export function useEventDetail(id: number) {
  const getEventFn = async () => {
    const response = await api.get(`/events/${id}/`);
    return response.data;
  };

  return useQuery({
    queryKey: eventQueryKeys.detail(id),
    queryFn: getEventFn,
  });
}
