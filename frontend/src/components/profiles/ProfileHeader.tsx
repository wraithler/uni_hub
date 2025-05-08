import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import FriendButton from "@/components/friends/FriendButton";
import { Calendar, GraduationCap, Mail } from "lucide-react";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { User } from "@/api/users/userTypes.ts";
import { formatTimestampRange } from "@/api";
import ProfileEditDialog from "@/components/profiles/ProfileEditDialog.tsx";

export default function ProfileHeader({
  user,
  self,
}: {
  user: User;
  self: boolean;
}) {
  const fullName = `${user.first_name} ${user.last_name}`;
  return (
    <div className="relative -mt-16 mb-6 flex flex-col md:flex-row gap-6 items-start">
      <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
        <AvatarImage src={user.profile_picture_url} alt={fullName} />
        <AvatarFallback className="text-3xl">
          {nameToAvatarFallback(fullName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-grow pt-4 md:pt-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent">
              {fullName}
              {self && <span className="text-xs text-muted"> (you)</span>}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="outline" className="font-normal text-accent">
                {String(user.role).charAt(0).toUpperCase() +
                  String(user.role).slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!self && <FriendButton user={user} />}
            {!self && user.contact_email && (
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            )}
            {self && <ProfileEditDialog user={user} />}
          </div>
        </div>

        <p className="mt-4 text-muted-foreground">{user.bio}</p>

        <div className="flex flex-wrap gap-6 mt-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>{user.academic_department}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Joined{" "}
              {
                formatTimestampRange(
                  user.created_at as string,
                  user.created_at as string,
                ).date
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
