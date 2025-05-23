'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/services/authService';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

// Create a schema for form validation
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});

// Define the form values type
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize form with react-hook-form and zod validation
  const { 
    handleSubmit, 
    formState: { errors }, 
    register,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  useEffect(() => {
    // Extract token from query parameters
    const tokenParam = searchParams.get('token');
    
    if (!tokenParam) {
      setTokenValid(false);
      setValidating(false);
      setError('Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
      return;
    }
    
    setToken(tokenParam);
    
    // In a real application, you would validate the token with the backend
    // For now, let's just simulate a token validation
    const validateToken = async () => {
      try {
        // Placeholder for token validation logic
        // In a real app, this would call an API endpoint to validate the token
        // For now, we'll assume it's valid if it exists
        setTokenValid(true);
      } catch (err) {
        console.error("Token validation error:", err);
        setTokenValid(false);
        setError('Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
      } finally {
        setValidating(false);
      }
    };
    
    validateToken();
  }, [searchParams]);
  
  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (isSubmitting || !token) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await authService.resetPassword(token, data.password);
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.');
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (validating) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Đang xác thực...</h2>
            <p className="mt-2 text-sm text-gray-600">Vui lòng đợi trong khi chúng tôi xác thực token của bạn.</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Token không hợp lệ</h2>
            <p className="mt-2 text-sm text-gray-600">Token để đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
            <div className="mt-6">
              <Link href="/forgot-password">
                <Button className="w-full">Yêu cầu token mới</Button>
              </Link>
            </div>
            <div className="mt-4 text-sm">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Quay lại trang đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đặt lại mật khẩu</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập mật khẩu mới của bạn bên dưới.
          </p>
        </div>
        
        {isSuccess ? (
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Mật khẩu đã được đặt lại!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới của mình.
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/login">
                    <Button className="w-full">
                      Đi đến trang đăng nhập
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Nhập mật khẩu mới"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`w-full pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Xác nhận mật khẩu mới"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Đã xảy ra lỗi</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </Button>
            </div>
            
            <div className="text-sm text-center">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Quay lại trang đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
