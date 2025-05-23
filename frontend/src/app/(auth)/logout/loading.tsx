'use client';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
          <div className="w-10 h-10 border-t-2 border-orange-500 rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-bold mb-2">Đang đăng xuất...</h1>
        <p className="text-gray-600 mb-4">Vui lòng đợi trong khi hệ thống đăng xuất tài khoản của bạn.</p>
      </div>
    </div>
  );
}
