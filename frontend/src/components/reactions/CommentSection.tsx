import { Comment } from "@/api/reactions/reactionTypes";
import { useCommentsPaginated } from "@/api/reactions/useReactionsPaginated";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {nameToAvatarFallback, timeAgo} from "@/lib/utils";
import CommentForm from "@/components/reactions/CommentForm.tsx";

type CommentSectionProps = {
  postId: number;
  onCommentAdded?: () => void;
};

export default function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
  const {
    data,
    isLoading,
    pagination,
    refetch
  } = useCommentsPaginated({
    post_id: postId, 
    limit: 5,
    sort_by: "newest",
  });

  const handleCommentAdded = () => {
    refetch();
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  return (
    <div className="mt-3 border-t pt-3">
      <CommentForm postId={postId} variant="compact" onCommentAdded={handleCommentAdded} />
      
      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground py-3">Loading comments...</div>
      ) : data?.results?.length > 0 ? (
        <div className="mt-3 space-y-3">
          {data.results.map((comment: Comment) => (
            <div key={comment.id} className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {nameToAvatarFallback(
                    `${comment.created_by?.first_name} ${comment.created_by?.last_name}`
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-2">
                  <div className="font-medium text-sm">
                    {comment.created_by?.first_name} {comment.created_by?.last_name}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  {comment.created_at && (
                      <span>{timeAgo(comment.created_at)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {pagination && pagination.hasNextPage && (
            <Button 
              onClick={() => pagination.nextPage()}
              variant="ghost"
              size="sm"
              className="text-sm text-blue-500 hover:text-blue-700 mt-2"
            >
              View more comments
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground py-3">No comments yet. Be the first!</div>
      )}
    </div>
  );
}