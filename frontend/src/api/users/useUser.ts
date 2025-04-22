import { useParams } from "react-router-dom";
import api from "../apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "./userQueryKeys.ts";

export function useUser() {
  const { id } = useParams();

  const getUserFn = async () => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  };

  return useQuery({
    queryKey: userQueryKeys.detail(Number(id)),
    queryFn: getUserFn,
  });
}
