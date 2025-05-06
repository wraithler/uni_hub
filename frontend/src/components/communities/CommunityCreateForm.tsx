import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  ChevronRight,
  Globe,
  Loader2,
  Lock,
  Plus,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import CommunityFeaturedCard from "@/components/communities/cards/CommunityFeaturedCard.tsx";
import { CommunityCard } from "@/components/communities/CommunityCard.tsx";
import { useAuth } from "@/components/auth/SessionAuthProvider.tsx";
import { useCommunityCreate } from "@/api/communities/useCommunityCreate.ts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { toast } from "sonner";

const BasicInfoSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(200, { message: "Description must be at most 200 characters" }),
  category: z.string(),
  contact_email: z.string().email({ message: "Invalid email address" }),
});

const AdditionalInfoSchema = z.object({
  tags: z
    .array(z.string())
    .min(1, { message: "You must add at least one tag" })
    .max(3, { message: "You can add at most 3 tags" }),
  about: z
    .string()
    .min(10, { message: "About must be at least 10 characters" }),
  guidelines: z
    .array(z.string())
    .min(1, { message: "You must add at least one guideline" }),
  privacy: z.string(),
});

const PersonalisationSchema = z.object({
  avatar: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Avatar must be at most 5MB",
    })
    .refine(
      (file) => !file || ["image/png", "image/jpeg"].includes(file.type),
      {
        message: "Avatar must be a PNG or JPEG image",
      },
    ),
  banner: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Banner must be at most 5MB",
    })
    .refine(
      (file) => !file || ["image/png", "image/jpeg"].includes(file.type),
      {
        message: "Banner must be a PNG or JPEG image",
      },
    ),
});

const multiStepSchema = z.object({
  basicInfo: BasicInfoSchema,
  additionalInfo: AdditionalInfoSchema,
  personalisation: PersonalisationSchema,
});

