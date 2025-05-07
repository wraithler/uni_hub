import { usePostsPaginated } from "@/api/posts/usePostPaginated.ts";
import { useCommunities } from "@/api/communities/useCommunities";
import ProfileContent from "@/components/profiles/ProfileContent.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import Layout from "@/components/core/Layout.tsx";
import { useParams } from "react-router-dom";
import {useUser} from "@/api/users/useUser.ts";

export default function ProfileOtherPage() {
  const { id } = useParams();

  const { data: user, isLoading } = useUser({ id: Number(id) });
  const { data: myPosts, isLoading: isPostsLoading, pagination } = usePostsPaginated({
    created_by: Number(id),
  });
  const { data: myCommunities, isLoading: isCommsLoading } = useCommunities({
    user_id: Number(id),
  });

  const doneLoading =
    !isLoading &&
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
    />
  );
}
