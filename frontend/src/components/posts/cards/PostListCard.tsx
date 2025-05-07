import React, { useState } from "react";
import { Post } from "@/api/posts/postTypes.ts";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
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
import { InlineReportForm } from "../../../components/report/InlineReportForm";

export default function PostListCard({ post }: { post: Post }) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);

  const handleConfirmReport = () => {
    setIsConfirmDialogOpen(false);
    setIsReportFormOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>
              {nameToAvatarFallback(
                `${post.created_by?.first_name} ${post.created_by?.last_name}`,
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {post.created_by?.first_name} {post.created_by?.last_name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 ml-auto">
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
            <p className="text-xs text-muted-foreground">{timeAgo(post.created_at as string)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>{post.content}</CardContent>
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