import UserMeCard from "@/components/users/cards/UserMeCard.tsx";
import ProfileCommunitiesCard from "@/components/profiles/ProfileCommunitiesCard.tsx";
import { useAuth } from "@/components/auth/SessionAuthProvider.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

export default function FeedSideBar() {
  const { user, loading } = useAuth();
  return (
    <div className="hidden lg:block space-y-6">
      <div className="sticky top-20 z-5 space-y-6">
        <UserMeCard />

        {loading || !user ? <Spinner /> : <ProfileCommunitiesCard user={user} />}
      </div>
    </div>
  );
}
