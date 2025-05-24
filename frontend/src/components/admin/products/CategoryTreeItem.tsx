import React, { useState } from 'react';
import { ProductCategory } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CategoryTreeItemProps {
  category: ProductCategory;
  level: number;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
  onDragStart: (category: ProductCategory) => void;
  onDrop: (targetCategory: ProductCategory | null) => void;
  isDragging: boolean;
}

export function CategoryTreeItem({
  category,
  level,
  onEdit,
  onDelete,
  onDragStart,
  onDrop,
  isDragging,
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <>      <div 
        className={`relative ${isDragging ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}
        draggable
        onDragStart={() => onDragStart(category)}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDrop(category);
        }}
      >
        {/* Left border indicator for nesting level */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            isDragging ? 'bg-blue-500' : 'bg-transparent'
          } transition-colors`}
          style={{ left: `${level * 4}px` }}
        />

        <div className="px-4 py-2" style={{ marginLeft: `${level * 24}px` }}>
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-6 flex items-center gap-2">
              <div className="flex items-center min-w-[24px]">
                {hasChildren ? (
                  <button 
                    onClick={handleToggle}
                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-md transition-colors"
                    title={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <div className="w-6" /> 
                )}                <div className="flex items-center gap-2">
                  <span className="font-medium">{category.name}</span>
                  {category.parentId && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">sub-category</span>
                  )}
                  {hasChildren && (
                    <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                      {category._count?.children} {category._count?.children === 1 ? 'subcategory' : 'subcategories'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{category._count?.products || 0}</span>
                <span className="text-sm text-gray-500">
                  {category._count?.products === 1 ? 'product' : 'products'}
                </span>
              </div>
            </div>
            
            <div className="col-span-3 flex justify-end items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(category)}
                className="text-gray-600 hover:text-gray-900"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category)}
                disabled={hasChildren}
                className={
                  hasChildren 
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-red-600 hover:text-red-700 hover:bg-red-50"
                }
                title={hasChildren ? "Remove subcategories first" : "Delete category"}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="category-children">
          {category.children?.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDrop={onDrop}
              isDragging={isDragging}
            />
          ))}
        </div>
      )}
    </>
  );
}
