import { usePaginationAndFilters } from "@/hooks/usePagination";
import { CommunityFilters, CommunityList } from "@/api/types/communities.tsx";
import { fetchCommunitiesList } from "@/api/services/communities.ts";

export function useCommunityList({
  initialFilters,
}: { initialFilters?: CommunityFilters } = {}) {
  const defaultFilters: CommunityFilters = {
    limit: 10,
    offset: 0,
  };

  const allFilters = { ...defaultFilters, ...initialFilters };

  const {
    data,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    fetchAndSetData,
    handlePageChange,
    handleFilterChange,
  } = usePaginationAndFilters<CommunityList>({
    initialFilters: allFilters,
    fetchData: fetchCommunitiesList,
  });

  return {
    data,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    fetchAndSetData,
    handlePageChange,
    handleFilterChange,
  };
}
