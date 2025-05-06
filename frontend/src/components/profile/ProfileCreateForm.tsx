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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";
import { ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import { ProfileCard } from "@/components/profile/ProfileCard.tsx";
import api from "@/api/apiClient";
import { useProfileChoices } from "@/api/profile";

const BasicInfoSchema = z.object({
  gender: z.string().optional(),
  hobbies: z.string().optional(),
  year_of_study: z.string().optional(),
  course: z.string().optional(),
  phone_number: z.string().optional(),
  student_number: z.string().optional(),
});

const SocialLinksSchema = z.object({
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
  const navigate = useNavigate();
  const { data: profileChoices } = useProfileChoices();

  const form = useForm<z.infer<typeof multiStepSchema>>({
    resolver: zodResolver(multiStepSchema),
    defaultValues: {
      basicInfo: {
        gender: "",
        hobbies: "",
        year_of_study: "",
        course: "",
        phone_number: "",
        student_number: "",
      },
      socialLinks: {
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
    const payload = {
      ...data.basicInfo,
      ...data.socialLinks,
    };
    console.log("payload:", payload);
    setIsLoading(true);
    try {
      const res = await api.post("/profile/create/", payload);
      const newProfileId = res.data.id;
      navigate(`/profile/${newProfileId}`);
    } catch (err: any) {
      console.error("API payload:", payload);
      console.error("API error response:", err.response?.data);
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
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {profileChoices?.gender_choices && Object.entries(profileChoices.gender_choices).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hobbies" />
                          </SelectTrigger>
                          <SelectContent>
                            {profileChoices?.hobby_choices && Object.entries(profileChoices.hobby_choices).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="basicInfo.year_of_study"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Study</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {profileChoices?.year_choices && Object.entries(profileChoices.year_choices).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="basicInfo.course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {profileChoices?.course_choices && Object.entries(profileChoices.course_choices).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="basicInfo.phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+447..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="basicInfo.student_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 12345678" {...field} />
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
              <CardContent className="space-y-4">
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
                      first_name: user?.first_name || "User",
                      last_name: user?.last_name || "",
                      gender: form.getValues("basicInfo.gender") || "",
                      hobbies: form.getValues("basicInfo.hobbies") || "",
                      year_of_study: form.getValues("basicInfo.year_of_study") || "",
                      course: form.getValues("basicInfo.course") || "",
                      phone_number: form.getValues("basicInfo.phone_number") || "",
                      student_number: form.getValues("basicInfo.student_number") || "",
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