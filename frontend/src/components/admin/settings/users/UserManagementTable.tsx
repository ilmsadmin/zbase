import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { DataTable, Button, Popover, Badge } from '@/components/ui';
import { UserRole } from '@/types';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

interface UserManagementTableProps {
  onEditUser: (user: User) => void;
  onToggleStatus: (userId: string, isActive: boolean) => Promise<void>;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '2',
    email: 'manager@example.com',
    firstName: 'Manager',
    lastName: 'User',
    role: UserRole.MANAGER,
    isActive: true,
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    id: '3',
    email: 'sales@example.com',
    firstName: 'Sales',
    lastName: 'Person',
    role: UserRole.SALES,
    isActive: false,
    createdAt: '2025-03-20T00:00:00Z',
  },
];

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'bg-red-100 text-red-800';
    case UserRole.MANAGER:
      return 'bg-blue-100 text-blue-800';
    case UserRole.INVENTORY:
      return 'bg-amber-100 text-amber-800';
    case UserRole.SALES:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export function UserManagementTable({ onEditUser, onToggleStatus }: UserManagementTableProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleToggleStatus = async (user: User) => {
    setLoadingUserId(user.id);
    try {
      await onToggleStatus(user.id, !user.isActive);
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, isActive: !u.isActive } : u
        )
      );
    } finally {
      setLoadingUserId(null);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessorFn: (row: User) => `${row.firstName} ${row.lastName}`,
      cell: (info: any) => <div className="font-medium">{info.getValue()}</div>,
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (info: any) => (
        <Badge
          className={`${getRoleBadgeColor(info.getValue())} text-xs px-2 py-1 rounded-full`}
        >
          {info.getValue()}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info: any) => {
        const user = info.row.original;
        return (
          <div className="flex items-center">
            <Switch
              checked={user.isActive}
              onChange={() => handleToggleStatus(user)}
              disabled={loadingUserId === user.id}
              className={`${
                user.isActive ? 'bg-green-500' : 'bg-gray-300'
              } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              <span
                className={`${
                  user.isActive ? 'translate-x-5' : 'translate-x-1'
                } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span className="ml-2 text-sm">
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: (info: any) => formatDate(info.getValue()),
    },
    {
      header: 'Actions',
      cell: (info: any) => {
        const user = info.row.original;
        return (
          <Popover
            trigger={
              <Button variant="ghost" size="icon">
                <MoreVertical size={16} />
              </Button>
            }
            align="end"
          >
            <div className="p-2 w-40">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm mb-1"
                onClick={() => onEditUser(user)}
              >
                <Edit size={14} className="mr-2" />
                Edit
              </Button>
              {/* Add more actions as needed */}
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
        data={users}
        searchPlaceholder="Search users..."
        searchColumn="email"
      />
    </div>
  );
}
