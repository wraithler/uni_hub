import { Event } from "@/api/events/eventTypes.ts";
import EventPastCard from "@/components/events/EventPastCard.tsx";
import EventsListEmpty from "@/components/events/EventsListEmpty.tsx";

export default function EventPastList({ events }: { events: Event[] }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Past Events</h3>
      <div className="space-y-4">
        {events.length === 0 && <EventsListEmpty />}
        {events.map((event) => (
          <EventPastCard event={event} />
        ))}
      </div>
    </div>
  );
}
