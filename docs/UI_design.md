# Thiết Kế Giao Diện Người Dùng cho Hệ Thống ZBase

## 0. Trang Chủ và Menu Đăng Nhập

### 0.1. Trang Chủ (Landing Page)
- **Mô tả**: Trang chủ giới thiệu về hệ thống ZBase, thu hút người dùng và cung cấp thông tin tổng quan
- **Thành phần chính**:
  - Header với logo, menu điều hướng và nút "Đăng Nhập"/"Đăng Ký"
  - Banner chính với hình ảnh minh họa và slogan hệ thống
  - Giới thiệu tóm tắt về ZBase và các lợi ích chính
  - Các tính năng nổi bật (với icon và mô tả ngắn gọn)
  - Số liệu ấn tượng (số doanh nghiệp đang sử dụng, số giao dịch xử lý, etc.)
  - Phần đánh giá từ khách hàng tiêu biểu
  - Form liên hệ hoặc đăng ký dùng thử
  - Footer với thông tin liên hệ, social media và điều khoản sử dụng

### 0.2. Giới Thiệu Hệ Thống
- **Mô tả**: Trang chi tiết giới thiệu về hệ thống ZBase, lịch sử phát triển và tầm nhìn
- **Thành phần chính**:
  - Banner đầu trang với tiêu đề "Về ZBase"
  - Lịch sử phát triển và tầm nhìn của hệ thống
  - Đội ngũ phát triển và quản lý
  - Các công nghệ sử dụng trong hệ thống
  - Lợi thế cạnh tranh và điểm khác biệt
  - Khách hàng tiêu biểu với logo và case study
  - Roadmap phát triển trong tương lai
  - FAQ (Các câu hỏi thường gặp)
  - Call-to-action đăng ký dùng thử hoặc liên hệ

### 0.3. Tính Năng Hệ Thống
- **Mô tả**: Trang giới thiệu chi tiết các tính năng của ZBase
- **Thành phần chính**:
  - Menu điều hướng nhanh đến các nhóm tính năng
  - Danh sách tính năng theo nhóm:
    - Quản lý kho hàng (với hình ảnh minh họa và mô tả)
    - Quản lý bán hàng và POS
    - Quản lý khách hàng và đối tác
    - Báo cáo và phân tích
    - Quản lý tài chính
    - Bảo hành và dịch vụ sau bán hàng
  - Demo ngắn hoặc video giới thiệu cho mỗi tính năng
  - So sánh các gói dịch vụ và tính năng tương ứng
  - Nút đăng ký dùng thử với từng nhóm tính năng

### 0.4. Bảng Giá và Đăng Ký
- **Mô tả**: Trang hiển thị các gói dịch vụ, giá cả và form đăng ký
- **Thành phần chính**:
  - Bảng so sánh các gói dịch vụ (Cơ bản, Chuyên nghiệp, Doanh nghiệp)
  - Chi tiết giá và chu kỳ thanh toán (tháng/năm)
  - Danh sách tính năng có trong mỗi gói
  - Đánh dấu tính năng đặc biệt hoặc giới hạn
  - Nút "Chọn Gói" cho mỗi gói dịch vụ
  - Form đăng ký với thông tin cơ bản
  - Phương thức thanh toán và xác nhận
  - FAQ về thanh toán và nâng cấp/hạ cấp

### 0.5. Menu Đăng Nhập và Điều Hướng
- **Mô tả**: Thiết kế menu chính và hệ thống điều hướng của trang web
- **Thành phần chính**:
  - Menu điều hướng chính với các mục: Trang chủ, Giới thiệu, Tính năng, Bảng giá, Liên hệ
  - Menu phụ: Blog, Trung tâm hỗ trợ, FAQ
  - Nút "Đăng Nhập" nổi bật ở góc phải
  - Dropdown menu "Đăng Nhập" với các tùy chọn:
    - Đăng nhập Admin
    - Đăng nhập POS
    - Đăng nhập Đối tác
    - Quên mật khẩu
  - Menu responsive trên thiết bị di động (hamburger menu)
  - Breadcrumb navigation trên các trang con
  - Chức năng tìm kiếm toàn trang web
  - Công cụ chuyển đổi ngôn ngữ (nếu hỗ trợ đa ngôn ngữ)

