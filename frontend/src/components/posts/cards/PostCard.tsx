import { Post } from "@/api/posts/postTypes.ts";
import PostPinnedCard from "@/components/posts/cards/PostPinnedCard.tsx";

type PostCardProps = {
  variant: "list" | "grid" | "pinned";
  post: Post;
};

export default function PostCard({ variant, post }: PostCardProps) {
  switch (variant) {
    case "list":
      return <></>;
    case "grid":
      return <></>;
    case "pinned":
      return <PostPinnedCard post={post} />;
    default:
      return <></>;
  }
}
