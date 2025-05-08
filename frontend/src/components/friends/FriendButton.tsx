import { useSendFriendRequest } from "@/api/friends/useSendFriendRequest";
import { useAcceptFriendRequest } from "@/api/friends/useAcceptFriendRequest";
import { useUnfriend } from "@/api/friends/useUnFriend";
import { useFriendList } from "@/api/friends/useFriendList";
import { useFriendRequests } from "@/api/friends/useFriendRequests";
import { useUserMe } from "@/api/users/useUserMe";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "@/api/users/userTypes";


export default function FriendButton({ user }: { user: User }) {
  const { data: me } = useUserMe();
  const { data: friendRequests } = useFriendRequests();
  const { data: friendList, refetch: refetchFriends } = useFriendList();
  const [incomingRequest, setIncomingRequest] = useState<any>(null);

  const sendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const unfriend = useUnfriend();

  const [friendStatus, setFriendStatus] = useState<"none" | "sent" | "received" | "friends">("none");

  useEffect(() => {
    if (!me || !user || !friendRequests || !friendList) return;

    // Already friends?
    const isFriend = friendList?.some((f: any) => f.id === user.id);
    if (isFriend) {
      setFriendStatus("friends");
      return;
    }
  
    const hasReceived = friendRequests.find(
      (req: any) => req?.sender?.id === user.id
    );
    
    if (hasReceived) {
      setFriendStatus("received");
      setIncomingRequest(hasReceived); 
      return;
    }
    
  
    // Did I send a request to this user?
    const hasSent = friendRequests.some(
      (req: any) => req?.receiver?.id === user.id
    );
    if (hasSent) {
      setFriendStatus("sent");
      return;
    }
  
    setFriendStatus("none");
  }, [friendRequests, friendList, me, user]);
  

  const handleSendRequest = () => {
    sendRequest.mutate(user.id, {
      onSuccess: () => setFriendStatus("sent"),
    });
  };

  const handleAcceptRequest = () => {
    if (!incomingRequest) return;
  
    acceptRequest.mutate(incomingRequest.id, {
      onSuccess: () => {
        setFriendStatus("friends");
        refetchFriends();
      },
    });
  };
  
  const handleUnfriend = () => {
    unfriend.mutate(user.id, {
      onSuccess: () => {
        setFriendStatus("none");
        refetchFriends();
      },
    });
  };

  if (!me || me.id === user.id) return null;

  switch (friendStatus) {
    case "friends":
      return (
        <Button variant="outline" onClick={handleUnfriend}>
          Unfriend
        </Button>
      );
    case "sent":
      return <Button disabled>Pending Request</Button>;
    case "received":
      return (
        <Button onClick={handleAcceptRequest}>
          Accept
        </Button>
      );
    default:
      return <Button onClick={handleSendRequest}>Add Friend</Button>;
  }
}


