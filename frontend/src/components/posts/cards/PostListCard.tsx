import { Post } from "@/api/posts/postTypes.ts";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AvatarFallback } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { nameToAvatarFallback } from "@/lib/utils.ts";

export default function PostListCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>
              {nameToAvatarFallback(
                `${post.created_by.first_name} ${post.created_by.last_name}`,
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">
              {post.created_by.first_name} {post.created_by.last_name}
            </span>
            <p className="text-xs text-muted-foreground">3h ago</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>{post.content}</CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
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
        <Button size="sm">View Post</Button>
      </CardFooter>
    </Card>
  );
}
