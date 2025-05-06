import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";
import { MessageSquare, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "../ui/button.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Link } from "react-router-dom";
import { Community } from "@/api/communities/communityTypes.ts";
import categoryConfig from "@/components/communities/CommunityStyling.tsx";

interface FeaturedCommunityCardProps {
  community: Community;
}

export default function FeaturedCommunityCard({
  community,
}: FeaturedCommunityCardProps) {
  const config = categoryConfig[community.category];

  return (
    <Card className="overflow-hidden flex flex-col">
      <div
        className={`relative h-32 bg-gradient-to-r ${config.bannerGradient}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {config.featuredIcon}
        </div>
        <div className="absolute -bottom-8 left-4">
          <Avatar className="w-16 h-16 border-4 border-white">
            <AvatarImage src={community.avatar_url} alt="Community" />
            <AvatarFallback className={`${config.avatarBg} text-white`}>
              {nameToAvatarFallback(community.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardHeader className="pt-10 flex-grow">
        <CardTitle>{community.name}</CardTitle>
        <CardDescription>{community.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {community.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-1" />
          <span>{community.member_count} members</span>
          <span className="mx-2">•</span>
          <MessageSquare className="w-4 h-4 mr-1" />
          <span>{community.post_count} posts</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full" asChild>
          <Link to={`/communities/${community.id}`}>View Community</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