### 0.6. Cấu Trúc Navigation Menu (Thay thế Sidebar)
- **Mô tả**: Thiết kế navigation menu ngang cho giao diện Admin và POS
- **Thành phần chính**:
  - **Header menu (ngang trên cùng)** với các nhóm chức năng chính:
    - Logo ZBase (về trang Dashboard)
    - Dropdown Quản lý Kho:
      - Danh sách kho
      - Quản lý tồn kho
      - Xuất/Nhập kho
    - Dropdown Sản phẩm:
      - Danh sách sản phẩm
      - Danh mục sản phẩm
      - Thuộc tính sản phẩm
    - Dropdown Khách hàng:
      - Danh sách khách hàng
      - Nhóm khách hàng
    - Dropdown Bán hàng:
      - Danh sách hóa đơn
      - Tạo hóa đơn mới
      - POS (mở màn hình POS)
    - Dropdown Tài chính:
      - Quản lý thu chi
      - Công nợ
    - Dropdown Báo cáo:
      - Doanh thu
      - Tồn kho
      - Công nợ
      - Phân tích nâng cao
    - Dropdown Hệ thống:
      - Nhân viên
      - Phân quyền
      - Cấu hình
  - **Sub-navigation bar** (ngang thứ 2):
    - Hiện thị các tùy chọn con của mục đang được chọn
    - Breadcrumb navigation
    - Nút tác vụ nhanh (thêm mới, xuất báo cáo)
  - **Thanh tìm kiếm** ở góc phải header
  - **Khu vực thông báo** hiển thị cạnh tìm kiếm
  - **Menu profile người dùng** tại góc phải cùng với các tùy chọn:
    - Thông tin tài khoản
    - Thay đổi mật khẩu
    - Đăng xuất
  - **Responsive design**:
    - Thu gọn menu thành hamburger menu trên thiết bị nhỏ
    - Dropdown menu hiển thị dạng fullscreen trên mobile

### 0.7. Trang Hỗ Trợ và Liên Hệ

### 0.7. Trang Hỗ Trợ và Liên Hệ
- **Mô tả**: Trang cung cấp thông tin hỗ trợ và phương thức liên hệ
- **Thành phần chính**:
  - Form liên hệ với các trường: Họ tên, Email, Số điện thoại, Chủ đề, Nội dung
  - Thông tin liên hệ trực tiếp: số điện thoại, email, địa chỉ
  - Bản đồ vị trí văn phòng
  - Kênh chat trực tuyến
  - Trung tâm tài liệu: Hướng dẫn sử dụng, FAQ, Video tutorial
  - Lịch sử phiên bản và cập nhật mới
  - Diễn đàn cộng đồng người dùng
  - Social media và kênh liên lạc khác

## I. Giao Diện Admin

### 1. Màn Hình Đăng Nhập
- **Mô tả**: Màn hình đăng nhập với xác thực email/mật khẩu
- **Thành phần chính**:
  - Logo hệ thống
  - Form đăng nhập với trường Email và Mật khẩu
  - Nút "Đăng Nhập"
  - Liên kết "Quên Mật Khẩu"
  - Thông báo lỗi (nếu có)
- **Luồng người dùng**:
  - Người dùng nhập email/mật khẩu
  - Hệ thống xác thực và chuyển đến Dashboard nếu thông tin hợp lệ
  - Hiển thị thông báo lỗi nếu thông tin không hợp lệ

