import { useParams } from "react-router-dom";
import { useEventDetail } from "@/api/events/useEventDetail";
import Layout from "@/components/core/Layout";
import PageHeader from "@/components/core/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDate, nameToAvatarFallback } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function EventPage() {
  const { id } = useParams();
  const { data: event } = useEventDetail({ id: Number(id) });

  if (!event) return null;

  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <PageHeader
          title={event.title}
          description={event.description}
        />

        <div className="mb-8">
          <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md" />
          <div className="-mt-10 ml-6">
            <Avatar className="w-20 h-20 border-4 border-white">
              <AvatarImage src={event.avatar_url || undefined} alt={event.title} />
              <AvatarFallback className="text-xl">
                {nameToAvatarFallback(event.title)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap items-center">
            {event.is_virtual_event && (
              <Badge variant="outline">Virtual</Badge>
            )}
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.starts_at)}</span>
              <Clock className="w-4 h-4" />
              <span>{formatDate(event.ends_at)}</span>
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <Button size="sm">RSVP</Button>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Event Info</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="ticket">My Ticket</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <Card>
              <CardContent className="p-4 text-sm text-muted-foreground">
                {event.description || "No description provided."}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attendees">
            <Card>
              <CardContent className="p-4 text-sm text-muted-foreground">
                This section will show attendees in the future.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ticket">
            <Card>
              <CardContent className="p-4 text-sm text-muted-foreground">
                This section will show your QR ticket once RSVP'd.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
}
