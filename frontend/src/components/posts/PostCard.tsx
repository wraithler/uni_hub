import { FeedItem } from "@/hooks/useFeed.ts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Heart, MessageSquare } from "lucide-react";
import PostActions from "@/components/posts/PostActions.tsx";

export default function PostCard(item: FeedItem) {
  return (
    <Card key={item.id}>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                {`${item.created_by.first_name} ${item.created_by.last_name}`.substring(
                  0,
                  2,
                )}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {item.created_by.first_name} {item.created_by.last_name}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">In</span>
                <span className="font-medium">{item.community.name}</span>
              </div>
            </div>
          </div>

          <PostActions post={item} />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-3">{item.content /* add images */}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 h-8 px-2}`}
          >
            <Heart className={`w-4 h-4`} />
            <span>{item.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8 px-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{item.comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          Comment
        </Button>
      </CardFooter>
    </Card>
  );
}
