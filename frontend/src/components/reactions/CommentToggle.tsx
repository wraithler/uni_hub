import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CommentSection from "@/components/reactions/commentSection";

type CommentToggleProps = {
  postId: number;
  commentCount: number;
  size?: "sm" | "md";
};

export default function CommentToggle({
  postId,
  commentCount,
  size = "md"
}: CommentToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(commentCount);

  const toggleComments = () => {
    setIsOpen(prev => !prev);
  };

  const handleCommentAdded = () => {
    setLocalCommentCount(prev => prev + 1);
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonSize = size === "sm" ? "h-8 px-2" : "h-9 px-3";

  return (
    <div className="flex flex-col">
      <Button
        onClick={toggleComments}
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-1", 
          buttonSize,
          "text-muted-foreground"
        )}
        aria-label={isOpen ? "Hide comments" : "Show comments"}
      >
        <MessageSquare className={iconSize} />
        <span>{localCommentCount}</span>
      </Button>
      
      {isOpen && (
        <div className="mt-2">
          <CommentSection postId={postId} onCommentAdded={handleCommentAdded} />
        </div>
      )}
    </div>
  );
}