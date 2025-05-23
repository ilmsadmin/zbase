import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FormInput } from '@/components/ui/FormInput';
import { productsApi } from '@/services/api/products';

interface ProductSearchProps {
  onSelect: (productId: string) => void;
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  // Fetch products based on search term
  const { data, isLoading } = useQuery({
    queryKey: ['productSearch', searchTerm],
    queryFn: () => productsApi.getProducts({ search: searchTerm }),
    enabled: searchTerm.length > 2,
  });

  // Update search results when data changes
  useEffect(() => {
    if (data?.data) {
      setSearchResults(data.data);
    }
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSelect = (productId: string) => {
    onSelect(productId);
    setSearchTerm('');
    setIsResultsVisible(false);
  };

  return (
    <div className="relative">
      <FormInput
        placeholder="Search products by name, SKU, or barcode"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsResultsVisible(true)}
        onBlur={() => {
          // Delay hiding results to allow clicks to register
          setTimeout(() => setIsResultsVisible(false), 200);
        }}
      />
      {isResultsVisible && searchTerm.length > 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">Loading...</div>
          ) : searchResults.length === 0 ? (
            <div className="p-2 text-center text-gray-500">No products found</div>
          ) : (
            <ul>
              {searchResults.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelect(product.id)}
                >
                  <div>
                    <div>{product.name}</div>
                    <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${product.price.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
