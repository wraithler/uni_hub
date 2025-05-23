import { Post } from "@/api/posts/postTypes.ts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Heart } from "lucide-react";
import CommentDialog from "@/components/reactions/CommentDialog.tsx";
import PostCarousel from "@/components/posts/PostCarousel.tsx";
import {timeAgo} from "@/lib/utils.ts";

export default function PostPinnedCard({ post }: { post: Post }) {
  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-blue-500 border-blue-500">
            Pinned
          </Badge>
          <span className="text-xs text-muted-foreground">
            {timeAgo(post.created_at as string)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{post.content}</p>
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
