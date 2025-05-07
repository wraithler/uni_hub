import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "../ui/button";
import PostCreateForm from "@/components/posts/PostCreateForm.tsx";

export default function PostCreateDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="w-[800px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>Create a post in one of your communities</DialogDescription>
        </DialogHeader>
        <PostCreateForm/>
      </DialogContent>
    </Dialog>
  );
}
