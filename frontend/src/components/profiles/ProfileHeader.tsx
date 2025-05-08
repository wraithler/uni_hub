import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import FriendButton from "@/components/friends/FriendButton";
import {
  Calendar,
  GraduationCap,
  Mail,
  MoreHorizontal,
  Settings,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { User } from "@/api/users/userTypes.ts";
import { formatTimestampRange, getOrdinal } from "@/api";

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
        <AvatarImage src={user.avatar} alt={fullName} />
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
            {self && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <p className="mt-4 text-muted-foreground">{user.bio}</p>

        <div className="flex flex-wrap gap-6 mt-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>
              {user.academic_department}, {user.year_of_study}
              {getOrdinal(user.year_of_study as number)} Year
            </span>
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
