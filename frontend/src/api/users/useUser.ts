import api from "../apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "./userQueryKeys.ts";

export function useUser({ id }: { id: number | undefined}) {
  const url = `/users/${id !== undefined ? id : ""}`;
  const getUserFn = async () => {
    const response = await api.get(url);
    return response.data;
  };

  return useQuery({
    queryKey: userQueryKeys.detail(Number(id)),
    queryFn: getUserFn,
  });
}
