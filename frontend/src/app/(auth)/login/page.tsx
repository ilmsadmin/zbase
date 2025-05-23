'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@/types';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { setCookie } from '@/utils/cookies';

// Create a schema for form validation
const loginFormSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().optional().default(false),
});

// Define the form values type
type LoginFormValues = z.infer<typeof loginFormSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  const { handleSubmit, formState: { errors }, register } = methods;
  
  const { login, isAuthenticated, isLoading, error, clearError, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  
  // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang login
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated, redirecting...");
      // Nếu đã đăng nhập, tự động chuyển hướng đến trang admin
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push("/admin");
      }
    }
  }, [isAuthenticated, isLoading, user, router, callbackUrl]);
  
  const onSubmit = async (data: LoginFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Attempting login with:", { email: data.email, rememberMe: data.rememberMe });
      const result = await login(data.email, data.password, data.rememberMe);
      
      if (result.success) {
        setTimeout(() => {
          // Sử dụng window.location.replace thay vì .href để tránh thêm vào history
          window.location.replace('/admin');
        }, 500);
      } else {
        // Display error in the UI instead of alert
        clearError();
        clearError(); // Call twice to ensure the error state is reset before setting a new error
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Set error message in the UI
      clearError();
      setError(err instanceof Error ? err.message : 'Không thể kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Hàm xử lý đăng nhập thủ công nếu phương thức bình thường không hoạt động
  const handleManualLogin = async () => {
    const email = methods.getValues("email");
    const password = methods.getValues("password");
    const rememberMe = methods.getValues("rememberMe");
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Kết nối trực tiếp với API backend ở cổng 3001
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Lưu token và user info
        if (rememberMe) {
          localStorage.setItem('auth_token', data.token || data.access_token);
          localStorage.setItem('refresh_token', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('auth_token', data.token || data.access_token);
          sessionStorage.setItem('refresh_token', data.refreshToken);
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Set cookie for middleware
        setCookie('auth_token', data.token || data.access_token, rememberMe ? 7 : undefined);
        
        // Chuyển hướng sau một khoảng thời gian ngắn để đảm bảo state được cập nhật
        setTimeout(() => {
          // Sử dụng window.location.replace để tránh thêm vào history
          window.location.replace("/admin");
        }, 500);
      } else {
        // Display error in the UI
        console.error("Login failed:", data);
        clearError();
        setError(data.message || 'Không thể kết nối với server');
      }
    } catch (err) {
      console.error("Manual login error:", err);
      clearError();
      setError(err instanceof Error ? err.message : 'Không thể kết nối đến API');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">Z</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Đăng nhập vào ZBase</h1>
      </div>
      
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
          <button 
            onClick={clearError} 
            className="float-right font-bold"
            type="button"
            aria-label="Đóng thông báo lỗi"
          >
            ×
          </button>
        </div>
      )}
      
      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="your.email@example.com"
                autoComplete="email"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <input
                {...register("rememberMe")}
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                Ghi nhớ đăng nhập
              </label>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
          
          {/* Manual login button only shown when there's an error */}
          {error && (
            <Button
              type="button"
              onClick={handleManualLogin}
              className="w-full mt-2 bg-gray-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Thử đăng nhập trực tiếp với API"}
            </Button>
          )}
        </form>
      </FormProvider>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-full p-8">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
