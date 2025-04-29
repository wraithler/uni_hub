import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { Badge } from "../ui/badge.tsx";
import { MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Community } from "@/api/communities/communityTypes.ts";
import categoryConfig from "./CommunityStyling.tsx";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  const config = categoryConfig[community.category];

  return (
    <Card key={community.id} className="overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={community.avatar_url} alt={community.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {nameToAvatarFallback(community.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-base">{community.name}</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1 w-fit">
              {config.badgeIcon}
              <span className="capitalize">{community.category}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {community.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {community.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center text-xs text-muted-foreground mt-auto">
          <User className="w-3 h-3 mr-1" />
          <span>{community.member_count}</span>
          <span className="mx-1">•</span>
          <MessageSquare className="w-3 h-3 mr-1" />
          <span>{community.post_count}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <Button variant="outline" size="sm" className="w-full">
          View Community
        </Button>
      </CardFooter>
    </Card>
  );
}
