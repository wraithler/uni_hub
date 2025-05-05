import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/components/auth/SessionAuthProvider";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { Link } from "react-router-dom";

export default function UserMeCard() {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.avatar} alt="User" />
            <AvatarFallback>
              {nameToAvatarFallback(`${user?.first_name} ${user?.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-lg">
              {user?.first_name} {user?.last_name}
            </h2>
            {user?.subject ? (
              <p className="text-muted-foreground">{user.subject}</p>
            ) : (
              <Button
                variant="link"
                className="text-muted-foreground p-0 m-0 h-auto"
                asChild
              >
                <Link to="/profile/update">
                  Finish setting up your profile...
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="p-2">
            <p className="font-bold">{user?.community_count || 0}</p>
            <p className="text-xs text-muted-foreground">Communities</p>
          </div>
          <div className="p-2">
            <p className="font-bold">{user?.friend_count || 0}</p>
            <p className="text-xs text-muted-foreground">Friends</p>
          </div>
          <div className="p-2">
            <p className="font-bold">{user?.post_count || 0}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => console.log("TODO")}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
