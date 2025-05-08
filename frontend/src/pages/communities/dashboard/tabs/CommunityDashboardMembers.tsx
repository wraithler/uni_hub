import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import CommunityDashboardRoleDialog from "@/components/communities/CommunityDashboardRoleDialog.tsx";
import { UserPlus } from "lucide-react";
import CommunityJoinRequestCard from "@/components/communities/CommunityJoinRequestCard.tsx";
import CommunityDashboardStaffCard from "@/components/communities/CommunityDashboardStaffCard.tsx";
import { CommunityDashboard } from "@/api/communities/communityTypes.ts";

export default function CommunityDashboardMembers({ data }: { data: CommunityDashboard, id: number }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Member Management Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>
                Review, approve, and manage community members
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <CommunityDashboardRoleDialog community_id={Number()} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pending Join Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-amber-600" />
            Pending Join Requests
          </CardTitle>
          <CardDescription>
            {data.pending_requests.length} people waiting to join your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.pending_requests.map((request) => (
              <CommunityJoinRequestCard joinRequest={request} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Community Roles</CardTitle>
          <CardDescription>
            Manage leadership and moderation roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Admin Role */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Administrators</h3>
                  <p className="text-sm text-muted-foreground">
                    Full control over community settings and members
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.admins.map((admin) => (
                  <CommunityDashboardStaffCard user={admin} key={admin.id} />
                ))}
              </div>
            </div>

            {/* Moderator Role */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Moderators</h3>
                  <p className="text-sm text-muted-foreground">
                    Can approve posts and manage content
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.moderators.map((mod) => (
                  <CommunityDashboardStaffCard user={mod} key={mod.id} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
