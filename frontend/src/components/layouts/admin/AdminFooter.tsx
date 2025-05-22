import Link from 'next/link';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left">
            <p className="text-xs text-gray-500">
              &copy; {currentYear} ZBase. Hệ thống quản lý bán hàng. Mọi quyền được bảo lưu.
            </p>
          </div>
          
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <Link
              href="/legal/privacy"
              className="text-xs text-gray-500 hover:text-blue-600"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/legal/terms"
              className="text-xs text-gray-500 hover:text-blue-600"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              href="/admin/help"
              className="text-xs text-gray-500 hover:text-blue-600"
            >
              Trợ giúp
            </Link>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-400 text-center">
          <span>Phiên bản 1.0.0</span>
          <span className="mx-1">|</span>
          <span>Lần cuối cập nhật: 20/05/2025</span>
        </div>
      </div>
    </footer>
  );
}
