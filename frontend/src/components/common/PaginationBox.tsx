import { PaginationProps } from "@/lib/tanstackExtension.ts";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";

export default function PaginationBox({
  pagination,
}: {
  pagination: PaginationProps;
}) {
  return (
    <div className="flex justify-center mt-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              type="button"
              style={{ overflowAnchor: "none" }}
              onClick={() => pagination?.prevPage()}
            />
          </PaginationItem>
          {pagination?.pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                type="button"
                style={{ overflowAnchor: "none" }}
                onClick={() => pagination?.setPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
