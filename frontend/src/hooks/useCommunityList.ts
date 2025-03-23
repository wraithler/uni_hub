import { usePaginationAndFilters } from '@/hooks/usePagination';
import { CommunityFilters, CommunityList, fetchCommunityList } from '@/types/communities';

export function useCommunityList() {
  const initialFilters: CommunityFilters = {
    limit: 10,
    offset: 0,
    sort_by: 'name',
    visibility: 'all',
    membership_status: 'all',
  };
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
  } = usePaginationAndFilters<CommunityList>({ initialFilters, fetchData: fetchCommunityList });

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
