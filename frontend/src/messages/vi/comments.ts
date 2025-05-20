// Tệp dịch tiếng Việt cho quản lý bình luận
export default {
  // Tiêu đề và điều hướng
  title: 'Quản lý bình luận',
  backToComments: 'Quay lại danh sách bình luận',
  createNewComment: 'Tạo bình luận mới',
  editComment: 'Chỉnh sửa bình luận',
  viewComment: 'Xem bình luận',

  // Nhãn và placeholder
  commentContent: 'Nội dung bình luận',
  commentContentPlaceholder: 'Nhập nội dung bình luận',
  commentDate: 'Ngày bình luận',
  commentAuthor: 'Tác giả',
  commentStatus: 'Trạng thái',
  postTitle: 'Tiêu đề bài viết',
  
  // Trạng thái bình luận
  status: {
    approved: 'Đã duyệt',
    pending: 'Đang chờ duyệt',
    spam: 'Spam',
    trash: 'Đã xóa'
  },

  // Lọc và sắp xếp
  filter: 'Lọc',
  filterByStatus: 'Lọc theo trạng thái',
  filterAll: 'Tất cả bình luận',
  filterApproved: 'Đã duyệt',
  filterPending: 'Đang chờ duyệt',
  filterSpam: 'Spam',
  sortBy: 'Sắp xếp theo',
  sortNewest: 'Mới nhất',
  sortOldest: 'Cũ nhất',

  // Thông báo lỗi
  errors: {
    contentRequired: 'Nội dung bình luận là bắt buộc',
    contentTooShort: 'Nội dung bình luận quá ngắn',
    createFailed: 'Không thể tạo bình luận, vui lòng thử lại',
    updateFailed: 'Không thể cập nhật bình luận, vui lòng thử lại',
    deleteFailed: 'Không thể xóa bình luận, vui lòng thử lại',
    fetchFailed: 'Không thể tải danh sách bình luận, vui lòng thử lại'
  },

  // Thao tác
  createComment: 'Tạo bình luận',
  updateComment: 'Cập nhật bình luận', 
  deleteComment: 'Xóa bình luận',
  approveComment: 'Duyệt bình luận',
  rejectComment: 'Từ chối bình luận',
  markAsSpam: 'Đánh dấu là spam',
  moveToTrash: 'Chuyển vào thùng rác',
  restore: 'Khôi phục',
  reply: 'Trả lời',
  confirm: 'Xác nhận',
  cancel: 'Hủy',
  saving: 'Đang lưu...',

  // Danh sách bình luận
  commentsList: 'Danh sách bình luận',
  searchPlaceholder: 'Tìm kiếm bình luận...',
  noCommentsFound: 'Không tìm thấy bình luận nào',
  loadingComments: 'Đang tải danh sách bình luận...',
  refreshComments: 'Làm mới danh sách',
  
  // Bảng bình luận
  tableHeaders: {
    content: 'Nội dung',
    author: 'Tác giả',
    post: 'Bài viết',
    status: 'Trạng thái',
    date: 'Ngày tạo',
    actions: 'Thao tác'
  },

  // Thông báo và xác nhận
  notifications: {
    created: 'Bình luận đã được tạo thành công',
    updated: 'Bình luận đã được cập nhật thành công',
    deleted: 'Bình luận đã được xóa thành công',
    approved: 'Bình luận đã được duyệt',
    rejected: 'Bình luận đã bị từ chối',
    markedAsSpam: 'Bình luận đã được đánh dấu là spam',
    movedToTrash: 'Bình luận đã được chuyển vào thùng rác',
    restored: 'Bình luận đã được khôi phục'
  },
  
  confirmDelete: {
    title: 'Xóa bình luận',
    message: 'Bạn có chắc chắn muốn xóa bình luận này?',
    confirmButton: 'Xóa bình luận',
    cancelButton: 'Hủy bỏ'
  }
};
