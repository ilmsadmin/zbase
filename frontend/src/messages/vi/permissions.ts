export default {
  title: 'Kiểm tra quyền hạn',
  userInfo: {
    title: 'Thông tin người dùng',
    subtitle: 'Chi tiết người dùng hiện tại',
    name: 'Tên',
    email: 'Email',
    role: 'Vai trò',
    notUpdated: 'Chưa cập nhật'
  },
  abilities: {
    title: 'Quyền hạn',
    subtitle: 'Kiểm tra quyền hạn hiện tại',
    manageUsers: {
      name: 'Quản lý người dùng',
      description: 'Xem, thêm, sửa và xóa người dùng'
    },
    readPosts: {
      name: 'Xem tất cả bài viết',
      description: 'Xem tất cả bài viết trong hệ thống'
    },
    createPosts: {
      name: 'Tạo bài viết',
      description: 'Tạo bài viết mới'
    },
    managePosts: {
      name: 'Quản lý tất cả bài viết',
      description: 'Sửa và xóa bất kỳ bài viết nào'
    },
    manageComments: {
      name: 'Quản lý bình luận',
      description: 'Quản lý các bình luận trong hệ thống'
    },
    manageAll: {
      name: 'Quản lý hệ thống',
      description: 'Truy cập vào tất cả các tính năng'
    }
  },
  allowed: 'Được phép',
  denied: 'Không được phép',
  
  // Quản lý quyền hạn - CRUD
  management: {
    title: 'Quản lý quyền hạn',
    backToPermissions: 'Quay lại danh sách quyền hạn',
    createNewPermission: 'Tạo quyền hạn mới',
    editPermission: 'Chỉnh sửa quyền hạn',
    viewPermission: 'Xem quyền hạn',
    
    // Nhãn và placeholder
    permissionName: 'Tên quyền hạn',
    permissionNamePlaceholder: 'Nhập tên quyền hạn (ví dụ: create:posts)',
    permissionDescription: 'Mô tả quyền hạn',
    permissionDescriptionPlaceholder: 'Mô tả mục đích của quyền hạn này',
    permissionCategory: 'Danh mục',
    permissionCategoryPlaceholder: 'Chọn danh mục',
    action: 'Hành động',
    actionPlaceholder: 'Chọn hành động (view, create, update, delete, manage)',
    resource: 'Tài nguyên',
    resourcePlaceholder: 'Nhập tên tài nguyên (ví dụ: users, posts)',
    
    // Danh sách
    permissionsList: 'Danh sách quyền hạn',
    searchPlaceholder: 'Tìm kiếm quyền hạn...',
    noPermissionsFound: 'Không tìm thấy quyền hạn nào',
    
    // Bảng quyền hạn
    tableHeaders: {
      name: 'Tên quyền hạn',
      description: 'Mô tả',
      category: 'Danh mục',
      rolesCount: 'Số vai trò',
      actions: 'Thao tác'
    },
    
    // Thông báo lỗi
    errors: {
      nameRequired: 'Tên quyền hạn là bắt buộc',
      nameInvalid: 'Tên quyền hạn không hợp lệ. Sử dụng định dạng "hành động:tài nguyên"',
      createFailed: 'Không thể tạo quyền hạn, vui lòng thử lại',
      updateFailed: 'Không thể cập nhật quyền hạn, vui lòng thử lại',
      deleteFailed: 'Không thể xóa quyền hạn, vui lòng thử lại',
      fetchFailed: 'Không thể tải thông tin quyền hạn, vui lòng thử lại'
    },
    
    // Thao tác
    createPermission: 'Tạo quyền hạn',
    updatePermission: 'Cập nhật quyền hạn',
    deletePermission: 'Xóa quyền hạn',
    confirm: 'Xác nhận',
    cancel: 'Hủy',
    saving: 'Đang lưu...'
  }
}
