'use client';

import { useState } from 'react';
import { Button, DataTable, Modal, Section } from '@/components/ui';
import { UserManagementTable } from '@/components/admin/settings/users/UserManagementTable';
import { UserFormModal } from '@/components/admin/settings/users/UserFormModal';
import { UserRole } from '@/types';
import { Plus, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

export default function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      // Call API to update user status
      console.log(`Toggling user ${userId} status to ${isActive ? 'active' : 'inactive'}`);
      // Refresh user list after update
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error toggling user status:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
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
            Add User
          </Button>
        </div>
      </div>

      <UserManagementTable 
        onEditUser={handleEditUser}
        onToggleStatus={handleToggleUserStatus}
      />

      <UserFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New User"
      />

      {selectedUser && (
        <UserFormModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          title="Edit User"
          user={selectedUser}
        />
      )}
    </div>
  );
}
