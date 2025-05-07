import api from "../apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "./userQueryKeys.ts";
import {PaginationProps} from "@/api";

type UseUsersQueryParams = PaginationProps & {
  community_id: number;
  name?: string;
}

export function useUsers(params: UseUsersQueryParams) {
  const getUsersFn = async () => {
    const response = await api.get("/users/", { params });
    return response.data;
  };

  return useQuery({
    queryKey: [userQueryKeys.all, params],
    queryFn: getUsersFn,
  });
}
