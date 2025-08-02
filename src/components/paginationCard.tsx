import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationCardProps {
  page: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];

  let l: number;
  let r: number;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }
  } else {
    l = Math.max(2, current - delta);
    r = Math.min(total - 1, current + delta);

    range.push(1);
    if (l > 2) {
      range.push("...");
    }

    for (let i = l; i <= r; i++) {
      range.push(i);
    }

    if (r < total - 1) {
      range.push("...");
    }
    range.push(total);
  }

  return range;
}

export function PaginationCard({
  page,
  onPageChange,
  totalPages = 1,
}: PaginationCardProps) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          />
        </PaginationItem>

        {pages.map((p, i) => (
          <PaginationItem key={i}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
