import Filters from "@/types/filters";
import {useCallback, useEffect, useState} from "react";
import {PaginationResponse} from "@/types/pagination";

interface UsePaginationAndFiltersProps<T extends PaginationResponse> {
    initialFilters: Filters;
    fetchData: (filters: Filters) => Promise<{data: T; }>
}

export function usePaginationAndFilters<T extends PaginationResponse>({ initialFilters, fetchData }: UsePaginationAndFiltersProps<T>) {
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchAndSetData = useCallback((async () => {
        setLoading(true);

        try {
            const result = await fetchData(filters);
            setData(result.data);
            setError(null);
        } catch(err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }), [filters, fetchData]);

    const handlePageChange = (page: number) => {
        setFilters({
            ...filters,
            offset: (page - 1) * filters.limit
        });
    };

    const handleFilterChange = (name: string, value: boolean | string) => {
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const currentPage = data ? Math.ceil(data.offset / (data.limit ?? 1)) + 1 : 1;
    const totalPages = data ? Math.ceil(data.count / (data.limit ?? 1)) : 1;

    useEffect(() => {
        fetchAndSetData();
    }, [fetchAndSetData]);

    return {
        data,
        loading,
        error,
        filters,
        currentPage,
        totalPages,
        fetchAndSetData,
        handlePageChange,
        handleFilterChange
    };
}