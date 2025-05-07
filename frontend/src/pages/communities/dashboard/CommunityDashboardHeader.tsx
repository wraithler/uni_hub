import { Community } from "@/api/communities/communityTypes";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import categoryConfig from "@/components/communities/CommunityStyling.tsx";
import {nameToAvatarFallback} from "@/lib/utils.ts";

export default function CommunityDashboardHeader({
  community,
}: {
  community: Community;
}) {
  return (
    <div className="bg-white border-b">
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={community.avatar_url || "/placeholder.svg"}
                alt={community.name}
              />
              <AvatarFallback className={`${categoryConfig[community.category].avatarBg} text-white text-xl`}>
                {nameToAvatarFallback(community.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{community.name}</h1>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Admin Dashboard
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Manage your community, members, and content
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
