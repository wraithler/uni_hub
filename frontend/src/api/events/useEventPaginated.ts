
import { EventsQueryParameters } from "./eventQueryParameters";
import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { eventQueryKeys } from "./eventQueryKeys";
import { STALE_TIME } from "@/api";

export function useEventsPaginated(params: EventsQueryParameters) {
  const getEventsPaginatedFn = async () => {
    const response = await api.get("/events/", { params });
    return response.data;
  };

  return useQuery({
    queryKey: eventQueryKeys.pagination(params),
    queryFn: getEventsPaginatedFn,
    placeholderData: (previousData) => previousData,
    staleTime: STALE_TIME,
  });
}
