import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  headerClassName?: string;
  headerRight?: React.ReactNode;
  contentClassName?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Section({
  children,
  className,
  title,
  titleClassName,
  description,
  descriptionClassName,
  headerClassName,
  headerRight,
  contentClassName,
  padding = 'md',
}: SectionProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hasHeader = title || description || headerRight;
  
  return (
    <div
      className={cn(
        "bg-background border rounded-lg shadow-sm",
        paddingClasses[padding],
        className
      )}
    >
      {hasHeader && (
        <div className={cn(
          "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6",
          headerClassName
        )}>
          <div>
            {title && (
              <h2 className={cn(
                "text-xl font-medium tracking-tight",
                titleClassName
              )}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn(
                "mt-1 text-sm text-muted-foreground",
                descriptionClassName
              )}>
                {description}
              </p>
            )}
          </div>
          
          {headerRight && (
            <div className="flex-shrink-0 flex items-center">
              {headerRight}
            </div>
          )}
        </div>
      )}
      
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
}
