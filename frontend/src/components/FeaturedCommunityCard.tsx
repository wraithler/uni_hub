import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MessageSquare, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "./ui/button";
import {
  avatarColours,
  bannerCategoryIcons,
  bannerColours,
  Community,
} from "@/api/types/communities.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import {Badge} from "@/components/ui/badge.tsx";

interface FeaturedCommunityCardProps {
  community: Community;
}

export default function FeaturedCommunityCard({
  community: {
    name,
    category_name,
    avatar,
    description,
    member_count,
    post_count,
    is_member,
    tags,
  },
}: FeaturedCommunityCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col overflow-hidden">
      <div
        className={`relative h-32 bg-gradient-to-r ${bannerColours[category_name]}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {bannerCategoryIcons[category_name]}
        </div>
        <div className="absolute -bottom-8 left-4">
          <Avatar className="w-16 h-16 border-4 border-white">
            <AvatarImage src={avatar} alt="Community" />
            <AvatarFallback
              className={`${avatarColours[category_name]} text-white`}
            >
              {nameToAvatarFallback(name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardHeader className="pt-10 flex-grow">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-1"/>
          <span>{member_count} members</span>
          <span className="mx-2">•</span>
          <MessageSquare className="w-4 h-4 mr-1"/>
          <span>{post_count} posts</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full">
          {is_member ? "View Community" : "Join Community"}
        </Button>
      </CardFooter>
    </Card>
  );
}
