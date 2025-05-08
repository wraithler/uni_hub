import { useFriendList } from "@/api/friends/useFriendList";
import FriendCard from "@/components/friends/FriendCard";

export default function FriendList() {
  const { data: friends, refetch } = useFriendList();

  if (!friends || friends.length === 0) {
    return <p className="text-sm text-muted-foreground">No friends yet 🫠</p>;
  }

  return (
    <div className="space-y-3">
      {friends.map((friend: any) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          showUnfriend
          onUnfriend={refetch}
        />
      ))}
    </div>
  );
}
