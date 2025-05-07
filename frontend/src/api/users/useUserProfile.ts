import { useParams } from "react-router-dom";
import { useAuth } from "@/components/auth/SessionAuthProvider.tsx";
import { useUser } from "@/api/users/useUser.ts";

export function useUserProfile() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const userQuery = useUser({ id: Number(id)! });

  const user = id ? userQuery.data : authUser;
  const isLoading = id ? userQuery.isLoading : false;
  const isOwnProfile = !id;

  return { user, isOwnProfile, isLoading, id: id || authUser?.id };
}
