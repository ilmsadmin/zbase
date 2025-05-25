"use client";

import { useState } from 'react';
import { useWarehouseLocations } from '@/hooks/useWarehouses';
import { WarehouseLocation } from '@/lib/services/warehousesService';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingState } from '@/lib/react-query/hooks';
import { LocationForm } from './LocationForm';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  PlusIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';

interface LocationItemProps {
  location: WarehouseLocation;
  locations: WarehouseLocation[];
  onAddChild: (parentId: string) => void;
  onEdit: (location: WarehouseLocation) => void;
  onDelete: (location: WarehouseLocation) => void;
}

function LocationItem({ location, locations, onAddChild, onEdit, onDelete }: LocationItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Get child locations
  const children = locations.filter(loc => loc.parentId === location.id);
  const hasChildren = children.length > 0;
    const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ZONE': return 'Khu vực';
      case 'AISLE': return 'Lối đi';
      case 'RACK': return 'Kệ';
      case 'SHELF': return 'Ngăn';
      case 'BIN': return 'Thùng';
      default: return type;
    }
  };
  
  return (
    <div className="mb-1">
      <div className="flex items-center p-2 hover:bg-gray-50 rounded-md">
        <button 
          className="w-6 h-6 flex-shrink-0 flex items-center justify-center mr-1"
          onClick={() => setExpanded(!expanded)}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            expanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />
          ) : <span className="w-4 h-4"></span>}
        </button>
        
        <div className="flex-grow flex items-center">
          <span className="font-medium">{location.name}</span>
          <span className="ml-2 text-sm text-gray-500">[{location.code}]</span>
          <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
            {getTypeLabel(location.type)}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onAddChild(location.id)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onEdit(location)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
            onClick={() => onDelete(location)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="pl-6 border-l border-gray-200 ml-3">
          {children.map(child => (
            <LocationItem 
              key={child.id} 
              location={child} 
              locations={locations}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface LocationTreeProps {
  warehouseId: string;
}

export function LocationTree({ warehouseId }: LocationTreeProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<WarehouseLocation | null>(null);
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  
  // Fetch locations
  const { 
    data: locations, 
    isLoading, 
    isError, 
    error 
  } = useWarehouseLocations({
    warehouseId,
  });
  
  // Root locations (no parent)
  const rootLocations = locations?.items.filter(loc => !loc.parentId) || [];
  
  const handleAddRoot = () => {
    setSelectedLocation(null);
    setParentId(undefined);
    setShowForm(true);
  };
  
  const handleAddChild = (parentLocId: string) => {
    setSelectedLocation(null);
    setParentId(parentLocId);
    setShowForm(true);
  };
  
  const handleEdit = (location: WarehouseLocation) => {
    setSelectedLocation(location);
    setParentId(undefined);
    setShowForm(true);
  };
  
  const handleDelete = (location: WarehouseLocation) => {
    // Implement delete confirmation later
    console.log('Delete location:', location);
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setSelectedLocation(null);
    setParentId(undefined);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">        <CardTitle>Vị trí kho hàng</CardTitle>
        <Button onClick={handleAddRoot} className="flex items-center">
          <PlusIcon className="h-4 w-4 mr-2" />
          Thêm vị trí gốc
        </Button>
      </CardHeader>
      <CardContent>
        <LoadingState isLoading={isLoading} isError={isError} error={error}>
          {rootLocations.length > 0 ? (
            <div className="border rounded-md p-2 bg-gray-50">
              {rootLocations.map(location => (
                <LocationItem 
                  key={location.id} 
                  location={location}
                  locations={locations?.items || []}
                  onAddChild={handleAddChild}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">Chưa có vị trí nào được xác định.</p>
              <Button onClick={handleAddRoot}>Thêm vị trí đầu tiên</Button>
            </div>
          )}
        </LoadingState>
        
        {/* Location form modal */}
        {showForm && (
          <LocationForm 
            isOpen={showForm} 
            onClose={handleFormClose} 
            warehouseId={warehouseId}
            location={selectedLocation}
            parentId={parentId}
          />
        )}
      </CardContent>
    </Card>
  );
}
