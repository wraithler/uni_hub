import { User } from "@/api/users/userTypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUnfriend } from "@/api/friends/useUnFriend";
import { nameToAvatarFallback } from "@/lib/utils";

export default function FriendCard({
  friend,
  showUnfriend = false,
  onUnfriend,
}: {
  friend: User;
  showUnfriend?: boolean;
  onUnfriend?: () => void;
}) {
  const { mutate } = useUnfriend();

  const handleUnfriend = () => {
    mutate(friend.id, {
      onSuccess: () => {
        if (onUnfriend) onUnfriend();
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={friend.avatar} alt={friend.first_name} />
          <AvatarFallback>
            {nameToAvatarFallback(friend.first_name + " " + friend.last_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{friend.first_name} {friend.last_name}</p>
        </div>
      </div>

      {showUnfriend && (
        <Button variant="outline" size="sm" onClick={handleUnfriend}>
          Unfriend
        </Button>
      )}
    </div>
  );
}
