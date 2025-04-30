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
  const buttonStyle = (p: number) => {
    if (pagination?.currentPage === p) {
      return "bg-primary text-primary-foreground";
    }
    return "text-muted-foreground hover:bg-accent hover:text-accent-foreground";
  }

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
                className={buttonStyle(page)}
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