export default function CommunityCreateForm() {
  const [step, setStep] = useState(1);
  const [tagInputValue, setTagInputValue] = useState("");
  const [guidelineInputValue, setGuidelineInputValue] = useState("");
  const [privacyValue, setPrivacyValue] = useState("");
  const [avatarPreview] = useState<string | null>(null);
  const [bannerPreview] = useState<string | null>(null); // todo: setup previews
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  const createCommunity = useCommunityCreate();
  const navigate = useNavigate();

  const { user } = useAuth();

  const form = useForm<z.infer<typeof multiStepSchema>>({
    resolver: zodResolver(multiStepSchema),
    defaultValues: {
      basicInfo: {
        name: "",
        description: "",
        category: "",
        contact_email: "",
      },
      additionalInfo: {
        tags: [],
        about: "",
        guidelines: [],
        privacy: "",
      },
      personalisation: {
        avatar: undefined,
        banner: undefined,
      },
    },
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  const addTag = () => {
    form.setValue("additionalInfo.tags", [
      ...form.getValues("additionalInfo.tags"),
      tagInputValue,
    ]);
    setTagInputValue("");
  };

  // Handle Enter key for adding tags
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "additionalInfo.tags",
      form
        .getValues("additionalInfo.tags")
        .filter((tag) => tag !== tagToRemove),
    );
  };

  const onTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInputValue(e.target.value);
  };

  const onGuidelineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuidelineInputValue(e.target.value);
  };

  const addGuideline = () => {
    form.setValue("additionalInfo.guidelines", [
      ...form.getValues("additionalInfo.guidelines"),
      guidelineInputValue,
    ]);
    setGuidelineInputValue("");
  };

  const handleGuidelineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGuideline();
    }
  };

  const removeGuideline = (guidelineToRemove: string) => {
    form.setValue(
      "additionalInfo.guidelines",
      form
        .getValues("additionalInfo.guidelines")
        .filter((guideline) => guideline !== guidelineToRemove),
    );
  };

  const nextStep = async () => {
    const isValid = await form.trigger(
      Object.keys(multiStepSchema.shape)[step - 1] as never,
    );
    console.log(isValid);
    if (isValid) {
      setStep((step) => step + 1);
    }
  };

  const prevStep = () => {
    setStep((step) => step - 1);
  };

  const onSubmit = async (data: z.infer<typeof multiStepSchema>) => {
    setIsLoading(true);
    try {
      createCommunity.mutate({
        name: data.basicInfo.name,
        description: data.basicInfo.description,
        category: data.basicInfo.category,
        contact_email: data.basicInfo.contact_email,
        tags: data.additionalInfo.tags,
        about: data.additionalInfo.about,
        guidelines: data.additionalInfo.guidelines,
        privacy: data.additionalInfo.privacy,
      });
      navigate("/communities");
    } catch {
      toast.error("Something went wrong, please try again.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-500"}`}
            >
              1
            </div>
            <span className="text-sm mt-1">Basics</span>
          </div>
          <div
            className={`h-1 flex-grow mx-2 ${step >= 2 ? "bg-primary" : "bg-slate-200"}`}
          ></div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-500"}`}
            >
              2
            </div>
            <span className="text-sm mt-1">Details</span>
          </div>
          <div
            className={`h-1 flex-grow mx-2 ${step >= 3 ? "bg-primary" : "bg-slate-200"}`}
          ></div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-500"}`}
            >
              3
            </div>
            <span className="text-sm mt-1">Style</span>
          </div>
          <div
            className={`h-1 flex-grow mx-2 ${step >= 4 ? "bg-primary" : "bg-slate-200"}`}
          ></div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-500"}`}
            >
              4
            </div>
            <span className="text-sm mt-1">Preview</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Let's start with the essential details about your community.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="basicInfo.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Community Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a clear, descriptive name that reflects the
                        purpose of your community
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="basicInfo.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Community Description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear description of your community's purpose,
                        goals, and activities.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="basicInfo.category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="category" tabIndex={0}>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Interest">
                              Interest-based
                            </SelectItem>
                            <SelectItem value="Cultural">Cultural</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Categorizing your community helps students find it more
                        easily.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="basicInfo.contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide an email address for students to contact you
                      </FormDescription>
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
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  Add more information to help students discover and thrive in
                  your community.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="additionalInfo.tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags & Interests</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            onKeyDown={handleTagKeyDown}
                            onChange={onTagInputChange}
                            value={tagInputValue}
                          />
                          <Button type="button" onClick={addTag} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form
                          .getValues("additionalInfo.tags")
                          .map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 py-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 rounded-full hover:bg-slate-300 p-0.5"
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove {tag}</span>
                              </button>
                            </Badge>
                          ))}
                      </div>
                      <FormDescription>
                        Add relevant tags to help students find your community
                        based on their interests
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo.about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Share more about your community's history, achievements,
                        and future plans
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo.guidelines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guidelines</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            onKeyDown={handleGuidelineKeyDown}
                            onChange={onGuidelineInputChange}
                            value={guidelineInputValue}
                          />
                          <Button
                            type="button"
                            onClick={addGuideline}
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex flex-col flex-wrap gap-2 mt-2">
                        {form
                          .getValues("additionalInfo.guidelines")
                          .map((guideline, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex justify-between gap-1 py-1 w-auto"
                            >
                              {guideline}
                              <button
                                type="button"
                                onClick={() => removeGuideline(guideline)}
                                className="ml-1 rounded-full hover:bg-slate-300 p-0.5"
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">
                                  Remove {guideline}
                                </span>
                              </button>
                            </Badge>
                          ))}
                      </div>
                      <FormDescription>
                        Add guidelines to ensure a safe and respectful community
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo.privacy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy Settings</FormLabel>
                      <FormControl>
                        <RadioGroup
                          {...field}
                          value={privacyValue}
                          onValueChange={setPrivacyValue}
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
                                Anyone at the university can see and join your
                                community.
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
                                Anyone can see the community, but members must
                                be approved.
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
            <Card>
              <CardHeader>
                <CardTitle>Personalisation</CardTitle>
                <CardDescription>
                  Add a profile picture and banner to make your community stand
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Community Avatar</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        {avatarPreview ? (
                          <AvatarImage
                            src={avatarPreview}
                            alt="Avatar preview"
                          />
                        ) : (
                          <AvatarFallback className="text-lg">
                            {/*{formData.name*/}
                            {/*  ? formData.name.substring(0, 2).toUpperCase()*/}
                            {/*  : "C"}*/}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-grow mt-6">
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          // onChange={(e) => handleFileChange(e, "avatar")}
                        />
                        <Label htmlFor="avatar" className="cursor-pointer">
                          <div className="flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-slate-50">
                            <Upload className="h-4 w-4" />
                            <span>Upload Avatar</span>
                          </div>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: 400x400px
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner">Community Banner</Label>
                    <div className="flex flex-col gap-2">
                      <div className="relative h-24 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                        {bannerPreview ? (
                          <img
                            src={bannerPreview || "/placeholder.svg"}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Banner Preview
                          </span>
                        )}
                      </div>
                      <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        // onChange={(e) => handleFileChange(e, "banner")}
                      />
                      <Label htmlFor="banner" className="cursor-pointer">
                        <div className="flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-slate-50">
                          <Upload className="h-4 w-4" />
                          <span>Upload Banner</span>
                        </div>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Recommended: 1200x300px
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" variant="outline" onClick={nextStep}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Your Community</CardTitle>
                  <CardDescription>
                    Review how your community will appear to others.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CommunityFeaturedCard
                    community={{
                      id: 0,
                      name: form.getValues("basicInfo.name"),
                      description: form.getValues("basicInfo.description"),
                      category: form.getValues("basicInfo.category"),
                      tags: form.getValues("additionalInfo.tags"),
                      member_count: 0,
                      post_count: 0,
                      is_member: false,
                      avatar_url: avatarPreview || "",
                      contact_email: "",
                      about: "",
                      guidelines: [],
                    }}
                  />
                  <CommunityCard
                    community={{
                      id: 0,
                      name: form.getValues("basicInfo.name"),
                      description: form.getValues("basicInfo.description"),
                      category: form.getValues("basicInfo.category"),
                      tags: form.getValues("additionalInfo.tags"),
                      member_count: 0,
                      post_count: 0,
                      is_member: false,
                      avatar_url: avatarPreview || "",
                      contact_email: "",
                      about: "",
                      guidelines: [],
                    }}
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
                        Creating Community...
                      </>
                    ) : (
                      "Create Community"
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
