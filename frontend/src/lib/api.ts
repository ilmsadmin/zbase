import axios from 'axios';
import { getCookie, setCookie } from '@/utils/cookies';

// Tạo một instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor request
api.interceptors.request.use(
  (config) => {
    // Thêm token xác thực vào header nếu có - kiểm tra cả localStorage, sessionStorage và cookies
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || getCookie('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;      try {
        // Thử refresh token - kiểm tra cả localStorage và sessionStorage
        const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
            { refreshToken }
          );
          
          const { token } = response.data;
          
          // Lưu token vào đúng storage mà người dùng đã dùng trước đó
          if (localStorage.getItem('refresh_token')) {
            localStorage.setItem('auth_token', token);
          } else {
            sessionStorage.setItem('auth_token', token);
          }
          
          // Also update the cookie
          setCookie('auth_token', token);
          
          // Thực hiện lại request với token mới
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        }
      }catch (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error
      ) {        // Nếu refresh token thất bại, xóa token từ cả localStorage và sessionStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
