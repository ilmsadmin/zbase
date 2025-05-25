import api from '../api';

export interface Permission {
  id: number;
  action: string;
  description?: string;
  resource?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

// Permissions service functions
export const permissionsService = {
  /**
   * Get all permissions
   */
  getAll: async (): Promise<Permission[]> => {
    const response = await api.get<Permission[]>('/permissions');
    return response.data;
  },

  /**
   * Get permissions for a specific role
   */
  getByRoleId: async (roleId: number): Promise<Permission[]> => {
    const response = await api.get<Permission[]>(`/permissions/role/${roleId}`);
    return response.data;
  },

  /**
   * Assign permission to role (ADMIN only)
   */
  assignToRole: async (roleId: number, permissionId: number): Promise<void> => {
    await api.post(`/permissions/role/${roleId}/permission/${permissionId}`);
  },

  /**
   * Remove permission from role (ADMIN only)
   */
  removeFromRole: async (roleId: number, permissionId: number): Promise<void> => {
    await api.delete(`/permissions/role/${roleId}/permission/${permissionId}`);
  },

  /**
   * Get user permissions
   */
  getUserPermissions: async (userId: number): Promise<Permission[]> => {
    const response = await api.get<Permission[]>(`/permissions/user/${userId}`);
    return response.data;
  },

  /**
   * Update permission (ADMIN only)
   */
  update: async (id: number, updateData: { action?: string; description?: string }): Promise<Permission> => {
    const response = await api.put<Permission>(`/permissions/${id}`, updateData);
    return response.data;
  }
};

export default permissionsService;
