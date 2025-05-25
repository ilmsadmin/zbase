"use client";

import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/lib/services/authService';
import { setCookie, deleteCookie, getCookie } from '@/utils/cookies';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isCheckingAuth: boolean; // Flag to prevent multiple checkAuth calls
  
  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{success: boolean}>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isCheckingAuth: false,

  login: async (email: string, password: string, rememberMe = false) => {
    set({ isLoading: true, error: null });
    
    try {
      // Call the real API
      const response = await authService.login({ email, password });      // Map the response to our User type
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.name.split(' ')[0],
        lastName: response.user.name.split(' ').slice(1).join(' '),
        role: response.user.roles && response.user.roles.length > 0 ? response.user.roles[0] : 'CASHIER', // Map from roles array to single role
        permissions: response.user.permissions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage if rememberMe is true, otherwise session storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_token', response.token);
      storage.setItem('refresh_token', response.refreshToken);
      storage.setItem('user', JSON.stringify(user));
      
      // Set cookies for middleware authentication
      setCookie('auth_token', response.token, rememberMe ? 7 : undefined); // 7 days if remember me, session cookie otherwise
      
      set({
        user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      set({
        error: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
        isLoading: false
      });
      return { success: false };
    }
  },

  logout: async () => {
    try {
      // Call the real logout API
      await authService.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear storage regardless of API success/failure
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('refresh_token');
      
      // Delete auth cookie
      deleteCookie('auth_token');
      
      // Update state
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isCheckingAuth: false
      });

      // Redirect to login page if in browser context
      if (typeof window !== 'undefined') {
        // Use replace instead of href to avoid adding to history
        window.location.replace('/login');
      }
    }
  },
    checkAuth: async () => {
    // Prevent multiple simultaneous checkAuth calls
    const currentState = get();
    if (currentState.isCheckingAuth) {
      console.log('🔄 [AuthStore] checkAuth already in progress, skipping...');
      return;
    }

    // If already authenticated, no need to check again
    if (currentState.isAuthenticated && currentState.user && currentState.token) {
      console.log('✅ [AuthStore] Already authenticated, skipping checkAuth');
      return;
    }

    console.log('🔍 [AuthStore] Starting checkAuth...');
    set({ isLoading: true, isCheckingAuth: true });
    
    try {
      // Check for token in localStorage, sessionStorage, and cookies
      const token = localStorage.getItem('auth_token') || 
                   sessionStorage.getItem('auth_token') || 
                   getCookie('auth_token');
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      console.log('🔍 [AuthStore] Token and user check:', {
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        hasStoredUser: !!storedUser,
        tokenLength: token?.length || 0,
        tokenSource: token === localStorage.getItem('auth_token') ? 'localStorage' : 
                    token === sessionStorage.getItem('auth_token') ? 'sessionStorage' : 
                    token === getCookie('auth_token') ? 'cookie' : 'none'
      });

      if (token && storedUser) {
        try {
          console.log('🔍 [AuthStore] Validating token with getProfile...');
          // Validate token by getting current user profile
          const profile = await authService.getProfile();
          console.log('🔍 [AuthStore] getProfile response:', profile);
            const user = JSON.parse(storedUser) as User;
          
          // Update user with data from profile response
          if (profile) {
            // Update permissions if available
            if (profile.permissions) {
              user.permissions = profile.permissions;
            }
            
            // Update role if roles array is available and user doesn't have a role yet
            if (!user.role && profile.roles && profile.roles.length > 0) {
              user.role = profile.roles[0];
            }
          }
          
          // Nếu profile trả về khác null thì token hợp lệ
          console.log('✅ [AuthStore] Auth check successful, profile:', profile);
          
          // Update user in storage
          const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
          storage.setItem('user', JSON.stringify(user));
          
          // Ensure cookie is set
          setCookie('auth_token', token);
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            isCheckingAuth: false
          });

        } catch (error) {
          console.error("❌ [AuthStore] Token validation failed:", error);
          // Token validation failed, clear storage and state
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('refresh_token');
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('refresh_token');
          
          // Also delete the cookie
          deleteCookie('auth_token');
          
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            isCheckingAuth: false
          });
        }

      } else if (token && !storedUser) {
        // We have token but no stored user - get user from API
        try {
          console.log('🔍 [AuthStore] Have token but no stored user, fetching profile...');
          
          // Determine storage location and store token
          const isFromCookie = token === getCookie('auth_token');
          const storage = isFromCookie ? localStorage : 
                         (token === localStorage.getItem('auth_token') ? localStorage : sessionStorage);
          
          // Only store token if it's not already in storage
          if (!storage.getItem('auth_token')) {
            storage.setItem('auth_token', token);
            setCookie('auth_token', token);
          }
          
          const profile = await authService.getProfile();
          console.log('🔍 [AuthStore] Profile fetched successfully:', profile);
            // Create user object from profile
          const user: User = {
            id: profile.id,
            email: profile.email,
            firstName: profile.name?.split(' ')[0] || profile.email.split('@')[0],
            lastName: profile.name?.split(' ').slice(1).join(' ') || '',
            role: profile.roles && profile.roles.length > 0 ? profile.roles[0] : 'CASHIER', // Map from roles array to single role
            permissions: profile.permissions || [],
            createdAt: profile.createdAt || new Date().toISOString(),
            updatedAt: profile.updatedAt || new Date().toISOString()
          };
          
          // Store user data
          storage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            isCheckingAuth: false
          });

        } catch (error) {
          console.error("❌ [AuthStore] Failed to fetch profile with token:", error);
          // Clear invalid token
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          deleteCookie('auth_token');
          
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            isCheckingAuth: false
          });
        }

      } else {
        console.log('❌ [AuthStore] No token or stored user found');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          isCheckingAuth: false
        });
      }

    } catch (error) {
      console.error('Auth check error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isCheckingAuth: false
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
