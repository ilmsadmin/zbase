export default {
  title: 'Kho hàng',
  subtitle: 'Quản lý kho hàng và vị trí',
  create: 'Tạo kho hàng',
  edit: 'Sửa kho hàng',
  delete: 'Xóa kho hàng',
  confirmDelete: 'Bạn có chắc chắn muốn xóa kho hàng này không?',
  confirmDeleteLocation: 'Bạn có chắc chắn muốn xóa vị trí này không?',
  fields: {
    name: 'Tên',
    code: 'Mã',
    address: 'Địa chỉ',
    city: 'Thành phố',
    state: 'Tỉnh/Thành phố',
    zipCode: 'Mã bưu điện',
    country: 'Quốc gia',
    phone: 'Điện thoại',
    email: 'Email',
    manager: 'Quản lý',
    status: 'Trạng thái',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật'
  },
  locations: {
    title: 'Vị trí',
    create: 'Tạo vị trí',
    edit: 'Sửa vị trí',
    delete: 'Xóa vị trí',
    fields: {
      name: 'Tên vị trí',
      code: 'Mã vị trí',
      type: 'Loại',
      aisle: 'Dãy',
      shelf: 'Kệ',
      bin: 'Ngăn',
      status: 'Trạng thái',
      createdAt: 'Ngày tạo',
      updatedAt: 'Ngày cập nhật'
    }
  },
  statuses: {
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    maintenance: 'Đang bảo trì',
    closed: 'Đã đóng'
  },
  detail: {
    title: 'Chi tiết kho hàng',
    overview: 'Tổng quan',
    locations: 'Vị trí',
    inventory: 'Tồn kho',
    backToList: 'Quay lại danh sách kho hàng',
    addLocation: 'Thêm vị trí'
  },  errors: {
    fetchFailed: 'Không thể tải dữ liệu kho hàng',
    updateFailed: 'Không thể cập nhật kho hàng',
    deleteFailed: 'Không thể xóa kho hàng',
    createFailed: 'Không thể tạo kho hàng',
    locationFetchFailed: 'Không thể tải dữ liệu vị trí',
    locationUpdateFailed: 'Không thể cập nhật vị trí',
    locationDeleteFailed: 'Không thể xóa vị trí',
    locationCreateFailed: 'Không thể tạo vị trí',
    invalidId: 'Mã kho hàng không hợp lệ'
  },
  success: {
    created: 'Đã tạo kho hàng thành công',
    updated: 'Đã cập nhật kho hàng thành công',
    deleted: 'Đã xóa kho hàng thành công',
    locationCreated: 'Đã tạo vị trí thành công',
    locationUpdated: 'Đã cập nhật vị trí thành công',
    locationDeleted: 'Đã xóa vị trí thành công'
  }
};