### 2. Dashboard Admin
- **Mô tả**: Tổng quan về hoạt động kinh doanh
- **Thành phần chính**:
  - Navigation menu ngang (header) với các mục chức năng chính
  - Thống kê tổng hợp (doanh thu, đơn hàng, khách hàng mới, tồn kho thấp)
  - Biểu đồ doanh thu theo thời gian (ngày/tuần/tháng/năm)
  - Sản phẩm bán chạy nhất
  - Báo động tồn kho thấp
  - Công nợ cần thu/trả gần đến hạn
  - Hoạt động gần đây (đơn hàng, giao dịch)

### 2.1. Layout Dashboard với Navigation Menu
- **Mô tả**: Bố cục tổng thể của Dashboard với navigation menu
- **Thành phần chính**:
  - **Header section**:
    - Logo ở góc trái
    - Navigation menu ngang với dropdown
    - Tìm kiếm, thông báo và user profile ở góc phải
  - **Sub-navigation bar** (ngay dưới header):
    - Breadcrumb navigation
    - Quick actions cho trang hiện tại
    - Filter và tùy chọn view
  - **Content area**:
    - Hiển thị nội dung chính của trang
    - Thiết kế responsive với grid layout
    - Card-based UI cho các thành phần thống kê và biểu đồ
    - Các widget có thể sắp xếp lại (draggable) theo nhu cầu
  - **Footer section**:
    - Thông tin phiên bản hệ thống
    - Copyright và liên kết nhanh
    - Trạng thái hệ thống (số người dùng online, trạng thái server)

### 3. Quản Lý Kho Hàng
- **Màn hình Danh sách kho**:
  - Bảng hiển thị danh sách kho với các thông tin: Mã, Tên, Địa chỉ, Người quản lý
  - Bộ lọc tìm kiếm theo tên, mã, địa chỉ
  - Nút "Thêm Kho Mới"
  - Hành động: Xem chi tiết, Chỉnh sửa, Xóa

- **Màn hình Chi tiết kho**:
  - Thông tin kho (tên, địa chỉ, người quản lý)
  - Thống kê tồn kho (tổng sản phẩm, giá trị)
  - Danh sách vị trí lưu trữ dạng cây (khu vực > dãy > kệ > ngăn > vị trí)
  - Nút "Thêm Vị Trí Mới"
  - Tab hiển thị lịch sử xuất/nhập kho

- **Màn hình Quản lý tồn kho**:
  - Bảng hiển thị tồn kho theo sản phẩm
  - Bộ lọc: kho, danh mục sản phẩm, tên/mã sản phẩm, mức tồn kho
  - Hiển thị: mã sản phẩm, tên, ảnh, số lượng tồn, vị trí, trạng thái (đủ/thấp)
  - Nút "Xuất Kho", "Nhập Kho", "Điều Chỉnh Tồn Kho"
  
- **Màn hình Xuất/Nhập kho**:
  - Form chọn loại giao dịch (xuất/nhập/điều chuyển)
  - Chọn sản phẩm, số lượng, kho, vị trí
  - Thêm nhiều dòng sản phẩm
  - Ghi chú
  - Nút "Hoàn Thành", "Hủy"

### 4. Quản Lý Sản Phẩm
- **Màn hình Danh sách sản phẩm**:
  - Bảng hiển thị sản phẩm với: mã, tên, danh mục, giá cơ bản, giá vốn, tổng tồn kho
  - Bộ lọc: danh mục, mã, tên, nhà sản xuất, mức giá
  - Nút "Thêm Sản Phẩm"
  - Hành động: Xem chi tiết, Chỉnh sửa, Xóa

- **Màn hình Chi tiết/Thêm/Sửa sản phẩm**:
  - Thông tin cơ bản: mã, tên, mô tả, danh mục
  - Giá bán & giá vốn
  - Thuế, đơn vị tính
  - Thuộc tính sản phẩm (màu sắc, kích thước) với khả năng thêm nhiều thuộc tính
  - Thời hạn bảo hành
  - Tồn kho theo từng kho (nếu là màn hình chi tiết)

