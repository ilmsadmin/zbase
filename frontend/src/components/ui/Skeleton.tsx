import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
}

export function SkeletonText({ 
  lines = 3, 
  className,
  lineClassName,
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          className={cn(
            "h-4",
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full",
            lineClassName
          )} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return (
    <Skeleton className={cn("h-10 w-10 rounded-full", className)} />
  );
}

export function SkeletonImage({ className }: SkeletonProps) {
  return (
    <Skeleton className={cn("h-[200px] w-full rounded-md", className)} />
  );
}

export function SkeletonTable({ 
  rows = 5, 
  columns = 4,
  showHeader = true,
  className
}: { 
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("w-full border rounded-md overflow-hidden", className)}>
      <div className="w-full">
        {showHeader && (
          <div className="bg-muted/50 h-12 border-b px-4 flex items-center gap-4">
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={`header-${index}`} className="h-4 w-28" />
            ))}
          </div>
        )}
        
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex items-center h-16 px-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={cn(
                    "h-4",
                    colIndex === 0 ? "w-16" : "w-full max-w-28"
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
