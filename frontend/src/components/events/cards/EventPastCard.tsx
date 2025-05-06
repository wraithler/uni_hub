import { Event } from "@/api/events/eventTypes.ts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Calendar, Users } from "lucide-react";
import { formatTimestampRange } from "@/api";

export default function EventPastCard({ event }: { event: Event }) {
  const { date, time } = formatTimestampRange(event.starts_at, event.ends_at);

  return (
    <Card className="bg-slate-50">
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              <span>{date} {time}</span>
              <span className="mx-2">•</span>
              <Users className="h-3 w-3" />
              <span>{event.attendees} attended</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
