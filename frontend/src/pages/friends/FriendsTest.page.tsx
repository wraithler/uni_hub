import FriendList from "@/components/friends/FriendList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FriendsTestPage() {
  return (
    <div className="container max-w-2xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <FriendList showUnfriendButton />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Another User’s Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <FriendList userId={101} showUnfriendButton={false} />
        </CardContent>
      </Card>
    </div>
  );
}
