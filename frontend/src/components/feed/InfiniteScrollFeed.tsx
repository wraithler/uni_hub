import InfiniteScroll from "react-infinite-scroll-component";
import {CircleCheck, Loader2, UserCircle} from "lucide-react";
import PostCard from "@/components/posts/PostCard.tsx";
import React from "react";
import EventCard from "@/components/events/EventCard.tsx";
import { useAuth } from "@/components/auth/AuthProvider.tsx";
import {useFeed} from "@/api/feed/useFeed.ts";
import {FeedItem} from "@/api/feed/feedTypes.ts";

export const InfiniteScrollFeed = () => {
  const { data, fetchNextPage } = useFeed();
  const { user } = useAuth();
  return (
    <InfiniteScroll
      next={fetchNextPage}
      hasMore={data?.pages.at(-1)?.results.length !== 0}
      dataLength={
        data?.pages.reduce((acc, page) => acc + page.results.length, 0) || 0
      }
      loader={<Loader2 className="m-auto mt-5" />}
      endMessage={
        <>
          {!user && (
            <div className="flex flex-col items-center justify-center py-12 text-center col-span-3">
              <UserCircle className="w-12 h-12 mb-4 stroke-ruby-600" />
              <h3 className="text-lg font-medium mb-2">
                You're not logged in
              </h3>
              <p className="text-muted-foreground mb-4">
                To see a personalized feed, please log in to your account.
              </p>
            </div>
          )}
          {user && (
            <div className="flex flex-col items-center justify-center py-12 text-center col-span-3">
              <CircleCheck className="w-12 h-12 mb-4 stroke-emerald-600" />
              <h3 className="text-lg font-medium mb-2">
                There's no more content
              </h3>
              <p className="text-muted-foreground mb-4">
                You're all caught up! Check back later for new posts and events.
              </p>
            </div>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.results.map((item: FeedItem) =>
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
