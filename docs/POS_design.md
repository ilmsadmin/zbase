# Thiết Kế Hệ Thống Quản Lý Bán Hàng (Admin và POS)

Hệ thống quản lý bán hàng được xây dựng trên nền tảng base (NestJS, NextJS, PostgreSQL, MongoDB, Redis, Docker), hỗ trợ hai tầng người dùng: **Admin** (quản lý toàn diện) và **POS** (bán hàng, ca làm việc). Hệ thống tích hợp xác thực/phân quyền RBAC và tự động load actions từ API.

## 1. Tổng Quan Hệ Thống
- **Backend**: NestJS, cung cấp API cho quản lý kho, sản phẩm, khách hàng, đối tác, hóa đơn, phiếu thu/chi, bảo hành, báo cáo, nhân viên, ca làm việc, bán hàng.
- **Frontend**: NextJS với Tailwind CSS, cung cấp giao diện admin (quản lý) và POS (bán hàng, ca).
- **Cơ sở dữ liệu**:
  - **PostgreSQL**: Lưu trữ dữ liệu có cấu trúc (kho, sản phẩm, khách hàng, đối tác, hóa đơn, v.v.).
  - **MongoDB**: Lưu trữ logs (xuất/nhập kho, bán hàng, bảo hành).
  - **Redis**: Quản lý session JWT, cache sản phẩm/tồn kho.
- **Triển khai**: Docker Compose, tận dụng cấu hình hiện có.
- **Xác thực/phân quyền**: RBAC với roles (`admin`, `pos`), tự động load actions từ API.

## 2. Chức Năng Chính

### 2.1. Tầng Admin
1. **Quản lý kho hàng**:
   - Tạo/sửa/xóa kho (tên, địa chỉ, người phụ trách).
   - Theo dõi tồn kho theo sản phẩm/kho.
   - Thực hiện xuất/nhập kho, cập nhật tồn kho, ghi log.
   - Xem lịch sử xuất/nhập kho.
2. **Quản lý sản phẩm**:
   - Thêm/sửa/xóa sản phẩm (mã, tên, danh mục, giá, thuộc tính: màu, kích thước).
   - Gán sản phẩm vào kho với số lượng tồn.
3. **Quản lý khách hàng**:
   - Lưu thông tin (tên, điện thoại, email, địa chỉ).
   - Theo dõi lịch sử mua hàng, công nợ.
4. **Quản lý đối tác**:
   - Lưu thông tin nhà cung cấp/khách buôn (tên, liên hệ, hợp đồng).
   - Quản lý công nợ (nợ phải trả/được thu).
5. **Quản lý hóa đơn**:
   - Tạo/xem/sửa/xóa hóa đơn bán hàng (liên kết khách hàng, kho).
   - Trạng thái: Đã thanh toán, đang chờ, hủy.
6. **Quản lý phiếu thu/chi**:
   - Tạo phiếu thu (thu tiền khách) hoặc phiếu chi (thanh toán đối tác).
   - Ghi nhận số tiền, ngày, mục đích.
7. **Quản lý bảo hành**:
   - Tạo/theo dõi yêu cầu bảo hành (sản phẩm, khách hàng, thời hạn).
   - Xem lịch sử bảo hành.
8. **Báo cáo**:
   - Doanh thu (ngày, tuần, tháng, nhân viên, kho).
   - Tồn kho (sản phẩm, kho, cảnh báo tồn thấp).
   - Công nợ (khách hàng, đối tác).
   - Hiệu suất nhân viên (doanh thu ca, số hóa đơn).
9. **Quản lý nhân viên**:
   - Thêm/sửa/xóa nhân viên, gán vai trò (`admin`, `pos`).
   - Theo dõi hoạt động qua ca làm việc, hóa đơn.

### 2.2. Tầng POS
1. **Quản lý ca làm việc**:
   - Mở ca: Ghi nhận thời gian bắt đầu, tiền mặt ban đầu.
   - Đóng ca: Kiểm kê tiền mặt, tính doanh thu, gửi báo cáo.
2. **Bán hàng**:
   - Tạo hóa đơn: Chọn sản phẩm, số lượng, áp dụng khuyến mãi, thanh toán (tiền mặt, thẻ, ví điện tử).
   - Cập nhật tồn kho, ghi log bán hàng.
3. **Bảo hành**:
   - Kiểm tra trạng thái bảo hành (mã hóa đơn/sản phẩm).
   - Tạo yêu cầu bảo hành, gửi lên admin.

## 3. Luồng Thao Tác

### 3.1. Tầng Admin
1. **Quản lý kho hàng**:
   - Đăng nhập → Truy cập `/admin/warehouses`.
   - Tạo kho: Nhập tên, địa chỉ, người phụ trách.
   - Nhập/xuất kho: Chọn sản phẩm, số lượng, kho → Cập nhật tồn kho, log vào MongoDB.
   - Xem lịch sử hoặc báo cáo tồn kho.
2. **Quản lý sản phẩm**:
   - Truy cập `/admin/products`, thêm/sửa sản phẩm (mã, tên, giá, danh mục, thuộc tính).
   - Gán sản phẩm vào kho.
3. **Quản lý khách hàng/đối tác**:
   - Truy cập `/admin/customers` hoặc `/admin/partners`, thêm/sửa thông tin.
   - Xem lịch sử mua hàng, công nợ.
4. **Quản lý hóa đơn/phiếu thu/chi**:
   - Truy cập `/admin/invoices`, tạo/xem hóa đơn.
   - Truy cập `/admin/transactions`, tạo phiếu thu/chi, cập nhật công nợ.
5. **Quản lý bảo hành**:
   - Truy cập `/admin/warranties`, tạo/xem yêu cầu bảo hành.
   - Cập nhật trạng thái (đang xử lý, hoàn thành).
6. **Báo cáo**:
   - Truy cập `/admin/reports`, chọn loại báo cáo (doanh thu, tồn kho, công nợ).
   - Xem biểu đồ hoặc tải báo cáo (PDF/Excel).
7. **Quản lý nhân viên**:
   - Truy cập `/admin/employees`, thêm/sửa nhân viên, gán vai trò.
   - Theo dõi hoạt động qua ca hoặc hóa đơn.

### 3.2. Tầng POS
1. **Quản lý ca làm việc**:
   - Đăng nhập → Truy cập `/pos/shifts`.
   - Mở ca: Nhập tiền mặt ban đầu, lưu vào PostgreSQL.
   - Đóng ca: Kiểm kê tiền mặt, tính doanh thu, gửi báo cáo.
2. **Bán hàng**:
   - Truy cập `/pos/sales`, chọn sản phẩm (cache Redis).
   - Tạo hóa đơn: Thêm sản phẩm, khuyến mãi, thanh toán.
   - Gửi hóa đơn: Cập nhật tồn kho, log vào MongoDB.
3. **Bảo hành**:
   - Truy cập `/pos/warranties`, kiểm tra bảo hành (mã hóa đơn/sản phẩm).
   - Tạo yêu cầu bảo hành, gửi lên admin.

