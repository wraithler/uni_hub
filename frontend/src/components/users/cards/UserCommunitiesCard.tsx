import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function UserCommunitiesCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">My Communities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {[
          {
            name: "Computer Science Society",
            role: "Moderator",
            avatar: "/placeholder.svg",
          },
          {
            name: "Web Development Club",
            role: "Member",
            avatar: "/placeholder.svg",
          },
          {
            name: "AI Research Group",
            role: "Member",
            avatar: "/placeholder.svg",
          },
        ].map((community, index) => (
          <div key={index} className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={community.avatar} alt={community.name} />
              <AvatarFallback>{community.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="text-sm font-medium">{community.name}</p>
              <p className="text-xs text-muted-foreground">{community.role}</p>
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full text-primary">
          View All Communities
        </Button>
      </CardContent>
    </Card>
  );
}