- **Màn hình Danh mục sản phẩm**:
  - Cấu trúc cây danh mục
  - Khả năng thêm/sửa/xóa danh mục
  - Kéo thả để thay đổi thứ tự/cấu trúc cây

### 5. Quản Lý Khách Hàng
- **Màn hình Danh sách khách hàng**:
  - Bảng hiển thị khách hàng với: mã, tên, điện thoại, email, nhóm, công nợ
  - Bộ lọc: nhóm, tên, địa chỉ, mức công nợ
  - Nút "Thêm Khách Hàng"
  - Hành động: Xem chi tiết, Chỉnh sửa, Xóa

- **Màn hình Chi tiết khách hàng**:
  - Thông tin cơ bản: mã, tên, liên hệ, địa chỉ
  - Nhóm khách hàng
  - Công nợ hiện tại
  - Tab lịch sử mua hàng
  - Tab lịch sử thanh toán
  - Tab thông tin bảo hành

- **Màn hình Nhóm khách hàng**:
  - Bảng hiển thị các nhóm: tên, mô tả, tỷ lệ chiết khấu, giới hạn công nợ
  - Khả năng thêm/sửa/xóa nhóm
  - Liên kết đến bảng giá của từng nhóm

### 6. Quản Lý Đối Tác
- **Màn hình Danh sách đối tác**:
  - Bảng hiển thị đối tác với: mã, tên, người liên hệ, điện thoại, công nợ
  - Nút "Thêm Đối Tác"
  - Hành động: Xem chi tiết, Chỉnh sửa, Xóa

- **Màn hình Chi tiết đối tác**:
  - Thông tin cơ bản: mã, tên, người liên hệ, địa chỉ
  - Tab lịch sử giao dịch
  - Tab công nợ

### 7. Quản Lý Hóa Đơn
- **Màn hình Danh sách hóa đơn**:
  - Bảng hiển thị hóa đơn với: mã, ngày, khách hàng, tổng tiền, đã thanh toán, còn nợ, trạng thái
  - Bộ lọc: theo ngày, khách hàng, trạng thái, kho, nhân viên
  - Nút "Tạo Hóa Đơn Mới"
  - Hành động: Xem chi tiết, In, Hủy

- **Màn hình Chi tiết hóa đơn**:
  - Thông tin hóa đơn: mã, ngày, khách hàng, nhân viên, kho
  - Danh sách sản phẩm: tên, số lượng, giá, chiết khấu, thành tiền, vị trí lấy hàng
  - Tổng tiền, thuế, chiết khấu, thành tiền
  - Thông tin thanh toán: đã thanh toán, còn nợ, phương thức
  - Nút "In Hóa Đơn", "Thanh Toán"

- **Màn hình Tạo hóa đơn**:
  - Chọn khách hàng (hiển thị nhóm khách hàng và chiết khấu)
  - Chọn kho
  - Thêm sản phẩm: tìm kiếm theo mã/tên/mã vạch, số lượng, giá (tự động theo nhóm khách hàng), chiết khấu
  - Tổng tiền, thuế, chiết khấu tổng, thành tiền
  - Thanh toán: số tiền, phương thức
  - Nút "Hoàn Thành", "Lưu Nháp", "Hủy"

### 8. Quản Lý Thu Chi
- **Màn hình Danh sách phiếu thu/chi**:
  - Bảng hiển thị phiếu với: mã, loại (thu/chi), ngày, đối tượng (khách hàng/đối tác), số tiền
  - Bộ lọc: loại, ngày, đối tượng
  - Nút "Tạo Phiếu Thu", "Tạo Phiếu Chi"
  - Hành động: Xem chi tiết, In, Hủy

