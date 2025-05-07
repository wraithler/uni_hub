import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { User } from "@/api/users/userTypes.ts";
import { nameToAvatarFallback } from "@/lib/utils.ts";

export default function CommunityDashboardStaffCard({ user }: { user: User }) {
  const fullName = `${user.first_name} ${user.last_name}`;
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt={fullName} />
          <AvatarFallback>{nameToAvatarFallback(fullName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{fullName}</p>
        </div>
      </div>
    </div>
  );
}
