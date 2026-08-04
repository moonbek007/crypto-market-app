"use client";

import { useRouter } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildPageNumbers, cn, ELLIPSIS } from "@/lib/utils";

const CoinsPagination = ({
  currentPage,
  totalPages,
  hasMorePages,
}: Pagination) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/coins?page=${page}`);
  };

  const pageNumbers = buildPageNumbers(currentPage, totalPages);
  const isLastPage = !hasMorePages || currentPage === totalPages;

  return (
    <Pagination className="" id="coins-pagination">
      <PaginationContent className="pagination-content">
        <PaginationItem className="pagination-control text-amber-50 p-1">
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={cn("max-[425px]:p-0.5!", {
              "control-disabled": currentPage === 1,
              "control-button": currentPage !== 1,
            })}
          />
        </PaginationItem>

        <div className="pagination-pages">
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === ELLIPSIS ? (
                <span className="ellipsis text-amber-50 max-[425px]:p-1!">
                  ...
                </span>
              ) : (
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "page-link bg-transparent text-amber-100 hover:text-amber-50 max-[425px]:size-7!",
                    {
                      "page-link-active": currentPage === page,
                    },
                  )}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="pagination-control text-amber-50 p-1 hover:bg-accent-foreground">
          <PaginationNext
            onClick={() => !isLastPage && handlePageChange(currentPage + 1)}
            className={cn("max-[425px]:p-0.5!", {
              "control-disabled": isLastPage,
              "control-button": !isLastPage,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CoinsPagination;
