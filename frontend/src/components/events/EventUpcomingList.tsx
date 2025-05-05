import { Event } from "@/api/events/eventTypes.ts";
import EventUpcomingCard from "@/components/events/EventUpcomingCard.tsx";
import EventsListEmpty from "@/components/events/EventsListEmpty.tsx";

export default function EventUpcomingList({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.length === 0 && <EventsListEmpty />}
      {events.map((event) => (
        <EventUpcomingCard key={event.id} event={event} />
      ))}
    </div>
  );
}
