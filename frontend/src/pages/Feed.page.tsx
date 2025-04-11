import Layout from "@/components/core/Layout.tsx";
import { InfiniteScrollFeed } from "@/components/feed/InfiniteScrollFeed.tsx";
import CreatePostCard from "@/components/posts/CreatePostCard.tsx";
import FeedSideBar from "@/components/feed/FeedSideBar.tsx";
import FeedFilterBar from "@/components/feed/FeedFilterBar.tsx";

export default function FeedPage() {
  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FeedSideBar />

          <div className="lg:col-span-2 space-y-6">
            <CreatePostCard />
            <FeedFilterBar />
            <InfiniteScrollFeed />
          </div>
        </div>
      </main>
    </Layout>
  );
}
