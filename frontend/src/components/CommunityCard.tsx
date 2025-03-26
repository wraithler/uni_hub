import { badgeCategoryIcons, Community } from "@/api/types/communities.tsx";
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
import { Badge } from "./ui/badge";
import { MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({
  community: {
    id,
    name,
    description,
    category_name,
    avatar,
    post_count,
    member_count,
    tags,
  },
}: CommunityCardProps) {
  return (
    <Card key={id} className="overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {nameToAvatarFallback(name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-base">{name}</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1 w-fit">
              {badgeCategoryIcons[category_name]}
              <span className="capitalize">{category_name}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center text-xs text-muted-foreground">
          <User className="w-3 h-3 mr-1" />
          <span>{member_count}</span>
          <span className="mx-1">•</span>
          <MessageSquare className="w-3 h-3 mr-1" />
          <span>{post_count}</span>
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
