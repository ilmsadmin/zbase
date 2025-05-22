// File chứa các thông điệp tiếng Việt cho module quản lý sản phẩm
export default {
  title: 'Quản lý sản phẩm',
  list: {
    title: 'Danh sách sản phẩm',
    search: 'Tìm kiếm sản phẩm...',
    filter: 'Lọc theo',
    allCategories: 'Tất cả danh mục',
    new: 'Thêm sản phẩm mới',
    import: 'Nhập từ Excel',
    export: 'Xuất Excel'
  },
  table: {
    id: 'ID',
    sku: 'Mã SKU',
    image: 'Hình ảnh',
    name: 'Tên sản phẩm',
    category: 'Danh mục',
    price: 'Giá',
    stock: 'Tồn kho',
    status: 'Trạng thái',
    actions: 'Thao tác'
  },
  status: {
    active: 'Đang bán',
    inactive: 'Ngừng bán',
    outOfStock: 'Hết hàng',
    lowStock: 'Sắp hết',
    discontinued: 'Ngừng kinh doanh'
  },
  detail: {
    title: 'Chi tiết sản phẩm',
    basicInfo: 'Thông tin cơ bản',
    pricing: 'Thông tin giá',
    inventory: 'Thông tin tồn kho',
    attributes: 'Thuộc tính sản phẩm',
    media: 'Hình ảnh & Media',
    related: 'Sản phẩm liên quan'
  },
  form: {
    basicInfo: {
      name: 'Tên sản phẩm',
      namePlaceholder: 'Nhập tên sản phẩm',
      sku: 'Mã SKU',
      skuPlaceholder: 'Nhập mã SKU',
      barcode: 'Mã vạch',
      barcodePlaceholder: 'Nhập mã vạch',
      category: 'Danh mục',
      categoryPlaceholder: 'Chọn danh mục',
      description: 'Mô tả',
      descriptionPlaceholder: 'Nhập mô tả sản phẩm',
      shortDescription: 'Mô tả ngắn',
      shortDescriptionPlaceholder: 'Nhập mô tả ngắn',
      brand: 'Thương hiệu',
      brandPlaceholder: 'Chọn thương hiệu',
      status: 'Trạng thái',
      statusPlaceholder: 'Chọn trạng thái'
    },
    pricing: {
      retailPrice: 'Giá bán lẻ',
      retailPricePlaceholder: 'Nhập giá bán lẻ',
      wholesalePrice: 'Giá bán sỉ',
      wholesalePricePlaceholder: 'Nhập giá bán sỉ',
      costPrice: 'Giá nhập',
      costPricePlaceholder: 'Nhập giá nhập',
      tax: 'Thuế (%)',
      taxPlaceholder: 'Nhập % thuế',
      priceList: 'Bảng giá',
      priceListPlaceholder: 'Chọn bảng giá'
    },
    inventory: {
      trackInventory: 'Theo dõi tồn kho',
      initialStock: 'Số lượng ban đầu',
      initialStockPlaceholder: 'Nhập số lượng',
      lowStockThreshold: 'Ngưỡng cảnh báo hết hàng',
      lowStockThresholdPlaceholder: 'Nhập ngưỡng cảnh báo',
      warehouse: 'Kho hàng',
      warehousePlaceholder: 'Chọn kho hàng',
      location: 'Vị trí trong kho',
      locationPlaceholder: 'Chọn vị trí'
    },
    attributes: {
      add: 'Thêm thuộc tính',
      name: 'Tên thuộc tính',
      namePlaceholder: 'Nhập tên thuộc tính',
      value: 'Giá trị',
      valuePlaceholder: 'Nhập giá trị',
      remove: 'Xóa'
    },
    media: {
      mainImage: 'Hình ảnh chính',
      additionalImages: 'Hình ảnh bổ sung',
      dragAndDrop: 'Kéo và thả file hoặc',
      browse: 'Chọn file',
      uploadRequirements: 'PNG, JPG hoặc GIF (tối đa 5MB)',
      remove: 'Xóa'
    },
    related: {
      add: 'Thêm sản phẩm liên quan',
      search: 'Tìm sản phẩm',
      selected: 'Đã chọn:',
      remove: 'Xóa'
    },
    buttons: {
      save: 'Lưu sản phẩm',
      saveAndNew: 'Lưu và tạo mới',
      cancel: 'Hủy bỏ',
      delete: 'Xóa sản phẩm'
    }
  },  messages: {
    created: 'Sản phẩm đã được tạo thành công.',
    updated: 'Sản phẩm đã được cập nhật thành công.',
    deleted: 'Sản phẩm đã được xóa thành công.',
    error: 'Có lỗi xảy ra. Vui lòng thử lại sau.'
  },
  loading: 'Đang tải dữ liệu sản phẩm...',
  refresh: 'Làm mới',
  searchPlaceholder: 'Tìm kiếm theo tên hoặc mã sản phẩm',
  filterByCategory: 'Lọc theo danh mục',
  code: 'Mã',
  name: 'Tên sản phẩm',
  category: 'Danh mục',
  basePrice: 'Giá cơ bản',
  inventory: 'Tồn kho',
  actions: 'Thao tác',
  noProducts: 'Không có sản phẩm nào',
  addProduct: 'Thêm sản phẩm mới',
  barcode: 'Mã vạch',
  taxRate: 'Thuế suất',
  units: 'đơn vị',
  showing: 'Hiển thị',
  to: 'đến',
  of: 'trong số',
  results: 'kết quả',
  previous: 'Trước',
  next: 'Tiếp',
  uncategorized: 'Chưa phân loại',
  confirmDelete: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
  allCategories: 'Tất cả danh mục',
  errors: {
    fetchFailed: 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.',
    deleteFailed: 'Không thể xóa sản phẩm. Vui lòng thử lại sau.'
  },
  categories: {
    title: 'Danh mục sản phẩm',
    new: 'Thêm danh mục mới',
    edit: 'Chỉnh sửa danh mục',
    form: {
      name: 'Tên danh mục',
      namePlaceholder: 'Nhập tên danh mục',
      parent: 'Danh mục cha',
      parentPlaceholder: 'Chọn danh mục cha (nếu có)',
      description: 'Mô tả',
      descriptionPlaceholder: 'Nhập mô tả danh mục',
      save: 'Lưu danh mục',
      cancel: 'Hủy bỏ'
    },
    messages: {
      created: 'Danh mục đã được tạo thành công.',
      updated: 'Danh mục đã được cập nhật thành công.',
      deleted: 'Danh mục đã được xóa thành công.',
      error: 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    }
  },
  attributes: {
    title: 'Thuộc tính sản phẩm',
    new: 'Thêm thuộc tính mới',
    edit: 'Chỉnh sửa thuộc tính',
    form: {
      name: 'Tên thuộc tính',
      namePlaceholder: 'Nhập tên thuộc tính (ví dụ: Màu sắc, Kích thước)',
      type: 'Loại thuộc tính',
      typePlaceholder: 'Chọn loại thuộc tính',
      values: 'Giá trị thuộc tính',
      valuesPlaceholder: 'Nhập giá trị và nhấn Enter (ví dụ: Đỏ, Xanh, Vàng)',
      isFilterable: 'Cho phép lọc sản phẩm theo thuộc tính này',
      isRequired: 'Bắt buộc nhập thuộc tính này khi tạo sản phẩm',
      save: 'Lưu thuộc tính',
      cancel: 'Hủy bỏ'
    },
    types: {
      text: 'Văn bản',
      number: 'Số',
      boolean: 'Có/Không',
      select: 'Lựa chọn (một)',
      multiSelect: 'Lựa chọn (nhiều)',
      color: 'Màu sắc',
      date: 'Ngày tháng'
    },
    messages: {
      created: 'Thuộc tính đã được tạo thành công.',
      updated: 'Thuộc tính đã được cập nhật thành công.',
      deleted: 'Thuộc tính đã được xóa thành công.',
      error: 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    }
  }
};
