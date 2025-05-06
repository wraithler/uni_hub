import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { nameToAvatarFallback } from "@/lib/utils";
import { Friend } from "@/api/friends/friendTypes";

interface FriendCardProps {
  friend: Friend;
  onUnfriend?: () => void;
  showUnfriendButton?: boolean;
}

export default function FriendCard({
  friend,
  onUnfriend,
  showUnfriendButton = false,
}: FriendCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 border rounded-md shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={friend.avatar_url} alt={friend.first_name} />
          <AvatarFallback>
            {nameToAvatarFallback(`${friend.first_name} ${friend.last_name}`)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">
            {friend.first_name} {friend.last_name}
          </p>
        </div>
      </div>

      {showUnfriendButton && onUnfriend && (
        <Button
          variant="outline"
          size="sm"
          onClick={onUnfriend}
          className="text-xs"
        >
          Unfriend
        </Button>
      )}
    </div>
  );
}
