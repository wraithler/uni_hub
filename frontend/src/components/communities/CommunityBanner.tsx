import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import categoryConfig from "@/components/communities/CommunityStyling.tsx";
import { Community } from "@/api/communities/communityTypes.ts";

export default function CommunityBanner({
  community,
}: {
  community: Community;
}) {
  const config = categoryConfig[community.category];
  return (
    <div
      className={`relative h-48 md:h-64 bg-gradient-to-r ${config.bannerGradient}`}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        {config.icon}
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <div className="container px-4 mx-auto">
          <div className="relative -bottom-12 md:-bottom-8 flex flex-col md:flex-row gap-4 items-start">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
              <AvatarImage src="/placeholder.svg" alt={community.name} />
              <AvatarFallback
                className={`${config.avatarBg} text-white text-2xl`}
              >
                {nameToAvatarFallback(community.name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block pt-4">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">
                {community.category}
              </Badge>
              <h1 className="text-3xl font-bold text-white drop-shadow-md">
                {community.name}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
