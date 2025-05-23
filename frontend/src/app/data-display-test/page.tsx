"use client";

import React, { useState } from 'react';
import {
  PageContainer,
  Section,
  Grid,
  Flex,
  DataTable,
  Pagination,
  EmptyState,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonAvatar,
  Button
} from '@/components/ui';
import { 
  FileIcon, 
  PlusIcon, 
  SearchIcon,
  ArrowUpDown
} from 'lucide-react';

// Example data for DataTable
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const products: Product[] = [
  { id: '1', name: 'iPhone 14 Pro', category: 'Electronics', price: 999, stock: 45 },
  { id: '2', name: 'MacBook Air M2', category: 'Electronics', price: 1299, stock: 32 },
  { id: '3', name: 'iPad Pro', category: 'Electronics', price: 799, stock: 18 },
  { id: '4', name: 'AirPods Pro', category: 'Accessories', price: 249, stock: 56 },
  { id: '5', name: 'Apple Watch Series 8', category: 'Wearables', price: 399, stock: 27 },
  { id: '6', name: 'Magic Mouse', category: 'Accessories', price: 99, stock: 43 },
  { id: '7', name: 'Magic Keyboard', category: 'Accessories', price: 149, stock: 21 },
  { id: '8', name: 'iPhone 13', category: 'Electronics', price: 699, stock: 38 },
  { id: '9', name: 'HomePod Mini', category: 'Smart Home', price: 99, stock: 15 },
  { id: '10', name: 'Apple TV 4K', category: 'Smart Home', price: 179, stock: 24 },
];

const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <div className="flex items-center">
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return <div className="font-medium">${price.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = parseFloat(row.getValue('stock'));
      return (
        <div className="font-medium">
          {stock <= 20 ? (
            <span className="text-red-500">{stock}</span>
          ) : (
            stock
          )}
        </div>
      );
    },
  },
];

export default function DataDisplayTest() {
  // Pagination example state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <PageContainer maxWidth="2xl" className="mt-8 mb-32">
      <h1 className="text-3xl font-bold mb-8">Data Display & Layout Components</h1>
      
      <Grid gap={6}>
        {/* DataTable */}
        <Section 
          title="DataTable Component" 
          description="A table component with sorting, filtering, and pagination"
          className="mb-8"
        >
          <DataTable
            columns={columns}
            data={products}
            searchColumn="name"
            searchPlaceholder="Search products..."
            pagination={true}
            pageSize={5}
          />
        </Section>

        {/* Pagination */}
        <Section 
          title="Pagination Component" 
          description="Standalone pagination component"
          className="mb-8"
        >
          <Pagination
            totalItems={100}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemsPerPage={true}
          />
        </Section>

        {/* EmptyState */}
        <Grid cols={1} mdCols={2} gap={6} className="mb-8">
          <Section 
            title="EmptyState Component" 
            description="Used when there is no data to display"
          >
            <EmptyState
              icon={FileIcon}
              title="No products found"
              description="Try adjusting your search or filter to find what you're looking for."
              actionLabel="Add Product"
              actionIcon={PlusIcon}
              onAction={() => console.log('Add product clicked')}
            />
          </Section>

          <Section 
            title="EmptyState Variations" 
            description="Different configurations"
          >
            <Grid cols={1} gap={4}>
              <EmptyState
                icon={SearchIcon}
                title="No search results"
                description="Try adjusting your search term."
              />
              <EmptyState
                title="Simple Empty State"
                actionLabel="Take Action"
                onAction={() => console.log('Action clicked')}
              />
            </Grid>
          </Section>
        </Grid>

        {/* Skeletons */}
        <Section 
          title="Skeleton Loaders" 
          description="Used during loading states"
          className="mb-8"
        >
          <Grid cols={1} mdCols={2} gap={6}>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Text Skeleton</h3>
              <SkeletonText lines={3} />
              
              <h3 className="text-lg font-medium mt-6">Card Skeleton</h3>
              <SkeletonCard />
              
              <h3 className="text-lg font-medium mt-6">Avatar Skeleton</h3>
              <Flex gap={2}>
                <SkeletonAvatar />
                <SkeletonAvatar />
                <SkeletonAvatar />
              </Flex>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Table Skeleton</h3>
              <SkeletonTable rows={4} columns={3} />
            </div>
          </Grid>
        </Section>

        {/* Layout Components */}
        <Section 
          title="Layout Components" 
          description="Grid and Flex utilities"
          className="mb-8"
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Grid Layout</h3>
              <Grid cols={2} mdCols={3} lgCols={4} gap={4}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="h-24 bg-muted rounded flex items-center justify-center">
                    Grid Item {item}
                  </div>
                ))}
              </Grid>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Flex Layout</h3>
              <Flex direction="col" gap={4} className="mb-4">
                <Flex justify="between" align="center" className="bg-muted p-4 rounded">
                  <span>Justify Between</span>
                  <Button>Action</Button>
                </Flex>
                
                <Flex justify="center" gap={4} className="bg-muted p-4 rounded">
                  <Button variant="outline">Left</Button>
                  <Button>Center</Button>
                  <Button variant="outline">Right</Button>
                </Flex>
              </Flex>
            </div>
          </div>
        </Section>

        {/* Section Component */}
        <Section 
          title="Section Component" 
          description="A container with header and content"
          headerRight={<Button size="sm">Action</Button>}
          className="mb-8"
        >
          <p>
            This is a section component that provides a consistent layout for different
            parts of your page. It includes a title, optional description, and optional right-aligned actions.
          </p>
          <p className="mt-2">
            The content area can contain any components or elements.
          </p>
        </Section>

        {/* Page Container */}
        <Section 
          title="Page Container Variations" 
          description="Different max widths"
          className="mb-8"
        >
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded">
              <p className="text-center">Current Page Container: max-width-2xl</p>
            </div>
            <PageContainer maxWidth="sm" className="bg-muted p-4 rounded">
              <p className="text-center">max-width-sm</p>
            </PageContainer>
            <PageContainer maxWidth="lg" className="bg-muted p-4 rounded">
              <p className="text-center">max-width-lg</p>
            </PageContainer>
          </div>
        </Section>
      </Grid>
    </PageContainer>
  );
}