- **Màn hình Tạo phiếu thu/chi**:
  - Chọn loại phiếu (thu/chi)
  - Chọn đối tượng (khách hàng/đối tác)
  - Hiển thị công nợ hiện tại
  - Chọn hóa đơn liên quan (nếu có)
  - Nhập số tiền, phương thức thanh toán, ghi chú
  - Nút "Hoàn Thành", "Hủy"

### 9. Quản Lý Bảo Hành
- **Màn hình Danh sách bảo hành**:
  - Bảng hiển thị với: mã, sản phẩm, khách hàng, ngày nhận, hạn trả, trạng thái
  - Bộ lọc: theo trạng thái, sản phẩm, khách hàng
  - Nút "Tạo Yêu Cầu Bảo Hành"
  - Hành động: Xem chi tiết, Cập nhật trạng thái

- **Màn hình Chi tiết/Tạo yêu cầu bảo hành**:
  - Thông tin bảo hành: mã, sản phẩm, khách hàng
  - Mô tả lỗi
  - Ngày nhận, hạn trả
  - Trạng thái
  - Nhân viên kỹ thuật phụ trách
  - Ghi chú xử lý
  - Nút "Cập Nhật Trạng Thái"

### 10. Báo Cáo và Phân Tích
- **Màn hình Tổng quan báo cáo**:
  - Danh sách các loại báo cáo có sẵn
  - Báo cáo đã lưu gần đây
  - Nút "Tạo Báo Cáo Tùy Chỉnh"

- **Màn hình Báo cáo Doanh thu**:
  - Lọc theo khoảng thời gian, kho, nhân viên, nhóm khách hàng
  - Biểu đồ doanh thu theo thời gian
  - Bảng chi tiết: ngày, số hóa đơn, doanh thu, lợi nhuận
  - Tùy chọn nhóm theo: ngày/tuần/tháng/quý/năm, nhân viên, kho, nhóm khách hàng
  - Xuất PDF/Excel

- **Màn hình Báo cáo Tồn kho**:
  - Lọc theo kho, danh mục, mức tồn kho
  - Biểu đồ tỷ lệ tồn kho theo danh mục
  - Bảng chi tiết: mã, tên, tồn đầu kỳ, nhập trong kỳ, xuất trong kỳ, tồn cuối kỳ, giá trị
  - Danh sách sản phẩm tồn kho dưới mức tối thiểu
  - Xuất PDF/Excel

- **Màn hình Báo cáo Công nợ**:
  - Lọc theo loại (khách hàng/đối tác), khoảng thời gian
  - Biểu đồ công nợ theo thời gian
  - Bảng chi tiết: đối tượng, công nợ đầu kỳ, phát sinh, thanh toán, công nợ cuối kỳ
  - Phân tích tuổi nợ (30/60/90 ngày)
  - Xuất PDF/Excel

- **Màn hình Phân tích nâng cao**:
  - Dashboard tương tác với nhiều loại biểu đồ
  - Phân tích xu hướng bán hàng
  - Phân tích hiệu quả theo nhóm khách hàng
  - Dự báo nhu cầu
  - Bộ lọc đa chiều

### 11. Quản Lý Nhân Viên và Ca Làm Việc
- **Màn hình Danh sách nhân viên**:
  - Bảng hiển thị nhân viên với: tên, email, vai trò, trạng thái
  - Nút "Thêm Nhân Viên"
  - Hành động: Xem chi tiết, Chỉnh sửa, Vô hiệu hóa

- **Màn hình Thêm/Sửa nhân viên**:
  - Thông tin cơ bản: tên, email, mật khẩu (khi thêm mới)
  - Vai trò (admin/pos)
  - Kho làm việc

- **Màn hình Danh sách ca làm việc**:
  - Bảng hiển thị ca với: nhân viên, kho, thời gian bắt đầu/kết thúc, tổng doanh thu
  - Bộ lọc: theo ngày, nhân viên, kho, trạng thái
  - Hành động: Xem chi tiết

