import { usePostsPaginated } from "@/api/posts/usePostPaginated.ts";
import { useAuth } from "@/components/auth/SessionAuthProvider.tsx";
import { useCommunities } from "@/api/communities/useCommunities";
import ProfileContent from "@/components/profiles/ProfileContent.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import Layout from "@/components/core/Layout.tsx";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const {
    data: myPosts,
    isLoading: isPostsLoading,
    pagination,
  } = usePostsPaginated({
    my: true,
  });
  const { data: myCommunities, isLoading: isCommsLoading } = useCommunities({
    my: true,
  });

  const doneLoading =
    !loading &&
    !isPostsLoading &&
    !isCommsLoading &&
    user &&
    myPosts &&
    myCommunities &&
    pagination;

  if (!doneLoading) {
    return (
      <Layout>
        <Spinner className="m-auto mt-24" />
      </Layout>
    );
  }

  return (
    <ProfileContent
      user={user}
      posts={myPosts.results}
      communities={myCommunities.results}
      pagination={pagination}
      self={true}
    />
  );
}
