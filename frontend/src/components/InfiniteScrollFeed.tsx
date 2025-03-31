import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";
import { useFeed } from "@/hooks/useFeed.ts";
import PostCard from "@/components/PostCard.tsx";
import React from "react";
import EventCard from "@/components/EventCard.tsx";

export const InfiniteScrollFeed = () => {
  const { data, fetchNextPage } = useFeed();
  return (
    <InfiniteScroll
      next={fetchNextPage}
      hasMore={data?.pages.at(-1)?.results.length !== 0}
      dataLength={
        data?.pages.reduce((acc, page) => acc + page.results.length, 0) || 0
      }
      loader={<Loader2 className="m-auto mt-5" />}
      endMessage={
        <p className="text-center text-muted-foreground mt-5">No more posts</p>
      }
    >
      <div className="space-y-4">
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.results.map((item) =>
              item.type === "post" ? (
                <PostCard key={item.id} {...item} />
              ) : (
                <EventCard key={item.id} {...item} />
              ),
            )}
          </React.Fragment>
        ))}
      </div>
    </InfiniteScroll>
  );
};