- **Màn hình Chi tiết ca làm việc**:
  - Thông tin ca: nhân viên, kho, thời gian
  - Tiền mặt đầu/cuối ca
  - Danh sách hóa đơn trong ca
  - Danh sách phiếu thu/chi trong ca
  - Thống kê: doanh thu, lợi nhuận, số hóa đơn

### 12. Cấu Hình Hệ Thống
- **Màn hình Quản lý vai trò**:
  - Bảng hiển thị vai trò với: tên, mô tả, số lượng người dùng
  - Nút "Thêm Vai Trò"
  - Hành động: Xem chi tiết, Chỉnh sửa, Xóa

- **Màn hình Phân quyền**:
  - Danh sách quyền theo nhóm chức năng
  - Checkbox chọn quyền cho từng vai trò
  - Nút "Lưu Thay Đổi"

- **Màn hình Cấu hình hệ thống**:
  - Thông tin doanh nghiệp: tên, logo, địa chỉ, thông tin liên hệ
  - Cấu hình mẫu in (hóa đơn, phiếu thu/chi, báo cáo)
  - Cấu hình thuế, đơn vị tiền tệ
  - Cấu hình thông báo (email, cảnh báo tồn kho thấp)

## II. Giao Diện Người Dùng POS

### 1. Đăng Nhập POS
- **Mô tả**: Màn hình đăng nhập dành riêng cho nhân viên bán hàng
- **Thành phần chính**:
  - Form đăng nhập với trường Email và Mật khẩu
  - Nút "Đăng Nhập"
  - Giao diện đơn giản, tối ưu cho màn hình cảm ứng

### 2. Navigation POS và Quản Lý Ca Làm Việc
- **Cấu trúc Navigation POS**:
  - Navigation bar trên cùng với các mục chức năng chính:
    - Logo hệ thống (về màn hình chính)
    - Nút lớn "Bán Hàng" (chức năng chính)
    - Nút "Đơn Hàng" (xem danh sách đơn hàng trong ca)
    - Nút "Bảo Hành" (kiểm tra và tạo yêu cầu bảo hành)
    - Nút "Thông Tin Ca" (xem thông tin ca hiện tại)
    - Hiển thị tên nhân viên và kho đang làm việc
    - Nút "Đóng Ca" nổi bật ở góc phải
  - Thanh thông báo dưới navigation hiển thị thông tin quan trọng
  - Thiết kế nút lớn, dễ chạm, khoảng cách hợp lý cho màn hình cảm ứng
  - Responsive trên các kích thước màn hình POS

- **Màn hình Mở ca**:
  - Hiển thị thông tin nhân viên và kho làm việc
  - Nhập số tiền mặt ban đầu
  - Nút "Bắt Đầu Ca"

- **Màn hình Đóng ca**:
  - Thống kê ca hiện tại: thời gian, doanh thu, số đơn hàng
  - Kiểm kê tiền mặt cuối ca
  - Bảng tổng hợp theo phương thức thanh toán
  - Ghi chú đóng ca
  - Nút "Kết Thúc Ca"

### 3. Bán Hàng
- **Màn hình Bán hàng chính**:
  - Phân chia thành 3 khu vực:
    - Trái: Danh mục sản phẩm và tìm kiếm
    - Giữa: Giỏ hàng hiện tại
    - Phải: Thông tin khách hàng và thanh toán
  
  - **Khu vực sản phẩm (trái)**:
    - Thanh tìm kiếm sản phẩm theo mã/tên/mã vạch
    - Danh mục sản phẩm dạng nút lớn, dễ chạm
    - Hiển thị sản phẩm dạng lưới với hình ảnh, giá, tồn kho
    - Khi chọn sản phẩm: hiển thị modal nhập số lượng

  - **Khu vực giỏ hàng (giữa)**:
    - Danh sách sản phẩm đã chọn: tên, số lượng, đơn giá, thành tiền
    - Nút tăng/giảm số lượng cho từng dòng
    - Nút xóa sản phẩm
    - Tổng cộng: số lượng sản phẩm, tổng tiền, thuế, chiết khấu, thành tiền
    - Nút "Xóa Giỏ Hàng"

  - **Khu vực khách hàng & thanh toán (phải)**:
    - Tìm kiếm/chọn khách hàng (hiển thị nhóm khách hàng, chính sách giá)
    - Hiển thị công nợ hiện tại
    - Nút "Khách Hàng Mới"
    - Chọn chiết khấu (% hoặc số tiền)
    - Nhập số tiền thanh toán
    - Hiển thị tiền thừa/còn nợ
    - Chọn phương thức thanh toán
    - Nút "Hoàn Thành", "Lưu Tạm", "Hủy"

