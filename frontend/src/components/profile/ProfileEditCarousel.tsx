import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProfileFormData } from "@/types/profile.types";
import { useProfileChoices } from "@/api/profile";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "@/api/apiClient";

const BasicInfoSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  gender: z.string().optional(),
  hobbies: z.string().optional(),
  year_of_study: z.string().optional(),
  course: z.string().optional(),
  phone_number: z.string().optional(),
  student_number: z.string().optional(),
});

const SocialLinksSchema = z.object({
  email: z.string().email().optional(),
  github_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
});

const formSchema = z.object({
  basicInfo: BasicInfoSchema,
  socialLinks: SocialLinksSchema,
});

export default function ProfileEditForm({
  initialValues,
  onSaved,
  avatarBgColor,
  bannerStartColor,
  bannerEndColor,
  onAvatarBgColorChange,
  onBannerStartColorChange,
  onBannerEndColorChange,
}: {
  initialValues: ProfileFormData;
  onSaved: (newProfile: ProfileFormData) => void;
  avatarBgColor: string;
  bannerStartColor: string;
  bannerEndColor: string;
  onAvatarBgColorChange?: (color: string) => void;
  onBannerStartColorChange?: (color: string) => void;
  onBannerEndColorChange?: (color: string) => void;
}) {
  const { data: profileChoices } = useProfileChoices();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicInfo: {
        first_name: initialValues.first_name ?? "",
        last_name: initialValues.last_name ?? "",
        gender: initialValues.gender ?? "",
        hobbies: initialValues.hobbies ?? "",
        year_of_study: initialValues.year_of_study ?? "",
        course: initialValues.course ?? "",
        phone_number: initialValues.phone_number ?? "",
        student_number: initialValues.student_number ?? "",
      },
      socialLinks: {
        email: initialValues.email ?? "",
        github_url: initialValues.github_url ?? "",
        linkedin_url: initialValues.linkedin_url ?? "",
      },
    },
  });

  useEffect(() => {
    form.reset({
      basicInfo: {
        first_name: initialValues.first_name ?? "",
        last_name: initialValues.last_name ?? "",
        gender: initialValues.gender ?? "",
        hobbies: initialValues.hobbies ?? "",
        year_of_study: initialValues.year_of_study ?? "",
        course: initialValues.course ?? "",
        phone_number: initialValues.phone_number ?? "",
        student_number: initialValues.student_number ?? "",
      },
      socialLinks: {
        email: initialValues.email ?? "",
        github_url: initialValues.github_url ?? "",
        linkedin_url: initialValues.linkedin_url ?? "",
      },
    });
  }, [initialValues, form]);

  const handleSave = form.handleSubmit(async (data) => {
     const { first_name: _fn, last_name: _ln, ...basicFields } = data.basicInfo;

    const payload: any = {
      ...basicFields,
      ...data.socialLinks,
      avatar_bg_color: avatarBgColor,
      banner_start_color: bannerStartColor,
      banner_end_color: bannerEndColor,
    };

    try {
      const res = await api.patch(`/profile/${initialValues.id}/`, payload);
      onSaved(res.data);
      window.location.reload();
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSave}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          {/* Basic Info */}
          <FormField control={form.control} name="basicInfo.first_name" render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="basicInfo.last_name" render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />


          <FormField control={form.control} name="basicInfo.gender" render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  {profileChoices?.gender_choices && Object.entries(profileChoices.gender_choices).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="basicInfo.hobbies" render={({ field }) => (
            <FormItem>
              <FormLabel>Hobbies</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select hobbies" /></SelectTrigger>
                <SelectContent>
                  {profileChoices?.hobby_choices && Object.entries(profileChoices.hobby_choices).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="basicInfo.year_of_study" render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Study</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  {profileChoices?.year_choices && Object.entries(profileChoices.year_choices).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="basicInfo.course" render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  {profileChoices?.course_choices && Object.entries(profileChoices.course_choices).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="basicInfo.phone_number" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="basicInfo.student_number" render={({ field }) => (
            <FormItem>
              <FormLabel>Student Number</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </CardContent>

        <CardContent className="grid grid-cols-2 gap-4">
          {/* Social Links */}
          <FormField control={form.control} name="socialLinks.email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="socialLinks.github_url" render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="socialLinks.linkedin_url" render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </CardContent>

        <CardContent>
          {/* Color Pickers */}
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <FormLabel>Avatar BG</FormLabel>
              <input type="color" value={avatarBgColor} onChange={e => onAvatarBgColorChange?.(e.target.value)} className="h-10 w-10 p-0 border-0" />
            </div>
            <div className="flex flex-col items-center">
              <FormLabel>Banner Start</FormLabel>
              <input type="color" value={bannerStartColor} onChange={e => onBannerStartColorChange?.(e.target.value)} className="h-10 w-10 p-0 border-0" />
            </div>
            <div className="flex flex-col items-center">
              <FormLabel>Banner End</FormLabel>
              <input type="color" value={bannerEndColor} onChange={e => onBannerEndColorChange?.(e.target.value)} className="h-10 w-10 p-0 border-0" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit">Save</Button>
        </CardFooter>
      </Card>
      </form>
    </Form>
  );
}
