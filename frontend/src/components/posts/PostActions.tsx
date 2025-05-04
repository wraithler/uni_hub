import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash2, MessageCircleWarning, MoreHorizontal } from "lucide-react";
import ActionConfirmationDialog from "@/components/common/ActionConfirmationDialog";
import { usePostDelete } from "@/api/posts/usePostDelete";
import { Post } from "@/api/posts/postTypes.ts";
import { useAuth } from "@/components/auth/SessionAuthProvider";
import { FeedItem } from "@/api/feed/feedTypes.ts";

type PostActionsProps = {
  post: Post | FeedItem;
};

export default function PostActions({ post }: PostActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deletePost = usePostDelete();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    if (!post.id) return;

    try {
      deletePost.mutate(post.id);
      // redirect, toast, or callback here
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <MessageCircleWarning className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
          {post.created_by && post.created_by.id === user?.id && (
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showDeleteDialog && (
        <ActionConfirmationDialog
          title="Are you sure you want to delete this post?"
          description="This action is irreversible."
          trigger={<></>}
          open={showDeleteDialog}
          button={
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-white"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          }
        />
      )}
    </>
  );
}
