import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useUsersPaginated } from "@/api/users/useUsersPaginated.ts";
import UserLeadershipTeamList from "@/components/users/display/UserLeadershipTeamList.tsx";
import UserActiveMemberList from "@/components/users/display/UserActiveMemberList.tsx";
import PaginationBox from "@/components/common/PaginationBox.tsx";

export default function UserListContainer() {
  const { data: users, isLoading, pagination } = useUsersPaginated({ community_id: 1 });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Community Members</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-9 w-[250px]" />
        </div>
      </div>

      {!isLoading && (
        <>
          <UserLeadershipTeamList users={users.results} />
          <UserActiveMemberList users={users.results} />
          {pagination && <PaginationBox pagination={pagination} />}
        </>
      )}
    </>
  );
}
