import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Info, Mail, Phone } from "lucide-react";
import { User } from "@/api/users/userTypes.ts";

export default function ProfileContactInfo({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user.contact_phone && !user.contact_email ? (
          <div className="flex items-center justify-center gap-2">
            <Info className="h-8 w-8"/>
            <span className="text-sm">
              Either the user has not provided details or you do not have
              permission to view them
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.contact_email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.contact_phone}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
