import UserMeCard from "@/components/users/UserMeCard.tsx";
import UserCommunitiesCard from "@/components/users/UserCommunitiesCard.tsx";

export default function FeedSideBar() {
  return (
    <div className="hidden lg:block space-y-6">
      <div className="sticky top-20 z-5 space-y-6">
        <UserMeCard />
        <UserCommunitiesCard />
      </div>
    </div>
  );
}
