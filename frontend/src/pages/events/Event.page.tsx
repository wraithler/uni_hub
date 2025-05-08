import { useParams } from "react-router-dom";
import { useEventDetail } from "@/api/events/useEventDetail";
import Layout from "@/components/core/Layout";
import PageHeader from "@/components/core/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTimestampRange } from "@/api";

export default function EventPage() {
  const { id } = useParams();
  const { data: event } = useEventDetail(Number(id));

  if (!event) return null;

  const { date, time } = formatTimestampRange(event.starts_at, event.ends_at);

  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <PageHeader
          title={event.title}
          description={event.description}
        />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap items-center">
            {event.is_virtual_event && (
              <Badge variant="outline">Virtual</Badge>
            )}
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
              <Clock className="w-4 h-4" />
              <span>{time}</span>
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
