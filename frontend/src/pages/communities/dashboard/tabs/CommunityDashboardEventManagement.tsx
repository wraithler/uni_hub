import { Event } from "@/api/events/eventTypes.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Calendar, Plus } from "lucide-react";
import EventFeaturedCard from "@/components/events/cards/EventFeaturedCard.tsx";

export default function CommunityDashboardEventManagement({
  events,
}: {
  events: Event[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Events Management Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>
                Create, manage, and track community events
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Events scheduled for your community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-3">
            {events.map((event) => (
              <EventFeaturedCard event={event} key={event.id} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
