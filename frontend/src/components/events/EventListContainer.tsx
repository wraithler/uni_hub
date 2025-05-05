import { Community } from "@/api/communities/communityTypes.ts";
import { Button } from "@/components/ui/button.tsx";
import { Calendar, Users } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import EventUpcomingCard from "@/components/events/EventUpcomingCard.tsx";

export default function EventListContainer({
  community,
}: {
  community: Community;
}) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Annual Hackathon 2025",
            date: "March 15-16, 2025",
            time: "9:00 AM - 5:00 PM",
            location: "University Tech Center",
            description:
              "A 48-hour coding competition where teams build innovative solutions to real-world problems.",
            attendees: 87,
            color: "bg-blue-500",
          },
          {
            title: "AI Workshop Series",
            date: "February 10, 2025",
            time: "2:00 PM - 4:00 PM",
            location: "Computer Science Building, Room 302",
            description:
              "Learn the fundamentals of artificial intelligence and machine learning in this hands-on workshop.",
            attendees: 42,
            color: "bg-purple-500",
          },
          {
            title: "Industry Networking Night",
            date: "January 25, 2025",
            time: "6:00 PM - 8:30 PM",
            location: "University Conference Center",
            description:
              "Connect with professionals from leading tech companies and explore career opportunities.",
            attendees: 65,
            color: "bg-green-500",
          },
        ].map((event) => (
          <EventUpcomingCard key={event.id} event={event}/>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Past Events</h3>
        <div className="space-y-4">
          {[
            {
              title: "Web Development Workshop",
              date: "November 12, 2024",
              attendees: 53,
            },
            {
              title: "Tech Talk: The Future of Quantum Computing",
              date: "October 28, 2024",
              attendees: 78,
            },
            {
              title: "Resume Review Session",
              date: "October 15, 2024",
              attendees: 34,
            },
          ].map((event, index) => (
            <Card key={index} className="bg-slate-50">
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                      <span className="mx-2">•</span>
                      <Users className="h-3 w-3" />
                      <span>{event.attendees} attended</span>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Photos
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
