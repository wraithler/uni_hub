import { Community } from "@/api/communities/communityTypes";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";

export default function CommunityDescription({
  community,
}: {
  community: Community;
}) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4">{community.description}</p>
        <div className="flex flex-wrap gap-2">
          {community.tags.map((tag: string, index: number) => (
            <Badge variant="secondary" key={index}>
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