- **Màn hình Hoàn thành thanh toán**:
  - Tóm tắt hóa đơn
  - Tùy chọn in hóa đơn
  - Hiển thị vị trí lấy hàng cho từng sản phẩm
  - Nút "Tạo Đơn Hàng Mới", "In Lại Hóa Đơn"

### 4. Quản Lý Đơn Hàng
- **Màn hình Danh sách hóa đơn trong ca**:
  - Bảng hiển thị hóa đơn: mã, thời gian, khách hàng, tổng tiền, trạng thái
  - Bộ lọc nhanh: tất cả, đã thanh toán, còn nợ
  - Hành động: Xem chi tiết, In lại, Thanh toán (nếu còn nợ)

- **Màn hình Chi tiết hóa đơn**:
  - Thông tin hóa đơn
  - Danh sách sản phẩm
  - Thông tin thanh toán
  - Nút "In Lại", "Thanh Toán Nợ" (nếu còn nợ)

### 5. Bảo Hành
- **Màn hình Kiểm tra bảo hành**:
  - Tìm kiếm theo mã hóa đơn/sản phẩm/khách hàng
  - Hiển thị thông tin bảo hành: sản phẩm, thời hạn, trạng thái

- **Màn hình Tạo yêu cầu bảo hành**:
  - Tìm kiếm sản phẩm/hóa đơn
  - Chọn khách hàng
  - Mô tả lỗi
  - Nút "Tạo Yêu Cầu"

## III. Luồng Khác Biệt Giữa Admin & POS

### 1. Đăng Nhập
- **Admin**: Sau khi đăng nhập chuyển đến Dashboard với nhiều chức năng
- **POS**: Sau khi đăng nhập bắt buộc phải mở ca trước khi sử dụng

### 2. Bán Hàng
- **Admin**: Có thể tạo hóa đơn với nhiều tùy chọn chi tiết, bao gồm việc điều chỉnh giá, thanh toán nhiều đợt, và cấu hình nhiều thông số
- **POS**: Giao diện đơn giản hóa, tối ưu cho màn hình cảm ứng, tập trung vào quy trình bán hàng nhanh chóng

### 3. Quản Lý Tồn Kho
- **Admin**: Toàn quyền quản lý kho, xuất/nhập kho, điều chỉnh tồn kho, phân quyền cho nhân viên
- **POS**: Chỉ xem thông tin tồn kho và vị trí lấy hàng

### 4. Báo Cáo
- **Admin**: Truy cập đầy đủ các loại báo cáo và phân tích nâng cao
- **POS**: Chỉ xem báo cáo ca làm việc hiện tại

### 5. Cấu Hình
- **Admin**: Toàn quyền cấu hình hệ thống, quản lý người dùng, phân quyền
- **POS**: Không có quyền cấu hình hệ thống

## IV. Tính Năng Trực Quan và UX

### 1. Điều Hướng Thông Minh
- **Admin**: Navigation menu ngang ở header với dropdown cho các mục phức tạp, breadcrumb để điều hướng, tìm kiếm toàn hệ thống
- **POS**: Menu đơn giản dạng ngang, nút lớn dễ chạm, tập trung vào các chức năng chính

