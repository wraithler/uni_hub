import { useS3DirectUpload } from "@/api/files/useS3DirectUpload.ts";
import { Input } from "@/components/ui/input.tsx";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FileUploadProps = {
  value: number[];
  onChange: (value: number[]) => void;
  setUrls: (value: (prevUrls: string[]) => string[]) => void;
};

export default function FileUpload({ onChange, setUrls }: FileUploadProps) {
  const { upload, uploading, error } = useS3DirectUpload();
  const [fileIds, setFileIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFileIds: number[] = [];


    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const { fileId, url } = await upload(file);
        newFileIds.push(fileId);
        // todo: handle url
        setUrls((prevUrls) => [...prevUrls, url]);
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
            Add media
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
