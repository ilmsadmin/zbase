// Vietnamese translations for permissions in admin panel
export default {
  title: 'Quản lý quyền hạn',
  description: 'Quản lý các quyền hạn trong hệ thống',
  backToList: 'Quay lại danh sách',
  discoverPermissions: 'Khám phá quyền hạn',
  normalizePermissions: 'Chuẩn hóa quyền hạn',
  createPermission: 'Tạo quyền hạn mới',
  editPermission: 'Chỉnh sửa quyền hạn',
  viewPermission: 'Xem quyền hạn',
  deletePermission: 'Xóa quyền hạn',
  discovering: 'Đang khám phá...',
  refresh: 'Làm mới',
  searchPlaceholder: 'Tìm kiếm quyền hạn...',
  clearSearch: 'Xóa tìm kiếm',
  noResultsFound: 'Không tìm thấy kết quả',
  noPermissions: 'Không có quyền hạn nào',
  noPermissionsInSystem: 'Không có quyền hạn nào trong hệ thống',
  permission: 'Quyền hạn',
  description: 'Mô tả',
  category: 'Danh mục',
  action: 'Hành động',
  resource: 'Tài nguyên',
  usedBy: 'Được sử dụng bởi',
  noDescription: 'Không có mô tả',
  permissionCount: '{count} quyền hạn',
  roles: 'vai trò',
  confirmDelete: 'Bạn có chắc chắn muốn xóa quyền hạn này?',
  
  // Form
  form: {
    nameLabel: 'Tên quyền hạn',
    namePlaceholder: 'Nhập tên quyền hạn (VD: create:posts)',
    nameHelp: 'Sử dụng định dạng "hành động:tài nguyên"',
    descriptionLabel: 'Mô tả',
    descriptionPlaceholder: 'Mô tả chức năng của quyền hạn này',
    categoryLabel: 'Danh mục',
    categoryPlaceholder: 'Chọn danh mục',
    actionLabel: 'Hành động',
    actionPlaceholder: 'Chọn hành động (view, create, update, delete, manage)',
    resourceLabel: 'Tài nguyên',
    resourcePlaceholder: 'Nhập tên tài nguyên (VD: users, posts)',
    submit: 'Lưu quyền hạn',
    cancel: 'Hủy bỏ'
  },
  
  // Danh sách và bảng
  table: {
    name: 'Tên quyền hạn',
    description: 'Mô tả',
    category: 'Danh mục',
    rolesCount: 'Số vai trò',
    actions: 'Thao tác',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    view: 'Xem chi tiết'
  },
  
  // Thống kê
  stats: {
    total: 'Tổng số quyền hạn',
    byCategory: 'Quyền hạn theo danh mục',
    mostUsed: 'Quyền hạn được sử dụng nhiều nhất',
    unused: 'Quyền hạn chưa được sử dụng'
  },
  
  // Chi tiết quyền hạn
  permissionDetails: {
    title: 'Chi tiết quyền hạn',
    description: 'Xem thông tin chi tiết về quyền hạn',
    id: 'ID quyền hạn',
    name: 'Tên quyền hạn',
    category: 'Danh mục',
    assignedRoles: 'Vai trò được gán',
    noRolesAssigned: 'Không có vai trò nào được gán quyền hạn này',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật',
    editPermission: 'Chỉnh sửa quyền hạn',
    deletePermission: 'Xóa quyền hạn'
  },
  
  // Danh mục quyền hạn
  categories: {
    users: 'Người dùng',
    posts: 'Bài viết',
    comments: 'Bình luận',
    roles: 'Vai trò',
    system: 'Hệ thống',
    media: 'Phương tiện',
    settings: 'Cài đặt',
    all: 'Tất cả'
  },
  
  // Hành động quyền hạn
  actions: {
    view: 'Xem',
    create: 'Tạo',
    update: 'Cập nhật',
    delete: 'Xóa',
    manage: 'Quản lý',
    publish: 'Đăng',
    unpublish: 'Hủy đăng',
    approve: 'Phê duyệt',
    reject: 'Từ chối',
    all: 'Tất cả'
  },
  
  aboutPermissions: {
    title: 'Về quản lý quyền hạn',
    description: 'Quyền hạn kiểm soát những gì người dùng có thể thực hiện trong hệ thống.',
    point1: 'Quyền hạn được định nghĩa theo định dạng "hành động:tài nguyên".',
    point2: 'Hành động bao gồm: view, create, update, delete, manage, v.v.',
    point3: 'Quyền hạn được gán cho vai trò, và người dùng được gán vai trò.'
  },
    // Hộp thoại xác nhận
  confirmation: {
    deleteTitle: 'Xóa quyền hạn',
    deleteMessage: 'Bạn có chắc chắn muốn xóa quyền hạn này? Hành động này có thể ảnh hưởng đến người dùng với vai trò sử dụng quyền hạn này.',
    confirmButton: 'Xóa',
    cancelButton: 'Hủy bỏ'
  },
  
  // Thông báo
  notifications: {
    created: 'Quyền hạn đã được tạo thành công',
    updated: 'Quyền hạn đã được cập nhật thành công',
    deleted: 'Quyền hạn đã được xóa thành công',
    discovered: 'Đã tìm thấy {count} quyền hạn mới',
    normalized: 'Quyền hạn đã được chuẩn hóa thành công',
    permissionExists: 'Quyền hạn này đã tồn tại'
  },
  
  errors: {
    fetchFailed: 'Không thể tải quyền hạn, vui lòng thử lại',
    discoverFailed: 'Không thể khám phá quyền hạn mới, vui lòng thử lại',
    normalizeFailed: 'Không thể chuẩn hóa quyền hạn, vui lòng thử lại',
    createFailed: 'Không thể tạo quyền hạn, vui lòng thử lại',
    updateFailed: 'Không thể cập nhật quyền hạn, vui lòng thử lại',
    deleteFailed: 'Không thể xóa quyền hạn, vui lòng thử lại',
    nameRequired: 'Tên quyền hạn là bắt buộc',
    nameInvalid: 'Tên quyền hạn không hợp lệ. Sử dụng định dạng "hành động:tài nguyên"',
    categoryRequired: 'Danh mục là bắt buộc',
    actionRequired: 'Hành động là bắt buộc',
    resourceRequired: 'Tài nguyên là bắt buộc'
  },
  
  // Phân trang và sắp xếp
  pagination: {
    previous: 'Trước',
    next: 'Tiếp',
    page: 'Trang {page} / {total}',
    perPage: 'Hiển thị:',
    showing: 'Đang hiển thị {start}-{end} của {total} quyền hạn'
  }
};
