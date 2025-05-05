import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { FriendRequest } from "./friendTypes";
import { friendKeys } from "./friendQueryKeys";

const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const response = await axios.get("/requests/");
  return response.data;
};

export function useFriendRequests() {
  return useQuery({
    queryKey: friendKeys.requests(),
    queryFn: getFriendRequests,
  });
}
