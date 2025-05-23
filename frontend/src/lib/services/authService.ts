import api from '../api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  };
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  token?: string; // Only for testing purposes
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Auth service functions
export const authService = {  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<any>('/auth/login', credentials);
    
    // Map backend response structure to our expected AuthResponse format
    const responseData = response.data;
    
    // Check if the response has access_token instead of token and remap
    const mappedResponse = {
      token: responseData.access_token || responseData.token,
      refreshToken: responseData.refreshToken || responseData.refresh_token,
      user: responseData.user
    };
    
    console.log('Mapped API response:', mappedResponse);
    return mappedResponse;
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenData): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>('/auth/refresh', data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      // Call the API to invalidate the token on the backend
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with cleanup even if API call fails
    } finally {
      // Đảm bảo xóa token từ cả localStorage và sessionStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user');
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Request a password reset link
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to send password reset email');
      }
      throw new Error('Network error. Please try again later.');
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string): Promise<ResetPasswordResponse> => {
    try {
      const response = await api.post<ResetPasswordResponse>(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to reset password');
      }
      throw new Error('Network error. Please try again later.');
    }
  },
};
