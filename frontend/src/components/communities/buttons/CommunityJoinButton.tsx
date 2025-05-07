import { Community } from "@/api/communities/communityTypes.ts";
import { Button } from "@/components/ui/button.tsx";
import { useCommunityJoin } from "@/api/communities/useCommunityJoin.ts";
import { useCommunityLeave } from "@/api/communities/useCommunityLeave.ts";
import { CircleDot, LogIn, LogOut } from "lucide-react";
import { useCommunityRequestJoin } from "@/api/communities/useCommunityRequestJoin.ts";

export default function CommunityJoinButton({
  community,
}: {
  community: Community;
}) {
  const joinCommunity = useCommunityJoin();
  const leaveCommunity = useCommunityLeave();
  const requestJoinCommunity = useCommunityRequestJoin();

  if (community.is_member) {
    return (
      <Button
        variant="destructive"
        className="text-accent"
        onClick={() => leaveCommunity.mutate(community)}
      >
        <LogOut />
        Leave
      </Button>
    );
  }

  if (community.privacy === "restricted") {
    if (community.has_requested_to_join) {
      return (
        <Button onClick={() => requestJoinCommunity.mutate(community)}>
          <CircleDot />
          Request pending
        </Button>
      );
    }

    return (
      <Button onClick={() => requestJoinCommunity.mutate(community)}>
        <LogIn />
        Request to join
      </Button>
    );
  }

  return (
    <Button onClick={() => joinCommunity.mutate(community)}>
      <LogIn />
      Join
    </Button>
  );
}
