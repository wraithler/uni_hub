import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";

type ActionConfirmationDialogProps = {
  title: string;
  description: string;
  body?: React.ReactNode;
  button: React.ReactNode;
  trigger: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ActionConfirmationDialog({
  title,
  description,
  body,
  button,
  trigger,
  open,
  setOpen,
}: ActionConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {body && body}
        <DialogFooter>{button}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
