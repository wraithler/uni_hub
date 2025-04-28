import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider.tsx";
import { Navigate } from "react-router-dom";
import ProfileCard from "@/components/profile/ProfileCard.tsx";

const BasicInfoSchema = z.object({
  gender: z.string().optional(),
  hobbies: z.string().optional(),
  bio: z.string().max(300, "Bio must be at most 300 characters").optional(),
});

const SocialLinksSchema = z.object({
  website_url: z.string().url("Must be a valid URL").optional(),
  github_url: z.string().url("Must be a valid GitHub URL").optional(),
  linkedin_url: z.string().url("Must be a valid LinkedIn URL").optional(),
});

const multiStepSchema = z.object({
  basicInfo: BasicInfoSchema,
  socialLinks: SocialLinksSchema,
});

export default function ProfileCreateForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof multiStepSchema>>({
    resolver: zodResolver(multiStepSchema),
    defaultValues: {
      basicInfo: {
        gender: "",
        hobbies: "",
        bio: "",
      },
      socialLinks: {
        website_url: "",
        github_url: "",
        linkedin_url: "",
      },
    },
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  const nextStep = async () => {
    const keys = Object.keys(multiStepSchema.shape);
    const currentKey = keys[step - 1];
    const isValid = await form.trigger(currentKey as never);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const onSubmit = async (data: z.infer<typeof multiStepSchema>) => {
    setIsLoading(true);
    try {
      console.log("Submitted Profile:", data);
      // here you would call your API (e.g. api.post("/profile", data))
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-500"
              }`}>
                {s}
              </div>
              <span className="text-sm mt-1">
                {s === 1 ? "Basics" : s === 2 ? "Links" : "Preview"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Fill out your basic details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="basicInfo.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Input placeholder="Gender" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="basicInfo.hobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hobbies</FormLabel>
                      <FormControl>
                        <Input placeholder="Hobbies" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="basicInfo.bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us a little about yourself" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Share your profiles or personal website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="socialLinks.website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.github_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" onClick={nextStep}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Profile</CardTitle>
                  <CardDescription>Here's how your profile will look.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileCard
                    profile={{
                      first_name: user?.first_name ?? "User",
                      gender: form.getValues("basicInfo.gender") || "",
                      hobbies: form.getValues("basicInfo.hobbies") || "",
                      bio: form.getValues("basicInfo.bio") || "",
                      website_url: form.getValues("socialLinks.website_url") || "",
                      github_url: form.getValues("socialLinks.github_url") || "",
                      linkedin_url: form.getValues("socialLinks.linkedin_url") || "",
                    }}
                    onEdit={() => prevStep()}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}