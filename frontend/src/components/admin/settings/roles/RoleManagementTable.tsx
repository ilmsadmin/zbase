import React, { useState } from 'react';
import { Edit, MoreVertical, Shield } from 'lucide-react';
import { DataTable, Button, Popover, Badge } from '@/components/ui';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  isSystem: boolean;
  createdAt: string;
}

interface RoleManagementTableProps {
  onEditRole: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
}

// Mock data for demonstration
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions',
    usersCount: 3,
    isSystem: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Access to manage inventory, sales and reports',
    usersCount: 5,
    isSystem: true,
    createdAt: '2025-01-05T00:00:00Z',
  },
  {
    id: '3',
    name: 'Sales',
    description: 'Access to POS and customer management',
    usersCount: 8,
    isSystem: true,
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Inventory',
    description: 'Manage products and inventory',
    usersCount: 4,
    isSystem: true,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '5',
    name: 'Support',
    description: 'Customer support and limited access',
    usersCount: 6,
    isSystem: false,
    createdAt: '2025-02-20T00:00:00Z',
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export function RoleManagementTable({ onEditRole, onManagePermissions }: RoleManagementTableProps) {
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  const columns = [
    {
      header: 'Role Name',
      accessorKey: 'name',
      cell: (info: any) => {
        const isSystem = info.row.original.isSystem;
        return (
          <div className="font-medium flex items-center">
            {info.getValue()}
            {isSystem && (
              <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
                System
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Users',
      accessorKey: 'usersCount',
      cell: (info: any) => (
        <Badge className="bg-gray-100 text-gray-800">
          {info.getValue()}
        </Badge>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: (info: any) => formatDate(info.getValue()),
    },
    {
      header: 'Actions',
      cell: (info: any) => {
        const role = info.row.original;
        return (
          <Popover
            trigger={
              <Button variant="ghost" size="icon">
                <MoreVertical size={16} />
              </Button>
            }
            align="end"
          >
            <div className="p-2 w-60">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm mb-1"
                onClick={() => onManagePermissions(role)}
              >
                <Shield size={14} className="mr-2" />
                Manage Permissions
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm mb-1"
                onClick={() => onEditRole(role)}
                disabled={role.isSystem}
              >
                <Edit size={14} className="mr-2" />
                {role.isSystem ? 'View Details' : 'Edit Role'}
              </Button>
            </div>
          </Popover>
        );
      },
    },
  ];

  return (
    <div className="bg-card rounded-md border border-border">
      <DataTable
        columns={columns}
        data={roles}
        searchPlaceholder="Search roles..."
        searchColumn="name"
      />
    </div>
  );
}
