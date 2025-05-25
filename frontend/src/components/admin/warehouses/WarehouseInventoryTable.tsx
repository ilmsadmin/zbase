"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  locationName?: string;
  locationCode?: string;
  unitCost?: number;
  totalValue?: number;
}

interface WarehouseInventoryTableProps {
  inventory: InventoryItem[];
}

export function WarehouseInventoryTable({ inventory }: WarehouseInventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter inventory items based on search term
  const filteredItems = inventory.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.locationName && item.locationName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Calculate total inventory value
  const totalValue = inventory.reduce((sum, item) => sum + (item.totalValue || 0), 0);
  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <div className="text-sm">
            <p>              <span className="font-medium">{totalItems}</span> sản phẩm | 
              <span className="font-medium ml-1">{totalQuantity}</span> tổng số lượng |
              <span className="font-medium ml-1">{formatCurrency(totalValue)}</span> giá trị
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">              <th className="px-6 py-3">Sản phẩm</th>
              <th className="px-6 py-3">Mã SKU</th>
              <th className="px-6 py-3">Vị trí</th>
              <th className="px-6 py-3 text-right">Số lượng</th>
              <th className="px-6 py-3 text-right">Đơn giá</th>
              <th className="px-6 py-3 text-right">Tổng giá trị</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {item.locationName ? `${item.locationName} (${item.locationCode})` : 'Chưa gán vị trí'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-500">
                      {item.unitCost ? formatCurrency(item.unitCost) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium">
                      {item.totalValue ? formatCurrency(item.totalValue) : '-'}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {inventory.length === 0 ? 'Không tìm thấy sản phẩm nào trong kho hàng này.' : 'Không có sản phẩm nào phù hợp với tìm kiếm của bạn.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredItems.length > 10 && (
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Button variant="outline" size="sm">Tải thêm</Button>
        </div>
      )}
    </Card>
  );
}
