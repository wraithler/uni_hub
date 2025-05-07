import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useUsersPaginated } from "@/api/users/useUsersPaginated.ts";
import UserLeadershipTeamList from "@/components/users/display/UserLeadershipTeamList.tsx";
import UserActiveMemberList from "@/components/users/display/UserActiveMemberList.tsx";
import PaginationBox from "@/components/common/PaginationBox.tsx";
import { useState } from "react";
import { useDebounce } from "@/lib/utils.ts";
import { Community } from "@/api/communities/communityTypes";

export default function UserListContainer({ community }: { community: Community }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: users,
    isLoading,
    pagination,
  } = useUsersPaginated({
    community_id: community.id,
    name: debouncedSearchQuery,
    is_staff: false,
  });

  const {
    data: staff,
    isLoading: isLoadingStaff,
    pagination: paginationStaff,
  } = useUsersPaginated({
    community_id: community.id,
    name: debouncedSearchQuery,
    is_staff: true,
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Community Members</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-9 w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!isLoading && !isLoadingStaff && (
        <>
          <UserLeadershipTeamList users={staff.results} />
          {paginationStaff && staff.results.length > 0 && (
            <PaginationBox pagination={paginationStaff} />
          )}
          <UserActiveMemberList users={users.results} />
          {pagination && users.results.length > 0 && (
            <PaginationBox pagination={pagination} />
          )}
        </>
      )}
    </>
  );
}
