import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function EventUpcomingCard({ event }: { event: Event }) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${event.color}`}></div>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1 mt-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.starts_at}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.ends_at}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="w-6 h-6 border-2 border-white">
                <AvatarFallback className="text-xs">U{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {event.attendees} attending
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">RSVP</Button>
      </CardFooter>
    </Card>
  );
}
