import CommunityFeaturedList from "@/components/communities/display/CommunityFeaturedList.tsx";
import { useCommunitiesPaginated } from "@/api/communities/useCommunitiesPaginated.ts";
import { useCommunities } from "@/api/communities/useCommunities.ts";
import { useState } from "react";
import { CommunitySortOptions } from "@/api/communities/communityQueryParameters.ts";
import { useDebounce } from "@/lib/utils.ts";
import PaginationBox from "@/components/common/PaginationBox.tsx";
import CommunityList from "@/components/communities/display/CommunityList.tsx";
import CommunityFilters from "@/components/communities/CommunityFilters.tsx";

export default function CommunityListContainer() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<CommunitySortOptions>("alphabetical");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: communities,
    isLoading: isLoading,
    pagination,
  } = useCommunitiesPaginated({
    limit: 12,
    category_name: selectedCategory === "all" ? undefined : selectedCategory,
    name: debouncedSearchQuery,
    sort_by: sortBy,
  });

  const { data: featuredCommunities, isLoading: isFeaturedLoading } =
    useCommunities({
      limit: 3,
      offset: 0,
      is_featured: true,
    });

  return (
    <>
      {/* Featured Communities */}
      {!isFeaturedLoading && (
        <CommunityFeaturedList communities={featuredCommunities.results} />
      )}
      {/* Filters & Search */}
      <CommunityFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* All Communities */}
      {!isLoading && (
        <CommunityList
          communities={communities.results}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setSearchQuery={setSearchQuery}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      {/* Pagination */}
      {pagination && <PaginationBox pagination={pagination} />}
    </>
  );
  {/* Add loading states */}
}
