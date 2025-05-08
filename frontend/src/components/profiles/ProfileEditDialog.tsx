import { User } from "@/api/users/userTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserUpdate } from "@/api/users/useUserUpdate.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Plus, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";

const Schema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  bio: z.string(),
  academic_department: z.string(),
  contact_email: z.string(),
  contact_phone: z.string(),
  interests: z.array(z.string()),
  contact_detail_privacy: z.string(),
  dob: z.string(),
  address: z.string(),
  post_code: z.string(),
  country: z.string(),
});

export default function ProfileEditDialog({ user }: { user: User }) {
  const { mutate, error } = useUserUpdate();
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      bio: user.bio,
      academic_department: user.academic_department,
      contact_email: user.contact_email,
      contact_phone: user.contact_phone,
      interests: user.interests,
      contact_detail_privacy: user.contact_detail_privacy,
      dob: user.dob,
      address: user.address,
      post_code: user.post_code,
      country: user.country,
    },
  });
  const [interestInputValue, setInterestInputValue] = useState("");

  const addInterest = () => {
    if (interestInputValue.trim() === "") return;

    form.setValue("interests", [
      ...form.getValues("interests"),
      interestInputValue,
    ]);
    setInterestInputValue("");
  };

  const handleInterestKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addInterest();
    }
  };

  const removeInterest = (interestToRemove: string) => {
    form.setValue(
      "interests",
      form
        .getValues("interests")
        .filter((interest) => interest !== interestToRemove),
    );
  };

  const handleInterestInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInterestInputValue(event.target.value);
  };

  const handleSubmit = (data: z.infer<typeof Schema>) => {
    mutate({
      id: user.id,
      ...data,
      interests: data.interests.filter((interest) => interest !== ""),
    });

    if (!error) {
      window.location.reload(); // hack because the user object is not updated in the context as it's in the auth provider
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Edit your profile</DialogHeader>
        <DialogDescription>
          Ensure your details are kept up to date!
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="post_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="academic_department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_detail_privacy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Info Privacy Settings</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                        <SelectItem value="MEMBERS">
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
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        onKeyDown={handleInterestKeyDown}
                        onChange={handleInterestInputChange}
                        value={interestInputValue}
                      />
                      <Button type="button" onClick={addInterest} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.getValues("interests").map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 py-1"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="ml-1 rounded-full hover:bg-slate-300 p-0.5"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {interest}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
