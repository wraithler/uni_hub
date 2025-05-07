import { useFriendList } from "@/api/friends/useFriendList";
import FriendCard from "./FriendCard";
import { useUnfriend } from "@/api/friends/useUnFriend";
import { Skeleton } from "@/components/ui/skeleton";

export default function FriendList() {
  const { data: friends, isLoading } = useFriendList();
  const unfriend = useUnfriend();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return <p className="text-sm text-muted-foreground">No friends yet</p>;
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          showUnfriendButton
          onUnfriend={() => unfriend.mutate(friend.id)}
        />
      ))}
    </div>
  );
}
