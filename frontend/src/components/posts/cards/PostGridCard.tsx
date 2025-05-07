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
import { MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import CommentSection from "@/components/reactions/CommentSection";

type PostGridCardProps = {
  post: Post;
  onView?: () => void;
};

export default function PostGridCard({ post, onView }: PostGridCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);
  
  // Use static "3h ago" for now until date-fns is installed
  const timeAgo = "3h ago";

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  return (
    <>
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
            <Button
              onClick={() => setCommentsOpen(true)}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 h-8 px-2 text-muted-foreground"
              aria-label="Show comments"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{commentCount}</span>
            </Button>
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

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {nameToAvatarFallback(
                    `${post.created_by?.first_name} ${post.created_by?.last_name}`,
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">
                  {post.created_by?.first_name} {post.created_by?.last_name}
                </div>
                <div className="text-xs text-muted-foreground">{timeAgo}</div>
              </div>
            </div>
            <p className="text-sm mb-4">{post.content}</p>
            <div className="border-t pt-4">
              <CommentSection 
                postId={post.id || 0} 
                onCommentAdded={handleCommentAdded} 
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}