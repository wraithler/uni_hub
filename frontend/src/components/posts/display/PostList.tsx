import { Post } from "@/api/posts/postTypes.ts";
import PostCard from "@/components/posts/cards/PostCard.tsx";

type PostListProps = {
  variant: "list" | "grid";
  posts: Post[];
};

export default function PostList({ variant, posts }: PostListProps) {
  const postCards = posts.map((post: Post) => (
    <PostCard variant={variant} post={post} key={post.id} />
  ));

  switch (variant) {
    case "list":
      return <div className="space-y-4">{postCards}</div>;
    case "grid":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {postCards}
        </div>
      );
    default:
      return <></>;
  }
}
