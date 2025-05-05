import { useQuery } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { eventQueryKeys } from "./eventQueryKeys";
import { EventsQueryParameters } from "./eventQueryParameters";

export function useEvents(params?: EventsQueryParameters) {
  const getEventsFn = async () => {
    const response = await api.get("/events/", { params });
    return response.data;
  };

  return useQuery({
    queryKey: [eventQueryKeys.all, params],
    queryFn: getEventsFn,
  });
}
