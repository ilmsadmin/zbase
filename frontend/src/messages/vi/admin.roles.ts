// Tệp dịch tiếng Việt cho quản lý vai trò trong trang quản trị
export default {
  // Tiêu đề và mô tả trang
  title: 'Quản lý vai trò',
  description: 'Quản lý và phân quyền cho người dùng trong hệ thống',
  createRoleBtn: 'Tạo vai trò mới',
  backToRoles: 'Quay lại danh sách vai trò',
  backToRole: 'Quay lại vai trò',
  roleInfoTitle: 'Thông tin vai trò',
  rolePermissionsTitle: 'Quyền hạn của vai trò',
    // Các trường bổ sung ở cấp cao nhất
  addRole: 'Thêm vai trò mới',
  searchPlaceholder: 'Tìm kiếm vai trò...',
  refresh: 'Làm mới',
  view: 'Xem',
  edit: 'Chỉnh sửa',  delete: 'Xóa',
  permissionCount: 'Quyền hạn',
  users: 'Người dùng',
  createdAt: 'Ngày tạo',
  permissions: 'Quyền hạn',
  
  // Trang tạo vai trò mới
  createNewRole: 'Tạo vai trò mới',
  roleName: 'Tên vai trò',
  roleNamePlaceholder: 'Nhập tên vai trò (VD: Admin, Editor, User)',
  roleDescription: 'Mô tả vai trò',
  roleDescriptionPlaceholder: 'Mô tả chức năng và quyền hạn của vai trò',
  roleDescriptionHelp: 'Mô tả rõ chức năng và phạm vi quyền hạn của vai trò này',
  cancel: 'Hủy bỏ',
  createRole: 'Tạo vai trò',
  saving: 'Đang lưu...',
  
  // Mẹo tạo vai trò
  roleTips: {
    title: 'Mẹo khi tạo vai trò',
    tip1: 'Đặt tên vai trò ngắn gọn và dễ hiểu',
    tip2: 'Cung cấp mô tả chi tiết về chức năng và phạm vi của vai trò',
    tip3: 'Phân công quyền hạn phù hợp cho từng vai trò',
    tip4: 'Gán vai trò cho người dùng dựa trên trách nhiệm công việc'
  },
  
  // Form tạo và chỉnh sửa vai trò
  createForm: {
    title: 'Tạo vai trò mới',
    description: 'Thêm vai trò mới và cấu hình quyền hạn',
    submit: 'Tạo vai trò',
    cancel: 'Hủy bỏ',
    nameLabel: 'Tên vai trò',
    namePlaceholder: 'Nhập tên vai trò (VD: Admin, Editor, User)',
    descriptionLabel: 'Mô tả vai trò',
    descriptionPlaceholder: 'Mô tả chức năng và quyền hạn của vai trò',
    nameRequired: 'Tên vai trò là bắt buộc',
    nameTooShort: 'Tên vai trò phải có ít nhất 2 ký tự'
  },
  
  editForm: {
    title: 'Chỉnh sửa vai trò',
    description: 'Cập nhật thông tin và quyền hạn cho vai trò',
    submit: 'Cập nhật vai trò',
    cancel: 'Hủy bỏ',
    nameLabel: 'Tên vai trò',
    namePlaceholder: 'Nhập tên vai trò',
    descriptionLabel: 'Mô tả vai trò',
    descriptionPlaceholder: 'Mô tả chức năng và quyền hạn của vai trò',
    saveChanges: 'Lưu thay đổi'
  },
    // Chi tiết vai trò
  roleDetails: {
    title: 'Chi tiết vai trò',
    description: 'Xem thông tin chi tiết về vai trò',
    usersWithRole: 'Người dùng có vai trò này',
    assignedPermissions: 'Quyền hạn được gán',
    noPermissionsAssigned: 'Không có quyền hạn nào được gán cho vai trò này',
    noUsersWithRole: 'Không có người dùng nào được gán vai trò này',
    id: 'ID vai trò',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật',
    editRole: 'Chỉnh sửa vai trò',
    deleteRole: 'Xóa vai trò',
    assignUsers: 'Gán người dùng',
    viewAllUsers: 'Xem tất cả người dùng'
  },
  
  // Bảng vai trò
  table: {
    name: 'Tên vai trò',
    description: 'Mô tả',
    permissionsCount: 'Số quyền hạn',
    usersCount: 'Số người dùng',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật',
    actions: 'Thao tác',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    viewDetails: 'Xem chi tiết',
    noRoles: 'Không có vai trò nào',
    loadingRoles: 'Đang tải danh sách vai trò...'
  },
  
  // Xác nhận xóa vai trò
  deleteConfirmation: {
    title: 'Xóa vai trò',
    message: 'Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.',
    confirmButton: 'Xóa vai trò',
    cancelButton: 'Hủy bỏ',
    warningWithUsers: 'Lưu ý: Vai trò này hiện đang được gán cho {count} người dùng. Nếu xóa, những người dùng này sẽ mất quyền hạn tương ứng.'
  },
  
  // Thông báo
  notifications: {
    created: 'Vai trò đã được tạo thành công',
    updated: 'Vai trò đã được cập nhật thành công',
    deleted: 'Vai trò đã được xóa thành công',
    error: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    permissionsUpdated: 'Quyền hạn của vai trò đã được cập nhật',
    roleNotFound: 'Không tìm thấy vai trò',
    cannotDeleteDefaultRole: 'Không thể xóa vai trò mặc định',
    noPermissionsAvailable: 'Không có quyền hạn nào khả dụng trong hệ thống'
  },
  
  // Quyền hạn
  permissionsSection: {
    title: 'Quyền hạn',
    searchPlaceholder: 'Tìm kiếm quyền hạn...',
    selectAll: 'Chọn tất cả',
    deselectAll: 'Bỏ chọn tất cả',
    savePermissions: 'Lưu quyền hạn',
    noPermissionsAvailable: 'Không có quyền hạn nào khả dụng',
    filterByCategory: 'Lọc theo danh mục',
    allCategories: 'Tất cả danh mục',
    permissionNameHeader: 'Tên quyền hạn',
    descriptionHeader: 'Mô tả',
    categoryHeader: 'Danh mục',
    categories: {
      users: 'Người dùng',
      posts: 'Bài viết',
      comments: 'Bình luận',
      roles: 'Vai trò',
      system: 'Hệ thống',
      media: 'Phương tiện',
      settings: 'Cài đặt'
    },
    actions: {
      view: 'Xem',
      create: 'Tạo',
      update: 'Cập nhật',
      delete: 'Xóa',
      manage: 'Quản lý',
      publish: 'Đăng',
      unpublish: 'Hủy đăng',
      approve: 'Phê duyệt',
      reject: 'Từ chối'
    }
  },
  
  // Phân trang và sắp xếp
  pagination: {
    previous: 'Trước',
    next: 'Tiếp',
    page: 'Trang {page} / {total}',
    perPage: 'Hiển thị:',
    showing: 'Đang hiển thị {start}-{end} của {total} vai trò'
  },
    // Giao diện
  ui: {
    searchPlaceholder: 'Tìm kiếm vai trò...',
    refresh: 'Làm mới',
    loading: 'Đang tải...',
    filter: 'Lọc',
    sortBy: 'Sắp xếp theo',
    sortOrder: 'Thứ tự',
    ascending: 'Tăng dần',
    descending: 'Giảm dần',
    import: 'Nhập vai trò',
    export: 'Xuất vai trò',
    emptyState: 'Chưa có vai trò nào được tạo',
    emptyStateDescription: 'Tạo vai trò đầu tiên để quản lý quyền hạn trong hệ thống',
    nameAlreadyExists: 'Tên vai trò này đã tồn tại'
  },

  // Thông báo lỗi
  errors: {
    fetchFailed: 'Không thể tải danh sách vai trò. Vui lòng thử lại.',
    createFailed: 'Không thể tạo vai trò. Vui lòng thử lại.',
    updateFailed: 'Không thể cập nhật vai trò. Vui lòng thử lại.',
    deleteFailed: 'Không thể xóa vai trò. Vui lòng thử lại.',
    permissionUpdateFailed: 'Không thể cập nhật quyền hạn vai trò. Vui lòng thử lại.',
    nameRequired: 'Tên vai trò là bắt buộc',
    nameTooShort: 'Tên vai trò phải có ít nhất 2 ký tự',
    descriptionRequired: 'Mô tả vai trò là bắt buộc',
    invalidData: 'Dữ liệu không hợp lệ'
  },
    // Thông báo xác nhận  confirmDelete: 'Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.',
  confirmCancelEdit: 'Bạn có chắc chắn muốn hủy bỏ? Tất cả thay đổi chưa lưu sẽ bị mất.',
  save: 'Lưu',
    // Các trường bổ sung cho trang chi tiết vai trò
  roleDetails: 'Thông tin chi tiết vai trò',
  roleDetailsDesc: 'Xem và quản lý thông tin chi tiết của vai trò',
  roleName: 'Tên vai trò',
  roleId: 'ID vai trò',
  updatedAt: 'Ngày cập nhật',
  managePermissions: 'Quản lý quyền hạn',
  managePermissionsDesc: 'Gán hoặc thu hồi quyền hạn cho vai trò này',
  manageUsers: 'Quản lý người dùng',
  manageUsersDesc: 'Gán hoặc hủy gán vai trò cho người dùng',
  usersAssigned: 'người dùng đã gán',
  rolePermissions: 'Quyền hạn của vai trò',
  rolePermissionsDesc: 'Danh sách các quyền hạn được gán cho vai trò này',
  roleUsers: 'Người dùng của vai trò',
  roleUsersDesc: 'Danh sách người dùng được gán vai trò này',
  noPermissions: 'Chưa có quyền hạn nào',
  assignPermissions: 'Gán quyền hạn',viewAllPermissions: 'Xem tất cả {count} quyền hạn khác',
  noUsers: 'Chưa có người dùng nào',
  assignUsers: 'Gán người dùng',
  noDescription: 'Không có mô tả',
  
  // Quản lý quyền hạn
  managePermissionsFor: 'Quản lý quyền hạn cho {roleName}',
  permissionsAssigned: 'quyền hạn được gán',
  assignedPermissions: 'Quyền hạn đã gán',
  assignedPermissionsDesc: 'Quyền hạn hiện đang được gán cho vai trò này',
  noPermissionsAssigned: 'Chưa có quyền hạn nào được gán cho vai trò này',
  allPermissions: 'Tất cả quyền hạn',
  allPermissionsDesc: 'Tất cả quyền hạn có sẵn trong hệ thống',
  searchPermissions: 'Tìm kiếm quyền hạn...',
  noPermissionsFound: 'Không tìm thấy quyền hạn nào phù hợp với tìm kiếm',
  noPermissionsInSystem: 'Không có quyền hạn nào được định nghĩa trong hệ thống',
  clearSearch: 'Xóa tìm kiếm',
  permission: 'Quyền hạn',
  description: 'Mô tả',
  actions: 'Thao tác',
  remove: 'Xóa',
  assign: 'Gán',
  refresh: 'Làm mới',  roleNotFound: 'Không tìm thấy vai trò',
  roleNotFoundDesc: 'Vai trò bạn đang tìm kiếm không tồn tại.',
  
  // Quản lý người dùng cho vai trò
  addUser: 'Thêm người dùng',
  manageUsersFor: 'Quản lý người dùng cho {roleName}',
  searchUsers: 'Tìm kiếm người dùng...',
  usersWithRole: 'Người dùng có vai trò {roleName}',
  usersWithRoleDesc: 'Danh sách người dùng được gán vai trò này',
  user: 'Người dùng',
  email: 'Email',
  addUserToRole: 'Thêm người dùng vào vai trò {roleName}',
  searchUsersToAdd: 'Tìm kiếm người dùng để thêm...',
  noUsersToAdd: 'Không có người dùng nào để thêm vào vai trò này',
  noUsersFound: 'Không tìm thấy người dùng phù hợp với tìm kiếm',
  noUsersAssigned: 'Chưa có người dùng nào được gán cho vai trò này',
  add: 'Thêm',
  close: 'Đóng'
};
