import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPage?: boolean;
  className?: string;
  siblingCount?: number;
}

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 30, 50, 100],
  showItemsPerPage = true,
  className,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first page, last page, current page, and pages within siblingCount
    const firstPage = 1;
    const lastPage = totalPages;
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPage);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage);

    // Should show dots for left side
    const showLeftDots = leftSiblingIndex > firstPage + 1;
    // Should show dots for right side
    const showRightDots = rightSiblingIndex < lastPage - 1;
    
    if (!showLeftDots && showRightDots) {
      // If no left dots, show more pages from beginning
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: Math.min(leftItemCount, lastPage) }, (_, i) => i + 1);
      return [...leftRange, 'right-dots', lastPage];
    }
    
    if (showLeftDots && !showRightDots) {
      // If no right dots, show more pages from end
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: Math.min(rightItemCount, lastPage) }, 
        (_, i) => lastPage - rightItemCount + i + 1
      );
      return [firstPage, 'left-dots', ...rightRange];
    }
    
    if (showLeftDots && showRightDots) {
      // Show dots on both sides
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPage, 'left-dots', ...middleRange, 'right-dots', lastPage];
    }
    
    // Show all pages (few pages)
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  };
  
  const pages = generatePagination();

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      <div className="flex items-center text-sm text-muted-foreground">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
      
      <div className="flex items-center gap-2">
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm">Show</span>
            <select
              className="h-8 w-16 rounded-md border border-input bg-transparent px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {pages.map((page, index) => {
          if (page === 'left-dots' || page === 'right-dots') {
            return (
              <Button
                key={`dots-${index}`}
                variant="outline"
                size="sm"
                disabled
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }
          
          return (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
