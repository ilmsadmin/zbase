import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FormInput } from '@/components/ui/FormInput';
import { partnersApi } from '@/services/api/partners';

interface PartnerSearchProps {
  onSelect: (partnerId: string, partnerName?: string) => void;
  initialValue?: string;
}

export function PartnerSearch({ onSelect, initialValue }: PartnerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  // Fetch partners based on search term
  const { data, isLoading } = useQuery({
    queryKey: ['partnerSearch', searchTerm],
    queryFn: () => partnersApi.getPartners({ search: searchTerm }),
    enabled: searchTerm.length > 2,
  });

  // If an initial value is provided, try to fetch the partner details
  useEffect(() => {
    if (initialValue) {
      // Logic to fetch partner details by ID would go here
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

  const handleSelect = (partner: any) => {
    onSelect(partner.id, partner.name);
    setSearchTerm(partner.name);
    setIsResultsVisible(false);
  };

  return (
    <div className="relative">
      <FormInput
        placeholder="Search partners by name, phone, or email"
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
            <div className="p-2 text-center text-gray-500">No partners found</div>
          ) : (
            <ul>
              {searchResults.map((partner) => (
                <li
                  key={partner.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(partner)}
                >
                  <div className="font-medium">{partner.name}</div>
                  <div className="text-xs text-gray-500">
                    {partner.phone && (
                      <span className="mr-2">
                        Phone: {partner.phone}
                      </span>
                    )}
                    {partner.email && (
                      <span>
                        Email: {partner.email}
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
