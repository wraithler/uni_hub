import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";

export default function ProfileInterests({
  interests,
}: {
  interests: string[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Interests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <Badge key={index} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
