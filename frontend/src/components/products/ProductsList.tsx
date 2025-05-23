"use client";

import { useProducts } from '@/hooks/useProducts';
import { LoadingState } from '@/lib/react-query/hooks';

export function ProductsList() {
  // Using our custom hook with React Query
  const { data, isLoading, isError, error } = useProducts({
    limit: 10,
    page: 1
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
      
      {/* Loading and error handling component */}
      <LoadingState isLoading={isLoading} isError={isError} error={error}>
        <div className="grid gap-4">
          {data?.items?.map(product => (
            <div 
              key={product.id} 
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <span className="font-bold text-emerald-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(product.price)}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <span className="mr-4">SKU: {product.sku}</span>
                {product.barcode && <span>Barcode: {product.barcode}</span>}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Hiển thị {data?.items?.length || 0} / {data?.total || 0} sản phẩm
        </div>
      </LoadingState>
    </div>
  );
}
