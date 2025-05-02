import { Post } from "@/api/posts/postTypes.ts";
import PostPinnedCard from "@/components/posts/cards/PostPinnedCard.tsx";
import PostGridCard from "@/components/posts/cards/PostGridCard.tsx";
import PostListCard from "@/components/posts/cards/PostListCard.tsx";

type PostCardProps = {
  variant: "list" | "grid" | "pinned";
  post: Post;
};

export default function PostCard({ variant, post }: PostCardProps) {
  switch (variant) {
    case "list":
      return <PostListCard post={post} />;
    case "grid":
      return <PostGridCard post={post} />;
    case "pinned":
      return <PostPinnedCard post={post} />;
    default:
      return <></>;
  }
}
