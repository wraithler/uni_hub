import Layout from "@/components/core/Layout.tsx";
import PageHeader from "@/components/core/PageHeader.tsx";
import { useUsersPaginated } from "@/api/users/useUsersPaginated.ts";
import { useState } from "react";
import { useDebounce } from "@/lib/utils.ts";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import PaginationBox from "@/components/common/PaginationBox.tsx";
import UserActiveMemberList from "@/components/users/display/UserActiveMemberList.tsx";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const {
    data: users,
    isLoading,
    pagination,
  } = useUsersPaginated({
    name: debouncedSearchQuery,
  });
  return (
    <Layout>
      {/* Main Content */}
      <main className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Users"
          description="Find users with similar interests"
          button={<></>}
        />

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

          {!isLoading && (
            <>
              <UserActiveMemberList users={users.results} />
              {pagination && users.results.length > 0 && (
                <PaginationBox pagination={pagination} />
              )}
            </>
          )}
        </>
      </main>
    </Layout>
  );
}
