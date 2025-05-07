import React, { useState } from "react";
import { Post } from "@/api/posts/postTypes.ts";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AvatarFallback } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Flag, MoreVertical } from "lucide-react";
import { nameToAvatarFallback, timeAgo } from "@/lib/utils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InlineReportForm } from "@/components/report/InlineReportForm";

export default function PostGridCard({ post }: { post: Post }) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);

  const handleConfirmReport = () => {
    setIsConfirmDialogOpen(false);
    setIsReportFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback>
              {nameToAvatarFallback(
                `${post.created_by?.first_name} ${post.created_by?.last_name}`,
              )}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {post.created_by?.first_name} {post.created_by?.last_name}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {timeAgo(post.created_at as string)}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
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
        <CardDescription className="line-clamp-2">
          {post.content}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
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