// Tệp dịch tiếng Việt cho quản lý bình luận trong trang quản trị
export default {
  // Tiêu đề và mô tả trang
  title: 'Quản lý bình luận',
  description: 'Quản lý bình luận từ người dùng trong hệ thống',
  
  // Bộ lọc và trạng thái
  filter: {
    title: 'Bộ lọc',
    all: 'Tất cả bình luận',
    approved: 'Đã duyệt',
    pending: 'Đang chờ duyệt',
    spam: 'Spam',
    trash: 'Thùng rác',
    search: 'Tìm kiếm bình luận'
  },
  
  // Thống kê
  stats: {
    total: 'Tổng số bình luận',
    approved: 'Đã duyệt',
    pending: 'Đang chờ duyệt',
    spam: 'Spam',
    trash: 'Thùng rác'
  },
  
  // Bảng bình luận
  table: {
    author: 'Tác giả',
    comment: 'Bình luận',
    inResponseTo: 'Phản hồi cho',
    submitted: 'Đã gửi',
    status: 'Trạng thái',
    actions: 'Thao tác'
  },
  
  // Trạng thái bình luận
  status: {
    approved: 'Đã duyệt',
    pending: 'Đang chờ duyệt',
    spam: 'Spam',
    trash: 'Đã xóa'
  },
  
  // Thao tác
  actions: {
    approve: 'Duyệt',
    unapprove: 'Hủy duyệt',
    reply: 'Trả lời',
    edit: 'Chỉnh sửa',
    spam: 'Đánh dấu là spam',
    trash: 'Chuyển vào thùng rác',
    delete: 'Xóa vĩnh viễn',
    restore: 'Khôi phục',
    viewPost: 'Xem bài viết',
    viewThread: 'Xem cuộc trò chuyện'
  },
  
  // Form chỉnh sửa bình luận
  editForm: {
    title: 'Chỉnh sửa bình luận',
    content: 'Nội dung',
    author: 'Tác giả',
    email: 'Email',
    website: 'Website',
    status: 'Trạng thái',
    update: 'Cập nhật',
    cancel: 'Hủy bỏ'
  },
  
  // Form trả lời bình luận
  replyForm: {
    title: 'Trả lời bình luận',
    content: 'Nội dung trả lời',
    submit: 'Gửi trả lời',
    cancel: 'Hủy bỏ'
  },
  
  // Thông báo xác nhận
  confirmations: {
    delete: 'Bạn có chắc chắn muốn xóa bình luận này vĩnh viễn?',
    trash: 'Bạn có chắc chắn muốn chuyển bình luận này vào thùng rác?',
    spam: 'Bạn có chắc chắn muốn đánh dấu bình luận này là spam?',
    emptyTrash: 'Bạn có chắc chắn muốn dọn sạch thùng rác? Thao tác này không thể hoàn tác.',
    deleteAll: 'Bạn có chắc chắn muốn xóa tất cả bình luận đã chọn? Thao tác này không thể hoàn tác.',
    approve: 'Bạn có chắc chắn muốn duyệt bình luận này?',
    unapprove: 'Bạn có chắc chắn muốn hủy duyệt bình luận này?'
  },
  
  // Thông báo
  notifications: {
    approved: 'Bình luận đã được duyệt',
    unapproved: 'Bình luận đã bị hủy duyệt',
    markedAsSpam: 'Bình luận đã được đánh dấu là spam',
    movedToTrash: 'Bình luận đã được chuyển vào thùng rác',
    deleted: 'Bình luận đã được xóa vĩnh viễn',
    restored: 'Bình luận đã được khôi phục',
    updated: 'Bình luận đã được cập nhật',
    replied: 'Đã trả lời bình luận',
    bulkUpdated: '{count} bình luận đã được cập nhật'
  },
    // Giao diện và tương tác
  ui: {
    loading: 'Đang tải bình luận...',
    noComments: 'Không có bình luận nào',
    noCommentsFound: 'Không tìm thấy bình luận nào phù hợp với bộ lọc',
    selectAll: 'Chọn tất cả',
    bulkActions: 'Thao tác hàng loạt',
    apply: 'Áp dụng',
    showMore: 'Hiển thị thêm',
    emptyTrash: 'Dọn sạch thùng rác'
  },
  
  // Lỗi
  errors: {
    fetchFailed: 'Không thể tải bình luận. Vui lòng thử lại.',
    updateFailed: 'Không thể cập nhật bình luận. Vui lòng thử lại.',
    deleteFailed: 'Không thể xóa bình luận. Vui lòng thử lại.',
    replyFailed: 'Không thể gửi trả lời. Vui lòng thử lại.',
    contentRequired: 'Nội dung bình luận là bắt buộc',
    contentTooLong: 'Bình luận không thể vượt quá 1000 ký tự',
    authorRequired: 'Tên tác giả là bắt buộc',
    emailInvalid: 'Định dạng email không hợp lệ',
    permissionDenied: 'Bạn không có quyền thực hiện hành động này'
  }
};
