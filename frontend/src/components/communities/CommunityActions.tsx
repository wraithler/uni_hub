import { Community } from "@/api/communities/communityTypes";
import { MessageSquare, MoreHorizontal, Settings, Users } from "lucide-react";
import CommunityJoinButton from "@/components/communities/buttons/CommunityJoinButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Link } from "react-router-dom";

export default function CommunityActions({
  community,
}: {
  community: Community;
}) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{community.member_count} members</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>{community.post_count} posts</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CommunityJoinButton community={community} />
        {(community.is_admin || community.is_moderator) && (
          <Link to={`/communities/${community.id}/dashboard`}>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report Community</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
