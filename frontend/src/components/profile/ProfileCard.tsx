import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card.tsx";
  import { Badge } from "@/components/ui/badge.tsx";
  import { Button } from "@/components/ui/button.tsx";
  import { Edit } from "lucide-react";
  import { ProfileFormData } from "@/api/profile/profileTypes.ts";
  
  interface ProfileCardProps {
    profile: ProfileFormData;
    onEdit: () => void;
  }
  
  export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
    return (
      <Card className="overflow-hidden flex flex-col">
        {/* Header */}
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg">{profile.first_name ?? "User"}</CardTitle>
              <Badge variant="outline" className="w-fit">
                {profile.gender ? profile.gender : "No gender set"}
              </Badge>
            </div>
          </div>
        </CardHeader>
  
        {/* Content */}
        <CardContent className="flex flex-col flex-grow space-y-3">
          <p className="text-sm text-muted-foreground">
            <strong>Bio:</strong> {profile.bio || "No bio available"}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Hobbies:</strong> {profile.hobbies || "No hobbies listed"}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Website:</strong> {profile.website_url || "No website provided"}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>GitHub:</strong> {profile.github_url || "No GitHub profile"}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>LinkedIn:</strong> {profile.linkedin_url || "No LinkedIn profile"}
          </p>
        </CardContent>
  
        {/* Footer */}
        <CardFooter className="pt-0 mt-auto">
          <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>
            <Edit className="mr-2 w-4 h-4" />
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
    );
  }