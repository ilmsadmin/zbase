// Tệp dịch tiếng Việt cho quản lý bài viết
export default {
  // Tiêu đề và điều hướng
  title: 'Quản lý bài viết',
  backToPosts: 'Quay lại danh sách bài viết',
  createNewPost: 'Tạo bài viết mới',
  editPost: 'Chỉnh sửa bài viết',
  viewPost: 'Xem bài viết',

  // Nhãn và placeholder
  postTitle: 'Tiêu đề bài viết',
  postTitlePlaceholder: 'Nhập tiêu đề bài viết',
  content: 'Nội dung',
  contentPlaceholder: 'Nhập nội dung bài viết',
  status: 'Trạng thái',
  published: 'Đã đăng',
  draft: 'Bản nháp',
  author: 'Tác giả',
  createdDate: 'Ngày tạo',
  updatedDate: 'Ngày cập nhật',
  comments: 'Bình luận',

  // Lọc và sắp xếp
  filter: 'Lọc',
  filterByStatus: 'Lọc theo trạng thái',
  filterAll: 'Tất cả bài viết',
  filterPublished: 'Chỉ bài đã đăng',
  filterDrafts: 'Chỉ bản nháp',
  sortBy: 'Sắp xếp theo',
  sortAsc: 'Tăng dần',
  sortDesc: 'Giảm dần',

  // Thông báo lỗi
  errors: {
    titleRequired: 'Tiêu đề bài viết là bắt buộc',
    contentRequired: 'Nội dung bài viết là bắt buộc',
    createFailed: 'Không thể tạo bài viết, vui lòng thử lại',
    updateFailed: 'Không thể cập nhật bài viết, vui lòng thử lại',
    deleteFailed: 'Không thể xóa bài viết, vui lòng thử lại',
    fetchFailed: 'Không thể tải danh sách bài viết, vui lòng thử lại'
  },

  // Thao tác
  createPost: 'Tạo bài viết',
  updatePost: 'Cập nhật bài viết', 
  deletePost: 'Xóa bài viết',
  publishPost: 'Đăng bài viết',
  unpublishPost: 'Hủy đăng bài viết',
  confirm: 'Xác nhận',
  cancel: 'Hủy',
  saving: 'Đang lưu...',

  // Danh sách bài viết
  postsList: 'Danh sách bài viết',
  searchPlaceholder: 'Tìm kiếm bài viết...',
  noPostsFound: 'Không tìm thấy bài viết nào',
  loadingPosts: 'Đang tải danh sách bài viết...',
  refreshPosts: 'Làm mới danh sách',
  
  // Bảng bài viết
  tableHeaders: {
    title: 'Tiêu đề',
    author: 'Tác giả',
    status: 'Trạng thái',
    created: 'Ngày tạo',
    comments: 'Bình luận',
    actions: 'Thao tác'
  },
  
  // Trang chi tiết bài viết
  postDetails: 'Chi tiết bài viết',
  postComments: 'Bình luận cho bài viết này',
  noComments: 'Chưa có bình luận nào',
  
  // Xác nhận hành động
  confirmDelete: 'Bạn có chắc chắn muốn xóa bài viết này?',
  deleteWarning: 'Hành động này không thể hoàn tác. Tất cả bình luận liên quan đến bài viết này sẽ bị mất.'
};
