// Tệp dịch tiếng Việt cho quản lý người dùng
export default {
  // Tiêu đề và điều hướng
  title: 'Quản lý người dùng',
  backToUsers: 'Quay lại danh sách người dùng',
  createNewUser: 'Tạo người dùng mới',
  editUser: 'Chỉnh sửa người dùng',
  viewUser: 'Xem thông tin người dùng',

  // Nhãn và placeholder
  userName: 'Tên người dùng',
  userNamePlaceholder: 'Nhập tên người dùng',
  email: 'Email',
  emailPlaceholder: 'Nhập địa chỉ email',
  password: 'Mật khẩu',
  passwordPlaceholder: 'Nhập mật khẩu',
  confirmPassword: 'Xác nhận mật khẩu',
  confirmPasswordPlaceholder: 'Nhập lại mật khẩu',
  roles: 'Vai trò',
  selectRoles: 'Chọn vai trò',
  status: 'Trạng thái',
  active: 'Hoạt động',
  inactive: 'Không hoạt động',

  // Thông báo lỗi
  errors: {
    nameRequired: 'Tên người dùng là bắt buộc',
    emailRequired: 'Email là bắt buộc',
    emailInvalid: 'Email không hợp lệ',
    passwordRequired: 'Mật khẩu là bắt buộc',
    passwordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự',
    passwordsDontMatch: 'Mật khẩu không khớp',
    roleRequired: 'Vui lòng chọn ít nhất một vai trò',
    createFailed: 'Không thể tạo người dùng, vui lòng thử lại',
    updateFailed: 'Không thể cập nhật người dùng, vui lòng thử lại',
    deleteFailed: 'Không thể xóa người dùng, vui lòng thử lại',
    fetchFailed: 'Không thể tải thông tin người dùng, vui lòng thử lại'
  },

  // Thao tác
  createUser: 'Tạo người dùng',
  updateUser: 'Cập nhật người dùng', 
  deleteUser: 'Xóa người dùng',
  resetPassword: 'Đặt lại mật khẩu',
  confirm: 'Xác nhận',
  cancel: 'Hủy',
  saving: 'Đang lưu...',

  // Danh sách người dùng
  usersList: 'Danh sách người dùng',
  searchPlaceholder: 'Tìm kiếm người dùng...',
  noUsersFound: 'Không tìm thấy người dùng nào',
  loadingUsers: 'Đang tải danh sách người dùng...',
  refreshUsers: 'Làm mới danh sách',
  
  // Bảng người dùng
  tableHeaders: {
    name: 'Tên',
    email: 'Email',
    roles: 'Vai trò',
    status: 'Trạng thái',
    created: 'Ngày tạo',
    actions: 'Thao tác'
  },
  
  // Trang chi tiết người dùng
  userDetails: 'Chi tiết người dùng',
  userActivity: 'Hoạt động gần đây',
  noActivity: 'Không có hoạt động nào gần đây',
  
  // Xác nhận hành động
  confirmDelete: 'Bạn có chắc chắn muốn xóa người dùng này?',
  confirmResetPassword: 'Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng này?',
  deleteWarning: 'Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến người dùng này sẽ bị mất.'
};
