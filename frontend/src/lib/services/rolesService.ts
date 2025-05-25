import api from '../api';

export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  users?: User[];
  permissions?: Permission[];
  usersCount?: number;
  isSystem?: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  roleIds: number[];
}

export interface Permission {
  id: number;
  action: string;
  description?: string;
  resource?: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

// Roles service functions
export const rolesService = {
  /**
   * Get all roles
   */
  getAll: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>('/roles');
    return response.data;
  },

  /**
   * Get a specific role by ID
   */
  getById: async (id: number): Promise<Role> => {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  },

  /**
   * Create a new role (ADMIN only)
   */
  create: async (roleData: CreateRoleDto): Promise<Role> => {
    const response = await api.post<Role>('/roles', roleData);
    return response.data;
  },

  /**
   * Update a role (ADMIN only)
   */
  update: async (id: number, roleData: UpdateRoleDto): Promise<Role> => {
    const response = await api.patch<Role>(`/roles/${id}`, roleData);
    return response.data;
  },

  /**
   * Delete a role (ADMIN only)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },

  /**
   * Get users with a specific role
   */
  getRoleUsers: async (id: number): Promise<User[]> => {
    const response = await api.get<User[]>(`/roles/${id}/users`);
    return response.data;
  },

  /**
   * Get permissions for a specific role
   */
  getRolePermissions: async (id: number): Promise<Permission[]> => {
    const response = await api.get<Permission[]>(`/roles/${id}/permissions`);
    return response.data;
  }
};

export default rolesService;
