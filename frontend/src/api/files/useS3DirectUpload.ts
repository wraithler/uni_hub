import { useState } from "react";
import api from "@/api/apiClient.ts";

type UploadResult = {
  fileId: string;
  url: string;
};

export function useS3DirectUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const upload = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setError(null);

    try {
      const presigned = await api.post("/files/upload/direct/start/", {
        file_name: file.name,
        file_type: file.type,
      });

      const { url, fields, id: file_id } = presigned.data;

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      const s3Response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!s3Response.ok) {
        throw new Error("Upload to S3 failed!");
      }

      await api.post("/files/upload/direct/finish/", {
        file_id,
      });

      return { fileId: file_id, url: `${url}/${fields.key}` };
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
