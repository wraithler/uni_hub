import api from "../apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "./userQueryKeys.ts";

export function useUserMe() {
  const getUserMeFn = async () => {
    const response = await api.get("/auth/me");
    return response.data;
  };

  return useQuery({
    queryKey: userQueryKeys.me,
    queryFn: getUserMeFn,
  });
}
