import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { STALE_TIME } from "@/api";

type UsePaginatedQueryProps<TParams> = {
  queryKey: any[];
  queryFn: (params: TParams) => Promise<any>;
  params: TParams;
  limit: number;
  initialOffset?: number;
};

export type PaginationProps = {
  totalPages: number;
  currentPage: number;
  pages: number[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

export function usePaginatedQuery<TParams>({
  queryKey,
  queryFn,
  params,
  limit,
  initialOffset = 0,
}: UsePaginatedQueryProps<TParams>) {
  const [offset, setOffset] = useState(initialOffset);

  const queryParams = {
    ...params,
    limit,
    offset,
  };

  const { data, ...rest } = useQuery({
    queryKey: [...queryKey, queryParams],
    queryFn: () => queryFn(queryParams),
    staleTime: STALE_TIME,
    placeholderData: (prev) => prev,
  });

  const pagination: PaginationProps | null = useMemo(() => {
    if (!data) return null;

    const count = data.count ?? 0;
    const totalPages = Math.ceil(count / limit);
    const currentPage = offset / limit + 1;
    const nextPages = [currentPage + 1, currentPage + 2].filter(
      (p) => p <= totalPages,
    );
    const prevPages = [currentPage - 1, currentPage - 2].filter((p) => p > 0);
    const pages = [...prevPages, currentPage, ...nextPages].sort(
      (a, b) => a - b,
    );

    const setPage = (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setOffset((clamped - 1) * limit);
    };

    return {
      totalPages,
      currentPage,
      pages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      setPage,
      nextPage: () => setPage(currentPage + 1),
      prevPage: () => setPage(currentPage - 1),
    };
  }, [data, limit, offset]);

  return {
    data,
    offset,
    setOffset,
    pagination,
    ...rest,
  };
}
