import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/SessionAuthProvider";
import { Navigate } from "react-router-dom";
import { useEventCreate } from "@/api/events/useEventCreate";
import EventFeaturedCard from "./EventFeaturedCard.tsx";
import CommunitiesCombobox from "@/components/communities/CommunitiesCombobox";

const BasicInfoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  starts_at: z.string(),
  ends_at: z.string(),
});

const LocationSchema = z.object({
  location: z.string().min(3),
  is_virtual_event: z.boolean(),
  virtual_link: z.string().url().optional(),
});

const CommunitySchema = z.object({
  community: z.number(),
});

const fullSchema = z.object({
  basic: BasicInfoSchema,
  location: LocationSchema,
  community: CommunitySchema,
});

export default function EventCreateForm() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const createEvent = useEventCreate();

  const form = useForm<z.infer<typeof fullSchema>>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      basic: {
        title: "",
        description: "",
        starts_at: "",
        ends_at: "",
      },
      location: {
        location: "",
        is_virtual_event: false,
        virtual_link: "",
      },
      community: {
        community: 0,
      },
    },
  });

  if (!user) return <Navigate to="/login" />;

  const nextStep = async () => {
    const valid = await form.trigger(
      Object.keys(fullSchema.shape)[step - 1] as never,
    );
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  return (
    <Form {...form}>
      <form>
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Start with your event’s basics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="basic.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Event Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basic.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Event Description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basic.starts_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basic.ends_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="button" onClick={nextStep}>
                Continue <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Location & Format</CardTitle>
              <CardDescription>Tell us how people can attend.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="location.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123 Main St or Building A"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location.is_virtual_event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is this a virtual event?</FormLabel>
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("location.is_virtual_event") && (
                <FormField
                  control={form.control}
                  name="location.virtual_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Virtual Link</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Continue <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Community</CardTitle>
              <CardDescription>
                Choose the community hosting this event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="community.community"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community</FormLabel>
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Preview
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Make sure everything looks good before publishing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventFeaturedCard
                  event={{
                    id: 0,
                    title: form.getValues("basic.title"),
                    description: form.getValues("basic.description"),
                    starts_at: form.getValues("basic.starts_at"),
                    ends_at: form.getValues("basic.ends_at"),
                    location: form.getValues("location.location"),
                    is_virtual_event: form.getValues(
                      "location.is_virtual_event",
                    ),
                    virtual_link: form.getValues("location.virtual_link"),
                    community: form.getValues("community.community"),
                  }}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button
                  type="submit"
                  onClick={form.handleSubmit((data) =>
                    createEvent.mutate({
                      title: data.basic.title,
                      description: data.basic.description,
                      starts_at: data.basic.starts_at,
                      ends_at: data.basic.ends_at,
                      location: data.location.location,
                      is_virtual_event: data.location.is_virtual_event,
                      virtual_link: data.location.virtual_link,
                      community: data.community.community,
                    }),
                  )}
                >
                  Create Event
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </form>
    </Form>
  );
}
