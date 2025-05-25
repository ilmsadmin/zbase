'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { RoleManagementTable } from '@/components/admin/settings/roles/RoleManagementTable';
import { RoleFormModal } from '@/components/admin/settings/roles/RoleFormModal';
import { PermissionMatrixModal } from '@/components/admin/settings/roles/PermissionMatrixModal';
import { Plus, RefreshCw } from 'lucide-react';
import rolesService, { type Role as ApiRole } from '@/lib/services/rolesService';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  isSystem: boolean;
  createdAt: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform API role data to frontend format
  const transformApiRole = (apiRole: ApiRole): Role => ({
    id: apiRole.id.toString(),
    name: apiRole.name,
    description: apiRole.description || '',
    usersCount: apiRole.usersCount || apiRole.users?.length || 0,
    isSystem: apiRole.isSystem || false,
    createdAt: apiRole.createdAt,
  });

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiRoles = await rolesService.getAll();
      const transformedRoles = apiRoles.map(transformApiRole);
      setRoles(transformedRoles);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Không thể tải danh sách vai trò. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRefresh = () => {
    fetchRoles();
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };
  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  };

  // Show error message if there's an error
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={handleRefresh}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quản lý vai trò</h2>
        <div className="flex gap-2">          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Thêm vai trò
          </Button>
        </div>
      </div>      <RoleManagementTable 
        roles={roles}
        onEditRole={handleEditRole}
        onManagePermissions={handleManagePermissions}
      />      <RoleFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm vai trò mới"
        onSuccess={fetchRoles}
      />

      {selectedRole && (
        <>          <RoleFormModal
            open={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedRole(null);
            }}
            title="Chỉnh sửa vai trò"
            role={selectedRole}
            onSuccess={fetchRoles}
          />
          
          <PermissionMatrixModal
            open={isPermissionModalOpen}
            onClose={() => {
              setIsPermissionModalOpen(false);
              setSelectedRole(null);
            }}
            role={selectedRole}
          />
        </>
      )}
    </div>
  );
}
