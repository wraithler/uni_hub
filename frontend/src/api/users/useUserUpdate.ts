import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient.ts";
import { TSFix } from "@/api";
import { User } from "@/api/users/userTypes.ts";
import { userQueryKeys } from "@/api/users/userQueryKeys.ts";

export function useUserUpdate() {
  const queryClient = useQueryClient();

  const updateCommunityFn = async (updatedUser: User) => {
    const response = await api.post(
      `/users/${updatedUser.id}/update/`,
      updatedUser,
    );
    return response.data;
  };

  return useMutation({
    mutationFn: updateCommunityFn,
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({
        queryKey: userQueryKeys.detail(updatedUser.id),
      });

      const previousUser = queryClient.getQueryData<User>(userQueryKeys.detail(updatedUser.id));

      queryClient.setQueryData(userQueryKeys.detail(updatedUser.id), {
        ...previousUser,
        ...updatedUser,
      });

      return { previousUser: previousUser };
    },
    onError: (_err, _updatedUser, context?: TSFix) => {
      queryClient.setQueryData(userQueryKeys.detail(_updatedUser.id), context.previousUser);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSettled: async (data, _error, _variables, _context) => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(data.id) });
    },
  });
}
