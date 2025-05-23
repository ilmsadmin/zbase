import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FormInput } from '@/components/ui/FormInput';
import { customersApi } from '@/services/api/customers';

interface CustomerSearchProps {
  onSelect: (customerId: string, customerName?: string) => void;
  initialValue?: string;
}

export function CustomerSearch({ onSelect, initialValue }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  // Fetch customers based on search term
  const { data, isLoading } = useQuery({
    queryKey: ['customerSearch', searchTerm],
    queryFn: () => customersApi.getCustomers({ search: searchTerm }),
    enabled: searchTerm.length > 2,
  });

  // If an initial value is provided, try to fetch the customer details
  useEffect(() => {
    if (initialValue) {
      // Logic to fetch customer details by ID would go here
    }
  }, [initialValue]);

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

  const handleSelect = (customer: any) => {
    onSelect(customer.id, customer.name);
    setSearchTerm(customer.name);
    setIsResultsVisible(false);
  };

  return (
    <div className="relative">      <FormInput
        name="customerSearch"
        placeholder="Search customers by name, phone, or email"
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
            <div className="p-2 text-center text-gray-500">No customers found</div>
          ) : (
            <ul>
              {searchResults.map((customer) => (
                <li
                  key={customer.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(customer)}
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-xs text-gray-500">
                    {customer.phone && (
                      <span className="mr-2">
                        Phone: {customer.phone}
                      </span>
                    )}
                    {customer.email && (
                      <span>
                        Email: {customer.email}
                      </span>
                    )}
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
