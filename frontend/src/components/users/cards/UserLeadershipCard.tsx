import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { User } from "@/api/users/userTypes";
import { nameToAvatarFallback } from "@/lib/utils.ts";

export default function UserLeadershipCard({ user }: { user: User }) {
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <Avatar className="w-20 h-20 mx-auto">
          <AvatarImage src={user.avatar} alt={fullName} />
          <AvatarFallback>{nameToAvatarFallback(fullName)}</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-2 text-lg">{fullName}</CardTitle>
        <Badge variant="outline" className="mx-auto mt-1">
            Community Leader
        </Badge> {/* TODO: Fix roles */}
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">{user.bio}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="outline" size="sm">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
