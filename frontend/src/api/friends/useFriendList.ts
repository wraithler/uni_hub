import { useQuery } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { friendKeys } from "./friendQueryKeys";
import { Friend } from "./friendTypes";

const getFriendList = async (userId?: number): Promise<Friend[]> => {
  const url = userId ? `/friends/?user_id=${userId}` : "/friends/";
  const response = await api.get(url);
  return response.data;
};

export function useFriendList(userId?: number) {
  return useQuery({
    queryKey: friendKeys.list(userId),
    queryFn: () => getFriendList(userId),
  });
}
