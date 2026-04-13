"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ page, totalPages, onPageChange, siblingCount = 1, className = "", ...props }, ref) => {
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];

      // Always show first page
      pages.push(1);

      // Show siblings around current page
      const leftSibling = Math.max(2, page - siblingCount);
      const rightSibling = Math.min(totalPages - 1, page + siblingCount);

      // Add left ellipsis if needed
      if (leftSibling > 2) {
        pages.push("...");
      }

      // Add sibling pages
      for (let i = leftSibling; i <= rightSibling; i++) {
        pages.push(i);
      }

      // Add right ellipsis if needed
      if (rightSibling < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }

      return pages;
    };

    const pages = getPageNumbers();

    return (
      <div
        ref={ref}
        className={`flex items-center justify-center gap-2 ${className}`}
        {...props}
      >
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Anterior
        </Button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {pages.map((p, index) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-slate-600">
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 rounded transition-colors ${
                  page === pageNum
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Próximo
        </Button>

        {/* Page Info */}
        <span className="text-sm text-slate-600 ml-4">
          Página {page} de {totalPages}
        </span>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";
