import { useState } from "react";
import { useLikeCreate } from "@/api/reactions/useReactionCreate";
import { useUnlikeContent } from "@/api/reactions/useReactionDelete";
import { useHasLiked } from "@/api/reactions/useReactionDetail";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  contentType: string;
  objectId: number;
  initialLiked?: boolean;
  initialCount?: number;
  showCount?: boolean;
  size?: "sm" | "md";
};

export default function LikeButton({
  contentType,
  objectId,
  initialLiked = false,
  initialCount = 0,
  showCount = false,
  size = "md"
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  
  const createLike = useLikeCreate();
  const unlikeContent = useUnlikeContent();

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikeContent.mutate(
        {
          contentType,
          objectId,
        },
        {
          onSuccess: () => {
            setLikeCount(prev => Math.max(0, prev - 1));
          },
          onError: (error) => {
            console.error("Error unliking:", error);
            setIsLiked(true); 
          }
        }
      );
      setIsLiked(false);
    } else {
      createLike.mutate(
        {
          content_type: contentType,
          object_id: objectId,
        },
        {
          onSuccess: () => {
            setLikeCount(prev => prev + 1);
          },
          onError: (error) => {
            console.error("Error liking:", error);
            setIsLiked(false); 
          }
        }
      );
      setIsLiked(true);
    }
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonSize = size === "sm" ? "h-8 px-2" : "h-9 px-3";

  return (
    <Button
      onClick={handleLikeToggle}
      variant="ghost"
      size="sm"
      disabled={createLike.isPending || unlikeContent.isPending}
      className={cn(
        "flex items-center gap-1", 
        buttonSize,
        isLiked ? "text-red-500" : "text-muted-foreground"
      )}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <Heart className={cn(iconSize, isLiked ? "fill-current" : "")} />
      {showCount && <span>{likeCount}</span>}
    </Button>
  );
}