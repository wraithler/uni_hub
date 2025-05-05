import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { Event } from "@/api/events/eventTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeaturedEventCardProps {
  event: Event;
}

export default function EventFeaturedCard({ event }: FeaturedEventCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-32 bg-gradient-to-r from-sky-500 to-blue-600" />
      <CardHeader className="pt-6 flex-grow">
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="flex flex-col text-sm text-muted-foreground gap-2 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(event.starts_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      </div>

        {event.is_virtual_event && (
          <Badge variant="outline" className="text-xs">
            Virtual Event
          </Badge>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full" asChild>
          <Link to={`/events/${event.id}`}>View Event</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
