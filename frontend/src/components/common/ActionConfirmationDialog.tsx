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
};

export default function ActionConfirmationDialog({
  title,
  description,
  body,
  button,
  trigger,
  open,
}: ActionConfirmationDialogProps) {
  return (
    <Dialog open={open}>
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
