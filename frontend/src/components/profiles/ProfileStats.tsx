import { Card, CardContent } from "@/components/ui/card.tsx";
import {User} from "@/api/users/userTypes.ts";

export default function ProfileStats({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Card className="text-center">
        <CardContent className="p-4">
          <p className="text-2xl font-bold">{user.posts}</p>
          <p className="text-sm text-muted-foreground">Posts</p>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-4">
          <p className="text-2xl font-bold">{user.communities}</p>
          <p className="text-sm text-muted-foreground">Communities</p>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-4">
          <p className="text-2xl font-bold">{user.friends}</p>
          <p className="text-sm text-muted-foreground">Friends</p>
        </CardContent>
      </Card>
    </div>
  );
}
