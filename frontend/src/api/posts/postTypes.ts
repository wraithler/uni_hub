import { Community } from "@/api/communities/communityTypes.ts";
import { UserMe } from "@/api/old/types/users.ts";

type Post = {
  id?: number;
  content: string;
  community?: Community | number;
  created_by: UserMe; // TODO: Change from UserMe to generic

  // TODO: Add likes/comments
};

export type { Post };
