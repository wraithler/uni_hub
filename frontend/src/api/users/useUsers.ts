import api from "../apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "./userQueryKeys.ts";

export function useUsers() {
  const getUsersFn = async () => {
    const response = await api.get("/users/");
    return response.data;
  };

  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: getUsersFn,
  });
}
