// Vietnamese translation file for employee management in admin panel
export default {
  // Page titles and descriptions
  title: 'Quản lý nhân viên',
  description: 'Quản lý nhân viên và phân quyền',
  createEmployeeBtn: 'Thêm nhân viên mới',
  backToEmployees: 'Quay lại danh sách nhân viên',
  backToEmployee: 'Quay lại thông tin nhân viên',
  employeeInfoTitle: 'Thông tin nhân viên',
  employeeRolesTitle: 'Phân quyền cho nhân viên',
  
  // Create and edit employee forms
  createForm: {
    title: 'Thêm nhân viên mới',
    description: 'Thêm nhân viên mới và thiết lập quyền',
    submit: 'Tạo nhân viên',
    cancel: 'Hủy',
    nameLabel: 'Họ và tên',
    namePlaceholder: 'Nhập họ và tên nhân viên',
    emailLabel: 'Địa chỉ email',
    emailPlaceholder: 'Nhập địa chỉ email',
    passwordLabel: 'Mật khẩu',
    passwordPlaceholder: 'Nhập mật khẩu',
    passwordConfirmLabel: 'Xác nhận mật khẩu',
    passwordConfirmPlaceholder: 'Xác nhận lại mật khẩu',
    phoneLabel: 'Số điện thoại',
    phonePlaceholder: 'Nhập số điện thoại',
    positionLabel: 'Chức vụ',
    positionPlaceholder: 'Nhập chức vụ nhân viên',
    statusLabel: 'Trạng thái',
    statusOptions: {
      active: 'Đang làm việc',
      inactive: 'Ngừng làm việc'
    },
    nameRequired: 'Tên nhân viên là bắt buộc',
    emailRequired: 'Email là bắt buộc',
    emailInvalid: 'Vui lòng nhập một email hợp lệ',
    passwordRequired: 'Mật khẩu là bắt buộc',
    passwordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự',
    passwordNoMatch: 'Mật khẩu không khớp'
  },
  
  editForm: {
    title: 'Chỉnh sửa nhân viên',
    description: 'Cập nhật thông tin và quyền của nhân viên',
    submit: 'Cập nhật nhân viên',
    cancel: 'Hủy',
    saveChanges: 'Lưu thay đổi'
  },
  
  // Employee details
  employeeDetails: {
    title: 'Chi tiết nhân viên',
    description: 'Xem thông tin chi tiết về nhân viên này',
    assignedRoles: 'Các vai trò đã gán',
    noRolesAssigned: 'Chưa gán quyền cho nhân viên này',
    id: 'Mã nhân viên',
    email: 'Email',
    phone: 'Số điện thoại',
    position: 'Chức vụ',
    status: 'Trạng thái',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật',
    editEmployee: 'Chỉnh sửa nhân viên',
    deleteEmployee: 'Xóa nhân viên',
    assignRoles: 'Phân quyền'
  },
  
  // Employee table
  table: {
    name: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    position: 'Chức vụ',
    roles: 'Quyền',
    status: 'Trạng thái',
    createdAt: 'Ngày tạo',
    actions: 'Thao tác'
  },
  
  // Search and filtering
  search: {
    placeholder: 'Tìm kiếm nhân viên...',
    byName: 'Theo tên',
    byEmail: 'Theo email',
    byRole: 'Theo quyền',
    clearFilters: 'Xóa bộ lọc'
  },
  
  // Roles management
  roles: {
    title: 'Quản lý quyền',
    description: 'Gán và thu hồi quyền cho nhân viên này',
    available: 'Quyền có sẵn',
    assigned: 'Quyền đã gán',
    addRole: 'Thêm quyền',
    removeRole: 'Xóa quyền',
    saveRoles: 'Lưu quyền'
  },
    // Status labels
  status: {
    active: 'Đang làm việc',
    inactive: 'Ngừng làm việc'
  },
  
  // Action messages
  saving: 'Đang lưu...',
  saved: 'Đã lưu',
  
  // Actions
  actions: {
    view: 'Xem',
    edit: 'Sửa',
    delete: 'Xóa',
    assign: 'Phân quyền'
  },
  
  // Confirmation messages
  confirmDelete: 'Bạn có chắc chắn muốn xóa nhân viên này?',
  confirmRoleRemoval: 'Bạn có chắc chắn muốn xóa quyền này?',
  
  // Success messages
  success: {
    created: 'Tạo nhân viên thành công',
    updated: 'Cập nhật nhân viên thành công',
    deleted: 'Xóa nhân viên thành công',
    rolesUpdated: 'Cập nhật quyền nhân viên thành công'
  },
  
  // Error messages
  errors: {
    fetchFailed: 'Không thể tải danh sách nhân viên',
    employeeNotFound: 'Không tìm thấy nhân viên',
    createFailed: 'Không thể tạo nhân viên',
    updateFailed: 'Không thể cập nhật nhân viên',
    deleteFailed: 'Không thể xóa nhân viên',
    roleUpdateFailed: 'Không thể cập nhật quyền nhân viên'
  },
  
  // Empty states
  empty: {
    title: 'Không tìm thấy nhân viên nào',
    description: 'Thử điều chỉnh tìm kiếm hoặc bộ lọc để tìm thấy những gì bạn đang tìm kiếm',
    noEmployeesYet: 'Chưa có nhân viên nào',
    getStarted: 'Bắt đầu bằng cách tạo nhân viên mới'
  }
};
