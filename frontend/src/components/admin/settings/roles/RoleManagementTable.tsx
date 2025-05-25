import React from 'react';
import { Edit, MoreVertical, Shield } from 'lucide-react';
import { DataTable, Button, Badge } from '@/components/ui';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  isSystem: boolean;
  createdAt: string;
}

interface RoleManagementTableProps {
  roles: Role[];
  onEditRole: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export function RoleManagementTable({ roles, onEditRole, onManagePermissions }: RoleManagementTableProps) {

  const columns = [    {
      header: 'Tên vai trò',
      accessorKey: 'name',
      cell: (info: any) => {
        const isSystem = info.row.original.isSystem;
        return (
          <div className="font-medium flex items-center">
            {info.getValue()}
            {isSystem && (
              <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
                Hệ thống
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Mô tả',
      accessorKey: 'description',
    },
    {
      header: 'Người dùng',
      accessorKey: 'usersCount',
      cell: (info: any) => (
        <Badge className="bg-gray-100 text-gray-800">
          {info.getValue()}
        </Badge>
      ),
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: (info: any) => formatDate(info.getValue()),
    },
    {
      header: 'Thao tác',
      cell: (info: any) => {
        const role = info.row.original;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm mb-1"
                onClick={() => onManagePermissions(role)}
              >
                <Shield size={14} className="mr-2" />
                Quản lý quyền
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm mb-1"
                onClick={() => onEditRole(role)}
                disabled={role.isSystem}
              >
                <Edit size={14} className="mr-2" />
                {role.isSystem ? 'Xem chi tiết' : 'Chỉnh sửa vai trò'}
              </Button>
            </PopoverContent>
          </Popover>
        );
      },
    },
  ];

  return (
    <div className="bg-card rounded-md border border-border">      <DataTable
        columns={columns}
        data={roles}
        searchPlaceholder="Tìm kiếm vai trò..."
        searchColumn="name"
      />
    </div>
  );
}
