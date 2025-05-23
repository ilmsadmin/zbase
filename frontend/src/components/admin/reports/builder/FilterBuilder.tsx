import { useState } from 'react';
import type { FilterOption, MetricOption } from '@/services/api/reports';
import { Button } from '@/components/ui';

interface FilterBuilderProps {
  filters: FilterOption[];
  metrics: MetricOption[];
  onAddFilter: (filter: FilterOption) => void;
  onRemoveFilter: (index: number) => void;
  onUpdateFilter: (index: number, filter: FilterOption) => void;
}

export default function FilterBuilder({
  filters,
  metrics,
  onAddFilter,
  onRemoveFilter,
  onUpdateFilter
}: FilterBuilderProps) {
  const [newFilter, setNewFilter] = useState<Partial<FilterOption>>({
    field: '',
    operator: 'equals',
    value: ''
  });

  const handleAddFilter = () => {
    if (!newFilter.field || newFilter.value === undefined || newFilter.value === '') {
      // Show error
      return;
    }

    onAddFilter(newFilter as FilterOption);
    setNewFilter({
      field: '',
      operator: 'equals',
      value: ''
    });
  };

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case 'equals':
        return 'Equal to';
      case 'notEquals':
        return 'Not equal to';
      case 'greaterThan':
        return 'Greater than';
      case 'lessThan':
        return 'Less than';
      case 'contains':
        return 'Contains';
      case 'between':
        return 'Between';
      default:
        return operator;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Current Filters</h3>
        {filters.length === 0 ? (
          <div className="text-gray-500 italic">No filters applied</div>
        ) : (
          <div className="space-y-2">
            {filters.map((filter, index) => {
              const metric = metrics.find(m => m.id === filter.field);
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-medium">{metric?.name || filter.field}</span>
                    <span className="text-gray-500 mx-2">{getOperatorLabel(filter.operator)}</span>
                    <span className="font-medium">
                      {filter.operator === 'between' 
                        ? `${filter.value} and ${filter.secondValue}` 
                        : filter.value}
                    </span>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => onRemoveFilter(index)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Add Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Field</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newFilter.field}
              onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
            >
              <option value="">Select field</option>
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newFilter.operator}
              onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value as any })}
            >
              <option value="equals">Equal to</option>
              <option value="notEquals">Not equal to</option>
              <option value="greaterThan">Greater than</option>
              <option value="lessThan">Less than</option>
              <option value="contains">Contains</option>
              <option value="between">Between</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter value"
              value={newFilter.value || ''}
              onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
            />
          </div>

          {newFilter.operator === 'between' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Second Value</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter second value"
                value={newFilter.secondValue || ''}
                onChange={(e) => setNewFilter({ ...newFilter, secondValue: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button onClick={handleAddFilter}>
            Add Filter
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button 
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-left"
            onClick={() => onAddFilter({
              field: 'revenue',
              operator: 'greaterThan',
              value: '1000'
            })}
          >
            <div className="font-medium">Revenue > $1,000</div>
            <div className="text-xs text-gray-500">Filter high-value transactions</div>
          </button>
          
          <button 
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-left"
            onClick={() => onAddFilter({
              field: 'stock_level',
              operator: 'lessThan',
              value: '10'
            })}
          >
            <div className="font-medium">Stock Level < 10</div>
            <div className="text-xs text-gray-500">Low stock items</div>
          </button>
          
          <button 
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-left"
            onClick={() => onAddFilter({
              field: 'order_count',
              operator: 'greaterThan',
              value: '5'
            })}
          >
            <div className="font-medium">Order Count > 5</div>
            <div className="text-xs text-gray-500">Frequent customers</div>
          </button>
        </div>
      </div>
    </div>
  );
}
