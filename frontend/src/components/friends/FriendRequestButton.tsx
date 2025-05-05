import { useSendFriendRequest } from "@/api/friends/useSendFriendRequest";
import { useUnfriend } from "@/api/friends/useUnFriend";
import { Button } from "@/components/ui/button";

interface FriendRequestButtonProps {
  userId: number;
  status: "none" | "sent" | "friend";
}

export default function FriendRequestButton({
  userId,
  status,
}: FriendRequestButtonProps) {
  const sendRequest = useSendFriendRequest();
  const unfriend = useUnfriend();

  const handleClick = () => {
    if (status === "none") {
      sendRequest.mutate({ receiver_id: userId });
    } else if (status === "friend") {
      unfriend.mutate(userId);
    }
  };

  let label = "Add Friend";
  let disabled = false;

  if (status === "sent") {
    label = "Request Sent";
    disabled = true;
  } else if (status === "friend") {
    label = "Unfriend";
  }

  return (
    <Button
      variant={status === "friend" ? "outline" : "default"}
      size="sm"
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
