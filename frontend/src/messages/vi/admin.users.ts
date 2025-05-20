// Vietnamese translations for admin user management
export default {
  // Page titles
  title: 'Quản lý người dùng',
  createUser: 'Tạo người dùng mới',
  editUser: 'Chỉnh sửa người dùng',
  userDetails: 'Thông tin người dùng',
  createUserDescription: 'Tạo tài khoản người dùng mới với quyền hạn dựa trên vai trò',
  editUserDescription: 'Chỉnh sửa thông tin và quyền hạn người dùng',
  userDetailsDescription: 'Thông tin chi tiết về tài khoản người dùng',
  
  // Navigation
  backToUsers: 'Quay lại danh sách người dùng',
  
  // Form labels
  form: {
    id: 'ID',
    email: 'Địa chỉ email',
    password: 'Mật khẩu',
    newPassword: 'Mật khẩu mới',
    name: 'Họ và tên',
    roles: 'Vai trò được gán',
    rolesHint: 'Giữ Ctrl/Cmd để chọn nhiều vai trò',
    changePassword: 'Đổi mật khẩu'
  },
  
  // Table headers
  table: {
    name: 'Họ tên',
    email: 'Email',
    roles: 'Vai trò',
    createdAt: 'Ngày tạo',
    updatedAt: 'Cập nhật lần cuối',
    actions: 'Thao tác'
  },
  
  // Button labels
  addUser: 'Thêm người dùng',
  save: 'Lưu người dùng',
  update: 'Cập nhật',
  edit: 'Sửa',
  delete: 'Xóa',
  view: 'Xem',
  cancel: 'Hủy',
  saving: 'Đang lưu...',
  refresh: 'Làm mới',
  clearSearch: 'Xóa tìm kiếm',
  
  // Messages
  confirmDelete: 'Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.',
  noUsers: 'Không tìm thấy người dùng nào',
  noResultsFound: 'Không có người dùng nào khớp với tiêu chí tìm kiếm của bạn',
  getStarted: 'Bắt đầu bằng cách tạo một người dùng mới',
  userNotFound: 'Không tìm thấy người dùng',
  
  // Search
  searchPlaceholder: 'Tìm kiếm theo tên hoặc email',
  
  // Pagination
  pagination: {
    showing: 'Hiển thị',
    to: 'đến',
    of: 'của',
    results: 'kết quả',
    previous: 'Trước',
    next: 'Tiếp'
  },
  
  // Errors
  errors: {
    emailRequired: 'Email là bắt buộc',
    invalidEmail: 'Định dạng email không hợp lệ',
    passwordRequired: 'Mật khẩu là bắt buộc',
    passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
    nameRequired: 'Tên là bắt buộc',
    createFailed: 'Không thể tạo người dùng. Vui lòng thử lại.',
    updateFailed: 'Không thể cập nhật người dùng. Vui lòng thử lại.',
    deleteFailed: 'Không thể xóa người dùng. Vui lòng thử lại.',
    fetchFailed: 'Không thể tải thông tin người dùng. Vui lòng thử lại.'
  }
};
