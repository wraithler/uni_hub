import { useS3DirectUpload } from "@/api/files/useS3DirectUpload.ts";
import { Input } from "@/components/ui/input.tsx";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FileUploadProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export default function FileUpload({ onChange }: FileUploadProps) {
  const { upload, uploading, error } = useS3DirectUpload();
  const [fileIds, setFileIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFileIds: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const { fileId } = await upload(file);
        newFileIds.push(fileId);
      } catch (err) {
        console.log(err); // todo: handle
      }
    }

    setFileIds((prevIds) => [...prevIds, ...newFileIds]);
    onChange(fileIds);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        // className="flex-1"
        type="button"
        onClick={handleButtonClick}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4 mr-2" />
            Media
            <Input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleChange}
            />
          </>
        )}
      </Button>
      {error && toast.error("Failed to upload images")}
    </>
  );
}
