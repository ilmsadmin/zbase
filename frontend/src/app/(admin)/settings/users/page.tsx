'use client';

import { useState, useEffect } from 'react';
import { Button, DataTable, Modal, Section } from '@/components/ui';
import { UserManagementTable } from '@/components/admin/settings/users/UserManagementTable';
import { UserFormModal } from '@/components/admin/settings/users/UserFormModal';
import { UserRole } from '@/types';
import usersService, { type User as ApiUser } from '@/lib/services/usersService';
import { Plus, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUsers = await usersService.getAll();      // Transform API users to component format
      const transformedUsers: User[] = apiUsers.map((apiUser: ApiUser) => ({
        id: apiUser.id.toString(),
        email: apiUser.email,
        firstName: apiUser.name.split(' ')[0] || '',
        lastName: apiUser.name.split(' ').slice(1).join(' ') || '',
        role: mapBackendRoleToUserRole(apiUser.roleIds),
        isActive: true, // Default to true, might need to be added to backend
        createdAt: apiUser.createdAt,
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };
  // Helper function to map backend role IDs to UserRole enum
  const mapBackendRoleToUserRole = (roleIds: number[] | undefined | null): UserRole => {
    // Handle cases where roleIds is undefined, null, or empty
    if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
      return UserRole.CASHIER; // Default role
    }
    
    // This mapping might need adjustment based on actual backend role structure
    // For now, assuming role ID 1 = ADMIN, 2 = MANAGER, etc.
    if (roleIds.includes(1)) return UserRole.ADMIN;
    if (roleIds.includes(2)) return UserRole.MANAGER;
    if (roleIds.includes(3)) return UserRole.INVENTORY;
    if (roleIds.includes(4)) return UserRole.CASHIER;
    return UserRole.CASHIER; // Default
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      await usersService.toggleStatus(parseInt(userId), isActive);
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isActive } : user
        )
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError('Failed to update user status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserCreated = () => {
    setIsCreateModalOpen(false);
    loadUsers(); // Refresh the list
  };

  const handleUserUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    loadUsers(); // Refresh the list
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
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
            Thêm người dùng
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}      <UserManagementTable 
        users={users}
        onEditUser={handleEditUser}
        onToggleStatus={handleToggleUserStatus}
      />      <UserFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm người dùng mới"
      />      {selectedUser && (
        <UserFormModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          title="Chỉnh sửa người dùng"
          user={selectedUser}
        />
      )}
    </div>
  );
}
