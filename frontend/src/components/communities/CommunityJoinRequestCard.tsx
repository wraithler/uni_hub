import { CommunityJoinRequest } from "@/api/communities/communityTypes.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CheckCircle2, XCircle } from "lucide-react";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import useCommunityJoinRequestRespond from "@/api/communities/useCommunityJoinRequestRespond.ts";

export default function CommunityJoinRequestCard({
  joinRequest,
}: {
  joinRequest: CommunityJoinRequest;
}) {
  const respondToJoinRequest = useCommunityJoinRequestRespond();
  const fullName = `${joinRequest.user.first_name} ${joinRequest.user.last_name}`;
  return (
    <div
      key={joinRequest.user.id}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={joinRequest.user.avatar || "/placeholder.svg"}
            alt={joinRequest.user.first_name}
          />
          <AvatarFallback>{nameToAvatarFallback(fullName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{fullName}</p>
          <p className="text-sm text-muted-foreground">
            {joinRequest.user.academic_department}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
          onClick={() =>
            respondToJoinRequest.mutate({
              join_request_id: joinRequest.id,
              responseChoice: "accept",
            })
          }
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          onClick={() =>
            respondToJoinRequest.mutate({
              join_request_id: joinRequest.id,
              responseChoice: "reject",
            })
          }
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  );
}
