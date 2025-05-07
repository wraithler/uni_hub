import React, { useState } from "react";
import { Post } from "@/api/posts/postTypes.ts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Heart, MessageSquare, Flag, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InlineReportForm } from "../../../components/report/InlineReportForm";
import { timeAgo } from "@/lib/utils.ts";

export default function PostPinnedCard({ post }: { post: Post }) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);

  const handleConfirmReport = () => {
    setIsConfirmDialogOpen(false);
    setIsReportFormOpen(true);
  };

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-500 border-blue-500">
              Pinned
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {typeof post.created_at === 'string' ? timeAgo(post.created_at) : post.created_at}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsConfirmDialogOpen(true);
                  }}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Report Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {post.content}
        </p>
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
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8 px-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comment_count}</span>
          </Button>
        </div>
      </CardFooter>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Are you sure you want to report this post?</p>
            <p className="text-sm text-muted-foreground mb-6 border p-3 rounded-md bg-muted">
              {post.content}
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmReport}>
                Continue to Report Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReportFormOpen} onOpenChange={setIsReportFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
          </DialogHeader>
          <InlineReportForm 
            post={post} 
            onComplete={() => setIsReportFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}