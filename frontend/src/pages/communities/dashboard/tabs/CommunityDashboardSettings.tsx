import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Community } from "@/api/communities/communityTypes.ts";
import { useCommunityUpdate } from "@/api/communities/useCommunityUpdate.ts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Globe, Lock, Users } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import ActionConfirmationDialog from "@/components/common/ActionConfirmationDialog.tsx";
import { useCommunityDelete } from "@/api/communities/useCommunityDelete.ts";

const Schema = z.object({
  name: z.string().min(5),
  description: z.string().min(5).max(50),
  about: z.string().min(5).max(500),
  privacy: z.string(),
  contact_email: z.string().email(),
});

export default function CommunityDashboardSettings({
  community,
}: {
  community: Community;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate, error } = useCommunityUpdate();
  const { mutate: deleteMutate } = useCommunityDelete();

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: community.name,
      description: community.description,
      about: community.about,
      privacy: community.privacy,
      contact_email: community.contact_email,
    },
  });

  const onSubmit = async (data: z.infer<typeof Schema>) => {
    setIsLoading(true);
    mutate(data);

    if (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          "Something went wrong when trying to update your community, please try again later",
        );
      }
    } else {
      toast.success("Community updated successfully.");
    }

    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Community Settings */}
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Community Settings</CardTitle>
              <CardDescription>
                Configure your community preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">General Settings</h3>
                <Separator />
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <Label htmlFor="community-name" className="font-medium">
                        Community Name
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        The name of your community
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className="min-w-[360px]">
                            <Input placeholder="Community Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <Label
                        htmlFor="community-description"
                        className="font-medium"
                      >
                        Description
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Describe briefly what your community is about
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              className="min-w-[360px] min-h-[160px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <Label
                        htmlFor="community-category"
                        className="font-medium"
                      >
                        About
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Provide more information about your community
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className="min-w-[360px] min-h-[160px]">
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <Label
                        htmlFor="community-category"
                        className="font-medium"
                      >
                        Contact Email
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Provide a way for users to get in contact with you
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem className="min-w-[360px]">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Privacy & Permissions</h3>
                <Separator />
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">
                        Community Visibility
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Control who can see your community
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="privacy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Privacy Settings</FormLabel>
                          <FormControl>
                            <RadioGroup
                              {...field}
                              value={form.getValues("privacy")}
                              onValueChange={(v) => form.setValue("privacy", v)}
                            >
                              <div className="flex items-start space-x-2 mb-3">
                                <RadioGroupItem value="public" id="public" />
                                <div className="grid gap-1">
                                  <Label
                                    htmlFor="public"
                                    className="flex items-center gap-2"
                                  >
                                    <Globe className="h-4 w-4" />
                                    Public
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    Anyone at the university can see and join
                                    your community.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2 mb-3">
                                <RadioGroupItem
                                  value="restricted"
                                  id="restricted"
                                />
                                <div className="grid gap-1">
                                  <Label
                                    htmlFor="restricted"
                                    className="flex items-center gap-2"
                                  >
                                    <Users className="h-4 w-4" />
                                    Restricted
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    Anyone can see the community, but members
                                    must be approved.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <RadioGroupItem value="private" id="private" />
                                <div className="grid gap-1">
                                  <Label
                                    htmlFor="private"
                                    className="flex items-center gap-2"
                                  >
                                    <Lock className="h-4 w-4" />
                                    Private
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    Only invited members can see and join your
                                    community.
                                  </p>
                                </div>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t p-6">
              <Button variant="outline">Cancel</Button>
              <Button>{isLoading ? "Saving..." : "Save Changes"}</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader className="text-red-800">
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription className="text-red-700">
            Actions that can't be undone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-red-800">Delete Community</h3>
                <p className="text-sm text-red-700">
                  This action cannot be undone. All content will be permanently
                  deleted.
                </p>
              </div>
              <ActionConfirmationDialog
                title="Are you sure?"
                description="Deleting this community is irreversible!"
                button={
                  <Button
                    variant="destructive"
                    className="text-accent"
                    onClick={() => deleteMutate(Number(community.id))}
                  >
                    Delete Community
                  </Button>
                }
                trigger={
                  <Button
                    variant="destructive"
                    className="text-accent"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Community
                  </Button>
                }
                open={showDeleteDialog}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
