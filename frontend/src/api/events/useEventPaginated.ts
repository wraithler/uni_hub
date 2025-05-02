import { EventsQueryParameters } from "./eventQueryParameters.ts";
import api from "../apiClient";
import { eventQueryKeys } from "./eventQueryKeys";
import { usePaginatedQuery } from "@/lib/tanstackExtension";

export function useEventPaginated(params: EventsQueryParameters) {
  const getEventsPaginatedFn = async () => {
    const response = await api.get("/events/", { params });
    return response.data;
  };

  return usePaginatedQuery({
    queryKey: eventQueryKeys.pagination(params),
    queryFn: getEventsPaginatedFn,
    params,
    limit: params.limit || 12,
  });
}
