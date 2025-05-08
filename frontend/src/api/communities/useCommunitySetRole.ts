import api from "@/api/apiClient.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { communityQueryKeys } from "@/api/communities/communityQueryKeys.ts";

type UseCommunitySetRoleProps = {
  community_id: number;
  role: string;
  user_id: number;
  is_suspended?: boolean;
};

export default function useCommunitySetRole() {
  const queryClient = useQueryClient();
  const setRoleFn = async ({
    community_id,
    role,
    user_id,
    is_suspended,
  }: UseCommunitySetRoleProps) => {
    const response = await api.post(`/communities/${community_id}/set-role/`, {
      role,
      user_id,
      is_suspended,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: setRoleFn,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: communityQueryKeys.all,
      });
    },
    onSuccess: () => {
      toast.success("Successfully updated role");
    },
    onError: () => {
      toast.error("Error occurred");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.all,
      });
    },
  });
}