### 2. Hiển Thị Thông Báo
- **Admin**: Thông báo tồn kho thấp, công nợ đến hạn, yêu cầu bảo hành mới
- **POS**: Thông báo về ca làm việc, thông tin tồn kho sản phẩm đang bán

### 3. Trực Quan Hóa Dữ Liệu
- **Admin**: Biểu đồ và dashboard tương tác, bảng dữ liệu có thể tùy chỉnh và xuất báo cáo
- **POS**: Hiển thị tóm tắt, biểu đồ đơn giản về bán hàng trong ca

### 4. Hỗ Trợ Thiết Bị
- **Admin**: Tối ưu cho máy tính để bàn, hỗ trợ tablet
- **POS**: Tối ưu cho màn hình cảm ứng, hỗ trợ máy tính bảng và màn hình POS chuyên dụng

## V. Đề Xuất Cải Tiến

### 1. Cải Tiến Navigation
- **Navigation menu tùy chỉnh**: Cho phép người dùng tùy chỉnh thứ tự và hiển thị của các mục menu theo nhu cầu sử dụng
- **Menu pinned**: Khả năng ghim các menu thường dùng để truy cập nhanh
- **Last visited**: Lưu trữ và hiển thị các trang đã truy cập gần đây
- **Context-aware navigation**: Menu thay đổi thông minh theo ngữ cảnh công việc đang thực hiện
- **Quick actions**: Menu hành động nhanh hiển thị các chức năng phổ biến theo ngữ cảnh

### 2. Hệ Thống Quản Lý Khách Hàng Nâng Cao
- **Chấm điểm khách hàng**: Theo lịch sử mua hàng, thanh toán đúng hạn
- **Chương trình khách hàng thân thiết**: Tích điểm, phần thưởng

### 3. Tối Ưu Hóa Vị Trí Lưu Trữ
- **Bản đồ trực quan**: Hiển thị bản đồ kho với vị trí sản phẩm
- **Đề xuất vị trí lưu trữ tối ưu**: Dựa trên tần suất bán hàng

### 4. Mở Rộng Báo Cáo
- **Báo cáo tùy chỉnh**: Người dùng có thể tùy chỉnh báo cáo theo nhu cầu
- **Dự báo nhu cầu AI**: Sử dụng dữ liệu lịch sử để dự báo nhu cầu mua hàng

### 5. Tích Hợp Tiếp Thị
- **Email marketing**: Gửi email tự động cho khách hàng
- **Khuyến mãi thông minh**: Đề xuất khuyến mãi dựa trên lịch sử mua hàng

### 4. Responsive Design cho Navigation
- **Màn hình lớn (Desktop)**:
  - Navigation menu ngang hiển thị đầy đủ
  - Dropdown menu hiển thị khi hover/click
  - Sub-navigation bar hiển thị đầy đủ các tùy chọn
  - Khu vực làm việc chiếm toàn bộ chiều rộng sau khi cuộn qua header

- **Màn hình trung bình (Tablet)**:
  - Navigation menu thu gọn bớt các menu item, chỉ giữ lại các mục chính
  - Các mục phụ được gom vào dropdown "Khác"
  - Sub-navigation bar hiển thị theo chiều ngang với chức năng scroll ngang
  - Tối ưu không gian hiển thị cho nội dung chính

- **Màn hình nhỏ (Mobile/Smartphone)**:
  - Navigation menu chuyển thành hamburger menu
  - Dropdown fullscreen khi mở menu
  - Tổ chức các mục menu theo nhóm chức năng có thể collapse/expand
  - Ưu tiên hiển thị các chức năng thường xuyên sử dụng
  - Tối ưu cho thao tác bằng tay

- **Màn hình POS**:
  - Thiết kế đặc biệt cho màn hình cảm ứng POS
  - Nút lớn, dễ chạm
  - Khoảng cách giữa các phần tử đủ rộng
  - Tối ưu cho thao tác nhanh khi phục vụ khách hàng
