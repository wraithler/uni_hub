import { Post } from "@/api/posts/postTypes.ts";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AvatarFallback } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { nameToAvatarFallback } from "@/lib/utils.ts";

export default function PostGridCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback>
              {nameToAvatarFallback(
                `${post.created_by.first_name} ${post.created_by.last_name}`,
              )}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {post.created_by.first_name} {post.created_by.last_name}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">3h ago</span>
        </div>
        <CardDescription className="line-clamp-2">
          {post.content}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8 px-2"
          >
            <Heart className="w-4 h-4" />
            <span>{post.like_count}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8 px-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comment_count}</span>
          </Button>
        </div>
        <Button size="sm" variant="outline">
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
