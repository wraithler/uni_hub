import { useMutation } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { friendKeys } from "./friendQueryKeys";

const unfriend = async (friendId: number): Promise<void> => {
  await axios.delete(`/friends/${friendId}/`);
};

export function useUnfriend() {
  return useMutation({
    mutationKey: friendKeys.list(),
    mutationFn: unfriend,
  });
}
