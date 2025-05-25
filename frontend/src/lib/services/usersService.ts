import api from '../api';

export interface User {
  id: number;
  email: string;
  name: string;
  roleIds: number[];
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  roleIds?: number[];
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  roleIds?: number[];
}

// Users service functions
export const usersService = {
  /**
   * Get all users (ADMIN only)
   */
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  /**
   * Get a specific user by ID
   */
  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user (ADMIN only)
   */
  create: async (userData: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  /**
   * Update a user (ADMIN only)
   */
  update: async (id: number, userData: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete a user (ADMIN only)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  /**
   * Toggle user status (activate/deactivate)
   * Note: This might need to be implemented as an update with isActive field
   */
  toggleStatus: async (id: number, isActive: boolean): Promise<User> => {
    // Assuming we need to update a user status field
    // This may need adjustment based on actual backend implementation
    const response = await api.patch<User>(`/users/${id}`, { isActive });
    return response.data;
  }
};

export default usersService;
