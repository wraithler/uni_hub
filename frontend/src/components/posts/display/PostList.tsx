import { Post } from "@/api/posts/postTypes.ts";
import PostCard from "@/components/posts/cards/PostCard.tsx";
import ListEmpty from "@/components/common/ListEmpty.tsx";
import { Info } from "lucide-react";

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
      return (
        <div className="space-y-4">
          {postCards.length > 0 ? (
            postCards
          ) : (
            <ListEmpty
              title="No posts available"
              description="There are no posts available currently, check back later!"
              icon={<Info className="w-12 h-12 mb-4" />}
            />
          )}
        </div>
      );
    case "grid":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {postCards.length > 0 ? (
            postCards
          ) : (
            <ListEmpty
              title="No posts available"
              description="There are no posts available currently, check back later!"
              icon={<Info className="w-12 h-12 mb-4" />}
            />
          )}
        </div>
      );
    default:
      return <></>;
  }
}
