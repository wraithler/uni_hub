import { Community } from "@/api/communities/communityTypes.ts";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "lucide-react";
import EventUpcomingList from "@/components/events/display/EventUpcomingList.tsx";
import { useEvents } from "@/api/events/useEvents.ts";
import EventPastList from "@/components/events/display/EventPastList.tsx";

export default function EventListContainer({
  community,
}: {
  community: Community;
}) {
  const { data: eventsUpcoming } = useEvents({
    community_id: community.id,
    upcoming: true,
  });
  const { data: eventsPast } = useEvents({
    community_id: community.id,
    past: true,
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>

        {(community.is_admin || community.is_moderator) && (
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {eventsUpcoming && <EventUpcomingList events={eventsUpcoming.results} />}
      {eventsPast && <EventPastList events={eventsPast.results} />}
    </>
  );
}
