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
import PostActions from "@/components/posts/PostActions.tsx";
import PostCarousel from "@/components/posts/PostCarousel.tsx";

export default function PostListCard({
  post,
  showCommunity,
}: {
  post: Post;
  showCommunity?: boolean;
}) {
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
          <div className="flex justify-between w-full">
            <div>
              <span className="font-medium">
                {post.created_by?.first_name} {post.created_by?.last_name}
                {showCommunity && post.community && (
                  <span className="text-sm text-muted-foreground font-normal">
                    {" "}
                    in {post.community.name}
                  </span>
                )}
              </span>
              <p className="text-xs text-muted-foreground">
                {timeAgo(post.created_at as string)}
              </p>
            </div>
            <PostActions post={post} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {post.content}
        <PostCarousel imageUrls={post.image_urls || []} />
      </CardContent>
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
