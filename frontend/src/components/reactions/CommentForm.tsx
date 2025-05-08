import React, { useState } from "react";
import { useCommentCreate } from "@/api/reactions/useReactionCreate";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { nameToAvatarFallback } from "@/lib/utils";
import { useAuth } from "@/components/auth/SessionAuthProvider.tsx";

type CommentFormProps = {
  postId: number;
  variant?: "compact" | "expanded";
  onCommentAdded?: () => void;
};

export default function CommentForm({
  postId,
  variant = "compact",
  onCommentAdded,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const createComment = useCommentCreate();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    createComment.mutate(
      {
        content: content.trim(),
        post_id: postId,
      },
      {
        onSuccess: () => {
          setContent("");
          if (onCommentAdded) {
            onCommentAdded();
          }
        },
      },
    );
  };

  const isCompact = variant === "compact";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-start gap-2 ${isCompact ? "mt-2" : "mt-4"}`}
    >
      <Avatar
        className={`${isCompact ? "w-8 h-8" : "w-10 h-10"} hidden sm:block`}
      >
        <AvatarFallback>
          {user
            ? nameToAvatarFallback(`${user.first_name} ${user.last_name}`)
            : "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 relative">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={createComment.isPending}
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          disabled={!content.trim() || createComment.isPending}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:bg-transparent p-1"
        >
          Post
        </Button>
      </div>
    </form>
  );
}
