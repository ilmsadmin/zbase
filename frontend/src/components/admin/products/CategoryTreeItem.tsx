import React, { useState } from 'react';
import { ProductCategory } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CategoryTreeItemProps {
  category: ProductCategory;
  level: number;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
  onDragStart: (category: ProductCategory) => void;
  onDrop: (targetCategory: ProductCategory) => void;
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

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div
        className={`
          p-4 flex items-center border-b last:border-b-0 
          ${isDragging ? 'opacity-50 bg-blue-50' : ''}
          ${level > 0 ? 'pl-' + (level * 8 + 4) + 'px' : ''}
        `}
        draggable
        onDragStart={() => onDragStart(category)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDrop(category)}
      >
        <div className="grid grid-cols-12 gap-4 w-full items-center">
          <div className="col-span-6 flex items-center">
            {hasChildren && (
              <button
                type="button"
                className="mr-2 text-gray-500 hover:text-gray-700"
                onClick={handleToggle}
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>
            )}
            <div className="font-medium">{category.name}</div>
            {!category.isActive && (
              <Badge variant="gray" className="ml-2">Inactive</Badge>
            )}
          </div>
          <div className="col-span-3">
            <span className="text-gray-600">
              {/* This would come from a real count in a production app */}
              {Math.floor(Math.random() * 20)} products
            </span>
          </div>
          <div className="col-span-3 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(category)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(category)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Drop zone between categories */}
      <div 
        className={`h-2 ${isDragging ? 'bg-blue-100' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.stopPropagation();
          onDrop(category);
        }}
      />

      {/* Children */}
      {isExpanded && hasChildren && category.children?.map((child) => (
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
    </>
  );
}
