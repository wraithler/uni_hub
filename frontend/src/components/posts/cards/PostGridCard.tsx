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
import { nameToAvatarFallback } from "@/lib/utils.ts";
import LikeButton from "@/components/reactions/likeButton";
import CommentToggle from "@/components/reactions/CommentToggle.tsx";

type PostGridCardProps = {
  post: Post;
  onView?: () => void;
};

export default function PostGridCard({ post, onView }: PostGridCardProps) {
  // Use static "3h ago" for now until date-fns is installed
  const timeAgo = "3h ago";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback>
              {nameToAvatarFallback(
                `${post.created_by?.first_name} ${post.created_by?.last_name}`,
              )}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {post.created_by?.first_name} {post.created_by?.last_name}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">{timeAgo}</span>
        </div>
        <CardDescription className="line-clamp-2">
          {post.content}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <LikeButton
            contentType="post"
            objectId={post.id || 0}
            initialLiked={post.has_liked}
            initialCount={post.like_count || 0}
            showCount={true}
            size="sm"
          />
          <CommentToggle
            postId={post.id || 0}
            commentCount={post.comment_count || 0}
            size="sm"
          />
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onView}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}