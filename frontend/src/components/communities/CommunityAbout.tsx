import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ChevronRight, MessageSquare } from "lucide-react";
import { Community } from "@/api/communities/communityTypes";

export default function CommunityAbout({
  community,
}: {
  community: Community;
}) {
  const guidelines = community.guidelines.map((val) => (
    <li className="flex items-start gap-2">
      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
      <span>{val}</span>
    </li>
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About Our Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{community.about}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">{guidelines}</ul>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {community.contact_email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
