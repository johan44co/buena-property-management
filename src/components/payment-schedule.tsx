"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RentPeriod } from "@/util/rent-due";
import { convertUTCToLocal } from "@/util/timezone";
import { format } from "date-fns";
import { formatCurrency } from "@/util/currency";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const getPageRange = (currentPage: number, totalPages: number) => {
  const range: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  range.push(1);

  if (currentPage > 3) {
    range.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (currentPage < totalPages - 2) {
    range.push("ellipsis");
  }

  range.push(totalPages);

  return range;
};

export default function PaymentSchedule({
  className,
  periods,
}: {
  className?: string;
  periods: RentPeriod[];
}) {
  const ITEMS_PER_PAGE = 3;

  // Find index of current period
  const currentPeriodIndex = periods.findIndex((period) => period.current);

  // Calculate initial page based on current period
  const initialPage = Math.floor(currentPeriodIndex / ITEMS_PER_PAGE) + 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(periods.length / ITEMS_PER_PAGE);

  // Get periods for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visiblePeriods = periods.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevious = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const handleNext = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visiblePeriods.map((period) => (
            <div
              key={period.startDate.toString()}
              className={cn(
                "flex justify-between p-4 rounded-lg border",
                period.current && "bg-muted",
              )}
            >
              <div className="space-y-1">
                <div className="font-medium">
                  {format(convertUTCToLocal(period.startDate), "MMM d")} -{" "}
                  {format(convertUTCToLocal(period.endDate), "MMM d, yyyy")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {period.current
                    ? "Current Period"
                    : period.startDate > new Date()
                      ? "Upcoming"
                      : "Past Due"}
                </div>
              </div>
              <div className="font-medium">{formatCurrency(period.amount)}</div>
            </div>
          ))}
        </div>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={handlePrevious}
              />
            </PaginationItem>

            {getPageRange(currentPage, totalPages).map((page, idx) => (
              <PaginationItem key={idx}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    className="cursor-pointer"
                    onClick={() => handlePageClick(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext className="cursor-pointer" onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
