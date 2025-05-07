import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { friendKeys } from "./friendQueryKeys";
import { Friend } from "./friendTypes";

const getFriendList = async (): Promise<Friend[]> => {
  const response = await axios.get("/friends/");
  return response.data;
};

export function useFriendList() {
  return useQuery({
    queryKey: friendKeys.list(),
    queryFn: getFriendList,
  });
}
