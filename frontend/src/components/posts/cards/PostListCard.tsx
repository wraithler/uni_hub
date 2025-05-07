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
import { Heart } from "lucide-react";
import { nameToAvatarFallback, timeAgo } from "@/lib/utils.ts";
import CommentDialog from "@/components/reactions/CommentDialog.tsx";

export default function PostListCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>
              {nameToAvatarFallback(
                `${post.created_by?.first_name} ${post.created_by?.last_name}`,
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">
              {post.created_by?.first_name} {post.created_by?.last_name}
            </span>
            <p className="text-xs text-muted-foreground">
              {timeAgo(post.created_at as string)}
            </p>
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
          <CommentDialog post={post} />
        </div>
      </CardFooter>
    </Card>
  );
}
