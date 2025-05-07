import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import CommentSection from "@/components/reactions/CommentSection.tsx";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Post } from "@/api/posts/postTypes.ts";

export default function CommentDialog({ post }: { post: Post }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-8 px-2 text-muted-foreground"
          aria-label="Show comments"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post.comment_count}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
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
              postId={Number(post.id)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
