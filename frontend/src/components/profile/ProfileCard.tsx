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
import { User } from "lucide-react";
import { nameToAvatarFallback } from "@/lib/utils.ts";
import { ProfileFormData } from "@/api/profile/profileTypes.ts";
import profileConfig from "./ProfileStyling.tsx"; // optional

interface ProfileCardProps {
  profile: ProfileFormData;
  onEdit?: () => void;
}

export function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  const style = profileConfig[profile.hobbies ?? ""] || profileConfig["Default"];

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profile.avatar_url} alt={profile.first_name || "User"} />
            <AvatarFallback className={`${style.avatarBg} text-white`}>
              {nameToAvatarFallback(profile.first_name || "U")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-base">{profile.first_name ?? "User"}</CardTitle>
            <Badge variant="outline" className="capitalize w-fit text-xs">
              {profile.hobbies || "No hobby listed"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {profile.bio || "No bio available"}
        </p>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {profile.website_url && (
            <span>
              <strong>Website:</strong> {profile.website_url}
            </span>
          )}
          {profile.github_url && (
            <span>
              <strong>GitHub:</strong> {profile.github_url}
            </span>
          )}
          {profile.linkedin_url && (
            <span>
              <strong>LinkedIn:</strong> {profile.linkedin_url}
            </span>
          )}
        </div>
      </CardContent>

      {onEdit && (
        <CardFooter className="pt-0 mt-auto">
          <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>
            Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}