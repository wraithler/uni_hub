import { Post } from "@/api/posts/postTypes.ts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { MessageSquare } from "lucide-react";
import LikeButton from "@/components/reactions/LikeButton.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import CommentSection from "@/components/reactions/CommentSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { nameToAvatarFallback } from "@/lib/utils";

type PostPinnedCardProps = {
  post: Post;
  onReadMore?: () => void;
};

export default function PostPinnedCard({ post, onReadMore }: PostPinnedCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);

  const formattedDate = post.created_at || "3h ago";

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  return (
    <>
      <Card className="mb-6 border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-blue-500 border-blue-500">
              Pinned
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {post.content}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-4">
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
            onClick={onReadMore}
          >
            Read More
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {post.created_by && (
                  <>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {nameToAvatarFallback(
                          `${post.created_by.first_name} ${post.created_by.last_name}`
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {post.created_by.first_name} {post.created_by.last_name}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                Pinned
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {formattedDate}
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