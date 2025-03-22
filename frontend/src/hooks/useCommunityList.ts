import {
    CommunityList,
    fetchCommunityList
} from "@/types/communities";
import {usePaginationAndFilters} from "@/hooks/usePagination";
import {CommunityFilters} from "@/types";

export function useCommunityList() {
    const initialFilters: CommunityFilters = {
        limit: 10,
        offset: 0,
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
        handleFilterChange
    } = usePaginationAndFilters<CommunityList>({initialFilters, fetchData: fetchCommunityList});

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
    }
}