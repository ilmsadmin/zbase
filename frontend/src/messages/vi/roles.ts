// Tệp dịch tiếng Việt cho quản lý vai trò
export default {
  // Tiêu đề và điều hướng
  title: 'Quản lý vai trò',
  backToRoles: 'Quay lại danh sách vai trò',
  backToRole: 'Quay lại vai trò',
  createNewRole: 'Tạo vai trò mới',
  editRole: 'Chỉnh sửa vai trò',
  
  // Thông tin vai trò
  roleName: 'Tên vai trò',
  roleNamePlaceholder: 'Nhập tên vai trò (ví dụ: Admin, Editor, User)',
  roleDescription: 'Mô tả vai trò',
  roleDescriptionPlaceholder: 'Mô tả chức năng và quyền hạn của vai trò này',
  roleDescriptionHelp: 'Mô tả chi tiết sẽ giúp người quản trị hiểu vai trò này có những quyền hạn gì.',
  
  // Quản lý quyền hạn
  managePermissionsFor: 'Quản lý quyền hạn cho {roleName}',
  rolePermissions: 'Quyền hạn',
  permissionsAssigned: 'quyền hạn được gán',
  assignedPermissions: 'Quyền hạn đã gán',
  assignedPermissionsDesc: 'Quyền hạn hiện đang được gán cho vai trò này',
  noPermissionsAssigned: 'Chưa có quyền hạn nào được gán cho vai trò này',
  allPermissions: 'Tất cả quyền hạn',
  allPermissionsDesc: 'Tất cả quyền hạn có sẵn trong hệ thống',
  searchPermissions: 'Tìm kiếm quyền hạn...',
  noPermissionsFound: 'Không tìm thấy quyền hạn nào phù hợp với tìm kiếm',
  noPermissionsInSystem: 'Không có quyền hạn nào được định nghĩa trong hệ thống',
  selectPermissions: 'Chọn quyền hạn',
  
  // Thành phần giao diện
  permission: 'Quyền hạn',
  description: 'Mô tả',
  actions: 'Thao tác',
  remove: 'Xóa',
  assign: 'Gán',
  refresh: 'Làm mới',
  clearSearch: 'Xóa tìm kiếm',
  noDescription: 'Không có mô tả',
  
  // Trạng thái lỗi
  roleNotFound: 'Không tìm thấy vai trò',
  roleNotFoundDesc: 'Vai trò bạn đang tìm kiếm không tồn tại.',
  
  // Thông báo lỗi
  errors: {
    nameRequired: 'Tên vai trò là bắt buộc',
    nameTooShort: 'Tên vai trò phải có ít nhất 2 ký tự',
    createFailed: 'Không thể tạo vai trò, vui lòng thử lại',
    updateFailed: 'Không thể cập nhật vai trò, vui lòng thử lại',
    deleteFailed: 'Không thể xóa vai trò, vui lòng thử lại',
    fetchFailed: 'Không thể tải thông tin vai trò, vui lòng thử lại',
    addPermissionFailed: 'Không thể thêm quyền hạn cho vai trò',
    removePermissionFailed: 'Không thể xóa quyền hạn khỏi vai trò'
  },
  
  // Thao tác
  createRole: 'Tạo vai trò',
  updateRole: 'Cập nhật vai trò', 
  deleteRole: 'Xóa vai trò',
  confirm: 'Xác nhận',
  cancel: 'Hủy',
  saving: 'Đang lưu...',
  
  // Danh sách vai trò
  rolesList: 'Danh sách vai trò',
  searchPlaceholder: 'Tìm kiếm vai trò...',
  noRolesFound: 'Không tìm thấy vai trò nào',
  loadingRoles: 'Đang tải danh sách vai trò...',
  refreshRoles: 'Làm mới danh sách',
  
  // Tiêu đề bảng
  tableHeaders: {
    name: 'Tên vai trò',
    description: 'Mô tả',
    permissions: 'Số quyền hạn',
    users: 'Số người dùng',
    actions: 'Thao tác'
  },
  
  // Trang chi tiết vai trò
  roleDetails: 'Chi tiết vai trò',
  usersWithRole: 'Người dùng có vai trò này',
  noUsersWithRole: 'Không có người dùng nào có vai trò này',
  
  // Mẹo về vai trò
  roleTips: {
    title: 'Mẹo về quản lý vai trò',
    tip1: 'Vai trò định nghĩa quyền truy cập của người dùng trong hệ thống.',
    tip2: 'Tạo vai trò có phạm vi hạn chế để áp dụng nguyên tắc ít đặc quyền nhất.',
    tip3: 'Mô tả rõ ràng để người quản trị khác hiểu được mục đích của vai trò.',
    tip4: 'Thường xuyên xem xét và cập nhật quyền hạn của vai trò để đảm bảo an toàn.'
  }
};