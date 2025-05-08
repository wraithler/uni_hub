import { z } from "zod";
import { usePostCreate } from "@/api/posts/usePostCreate.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, PenSquare } from "lucide-react";
import CommunitiesCombobox from "@/components/communities/CommunitiesCombobox.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useState } from "react";
import { useAuth } from "@/components/auth/SessionAuthProvider";
import FileUpload from "@/components/files/FileUpload.tsx";
import { toast } from "sonner";
import axios from "axios";
import PostCarousel from "@/components/posts/PostCarousel.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

const Schema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must contain 10 or more characters" }),
  community_id: z.number(),
  media: z.array(z.number()).optional(),
  privacy: z.string(),
});

export default function PostCreateForm() {
  const { mutate, error } = usePostCreate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [urls, setUrls] = useState<string[]>([]);

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });

  const onSubmit = (data: z.infer<typeof Schema>) => {
    setIsLoading(true);
    mutate(data);

    if (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.extra?.reason) {
          if (error.response.data.extra.reason === "spam") {
            toast.error(
              "Your post was flagged to be potential spam. If you think this is a mistake, contact support.",
            );
            setIsLoading(false);
            return;
          } else if (error.response.data.extra.reason === "suspended") {
            toast.error(
              "You have been suspended from posting in this community. If you think this is a mistake, contact support.",
            );
            setIsLoading(false);
            return;
          }
        }
      }
      toast.error(
        "An error occurred while creating your post. Please try again.",
      );
    } else {
      form.reset({ content: "" });
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>
                  {nameToAvatarFallback(
                    `${user?.first_name} ${user?.last_name}`,
                  )}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Share something with your communities..."
                        className="bg-slate-100 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <PostCarousel imageUrls={urls} />

            <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t justify-between">
              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        value={field.value || []}
                        onChange={field.onChange}
                        setUrls={setUrls}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select {...field} value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-[250px] mb-0">
                            <SelectValue placeholder="Select post privacy"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="members">
                              Mutual Community Members Only
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="community_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CommunitiesCombobox
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      Post
                      <PenSquare className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
