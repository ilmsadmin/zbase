'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { RoleManagementTable } from '@/components/admin/settings/roles/RoleManagementTable';
import { RoleFormModal } from '@/components/admin/settings/roles/RoleFormModal';
import { PermissionMatrixModal } from '@/components/admin/settings/roles/PermissionMatrixModal';
import { Plus, RefreshCw } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
}

export default function RolesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Role Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLoading(true)}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Add Role
          </Button>
        </div>
      </div>

      <RoleManagementTable 
        onEditRole={handleEditRole}
        onManagePermissions={handleManagePermissions}
      />

      <RoleFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Role"
      />

      {selectedRole && (
        <>
          <RoleFormModal
            open={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedRole(null);
            }}
            title="Edit Role"
            role={selectedRole}
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
