import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Event } from "@/api/events/eventTypes.ts";
import {formatTimestampRange} from "@/api";
import {nameToAvatarFallback, timeAgo} from "@/lib/utils.ts";

export default function EventCard({ event }: { event: Event }) {
  const { date, time } = formatTimestampRange(event.starts_at, event.ends_at);
  const fullName = `${event.created_by?.first_name} ${event.created_by?.last_name}`;
  return (
    <Card key={event.id}>
      <div className="h-2 bg-blue-500"></div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>{time}</span>
          <span className="mx-2">•</span>
          <MapPin className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          <span>{event.attendees} attending</span>
          <span className="mx-2">•</span>
          <span>Posted {timeAgo(event.created_at as string)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback>
              {nameToAvatarFallback(fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {fullName}
          </span>
        </div>
        <Button variant="outline">RSVP</Button>
      </CardFooter>
    </Card>
  );
}
