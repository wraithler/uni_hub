import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ProfileFormData } from "@/api/profile/profileTypes.ts";
import { Edit } from "lucide-react";

interface FeaturedProfileCardProps {
  profile: ProfileFormData;
  onEdit: () => void;
}

export default function FeaturedProfileCard({ profile, onEdit }: FeaturedProfileCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      {/* Banner Section */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
      </div>

      {/* Profile Info */}
      <CardHeader className="pt-10 flex-grow">
        <CardTitle>{profile.first_name ?? "User"}</CardTitle>
        <CardDescription>{profile.bio || "No bio available"}</CardDescription>
      </CardHeader>

      {/* Content Section */}
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.hobbies ? (
            <Badge variant="secondary" className="text-xs">
              {profile.hobbies}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              No hobbies listed
            </Badge>
          )}
        </div>

        <div className="flex flex-col text-sm text-muted-foreground space-y-1">
          {profile.website_url && (
            <div>
              <strong>Website:</strong> {profile.website_url}
            </div>
          )}
          {profile.github_url && (
            <div>
              <strong>GitHub:</strong> {profile.github_url}
            </div>
          )}
          {profile.linkedin_url && (
            <div>
              <strong>LinkedIn:</strong> {profile.linkedin_url}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button className="w-full" variant="outline" onClick={onEdit}>
          <Edit className="mr-2 w-4 h-4" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}