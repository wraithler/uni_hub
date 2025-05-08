import { useMutation } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { friendKeys } from "./friendQueryKeys";

const unfriend = async (friendId: number): Promise<void> => {
  await api.delete(`/friends/${friendId}/`);
};

export function useUnfriend() {
  return useMutation({
    mutationKey: friendKeys.list(),
    mutationFn: unfriend,
  });
}
