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
      <DialogContent className="flex flex-col min-w-[56rem]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>Create a post in one of your communities</DialogDescription>
        </DialogHeader>
        <PostCreateForm/>
      </DialogContent>
    </Dialog>
  );
}
