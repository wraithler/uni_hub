import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { FeedItem } from "@/api/feed/feedTypes.ts";

export default function EventCard({
  id,
  title,
  created_by,
  timestamp,
  description,
  attendees,
  location,
}: FeedItem) {
  return (
    <Card key={id}>
      <div className="h-2 bg-blue-500"></div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              <span>placeholder</span>
            </CardDescription>
          </div>
          <Badge variant="outline">Placeholder</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>Placeholder</span>
          <span className="mx-2">•</span>
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          <span>{attendees} attending</span>
          <span className="mx-2">•</span>
          <span>Posted {timestamp}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback>
              {`${created_by.first_name} ${created_by.last_name}`.substring(
                0,
                2,
              )}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {created_by.first_name} {created_by.last_name}
          </span>
        </div>
        <Button variant="outline">RSVP</Button>
      </CardFooter>
    </Card>
  );
}
