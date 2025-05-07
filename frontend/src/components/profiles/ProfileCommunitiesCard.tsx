import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Users } from "lucide-react";
import categoryConfig from "@/components/communities/CommunityStyling.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { User } from "@/api/users/userTypes.ts";
import { useCommunities } from "@/api/communities/useCommunities.ts";
import { Community } from "@/api/communities/communityTypes.ts";
import { useNavigate } from "react-router-dom";

export default function ProfileCommunitiesCard({ user }: { user: User }) {
  const { data: userCommunities } = useCommunities({ user_id: user.id });
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Communities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userCommunities &&
          userCommunities.results
            .slice(0, 3)
            .map((community: Community, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/communities/${community.id}`)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={community.avatar_url}
                    alt={community.name}
                  />
                  <AvatarFallback
                    className={`${categoryConfig[community.category as string].avatarBg} text-white`}
                  >
                    {nameToAvatarFallback(community.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h4 className="font-medium text-sm">{community.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{community.member_count} members</span>
                  </div>
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
