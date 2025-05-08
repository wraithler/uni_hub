import { User } from "@/api/users/userTypes.ts";
import { Card, CardFooter, CardHeader } from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge.tsx";

export default function UserActiveMemberCard({ user }: { user: User }) {
  const fullName = `${user.first_name} ${user.last_name}`;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="Member" />
            <AvatarFallback>{nameToAvatarFallback(fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{fullName}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.interests.map((interest, index) => (
            <Badge key={index} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button variant="ghost" size="sm" className="w-full">
          <Link to={`/profile/${user.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
