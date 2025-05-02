import Layout from "@/components/core/Layout.tsx";
import FeedSideBar from "@/components/feed/FeedSideBar.tsx";
import PostCreateForm from "@/components/posts/PostCreateForm.tsx";
import FilteredFeed from "@/components/feed/FilteredFeed.tsx";

export default function FeedPage() {
  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FeedSideBar />

          <div className="lg:col-span-2 space-y-6">
            <PostCreateForm />
            <FilteredFeed />
          </div>
        </div>
      </main>
    </Layout>
  );
}
