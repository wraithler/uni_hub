import { usePostsPaginated } from "@/api/posts/usePostPaginated.ts";
import { useState } from "react";
import PostList from "@/components/posts/display/PostList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Grid, List } from "lucide-react";
import PaginationBox from "@/components/common/PaginationBox.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Community } from "@/api/communities/communityTypes.ts";
import { usePosts } from "@/api/posts/usePosts.ts";
import PostCard from "@/components/posts/cards/PostCard.tsx";
import PostCreateDialog from "@/components/posts/PostCreateDialog.tsx";

export default function PostListContainer({
  community,
}: {
  community: Community;
}) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const {
    data: posts,
    pagination,
    isLoading,
  } = usePostsPaginated({
    community_id: Number(community.id),
    limit: 12,
  });
  const { data: pinnedPost } = usePosts({
    pinned: true,
    community_id: Number(community.id),
    limit: 1,
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Posts</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-slate-100" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-slate-100" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <PostCreateDialog/>
        </div>
      </div>

      {isLoading ? (
        [1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-[200px] w-full" />
        ))
      ) : (
        <>
          {pinnedPost && pinnedPost.results.length > 0 && (
            <PostCard variant="pinned" post={pinnedPost.results[0]} />
          )}

          <PostList posts={posts.results} variant={viewMode} />
          {pagination && <PaginationBox pagination={pagination} />}
        </>
      )}
    </>
  );
}
