# Thiết Kế Hệ Thống: Ứng dụng Đăng Nhập, Xác Thực và Phân Quyền

## 1. Tổng Quan Hệ Thống

Hệ thống là một ứng dụng web với kiến trúc client-server, hỗ trợ đăng nhập, xác thực, và phân quyền dựa trên vai trò (RBAC - Role-Based Access Control). Hệ thống tự động quét các hành động (actions) từ backend để tạo permissions và gán vào roles. Dữ liệu được lưu trữ trên PostgreSQL (dữ liệu có cấu trúc), MongoDB (logs hoặc dữ liệu không cấu trúc), và Redis (session/cache). Toàn bộ ứng dụng chạy trong các container Docker để đảm bảo tính di động và dễ triển khai.

### Thành Phần Chính
- **Frontend (NextJS + Tailwind CSS)**: Giao diện người dùng với trang đăng nhập, dashboard, và các trang quản trị (quản lý user/role). Tailwind CSS đảm bảo giao diện responsive, dễ tùy chỉnh.
- **Backend (NestJS)**: Xử lý logic nghiệp vụ, cung cấp API cho đăng nhập, xác thực, quản lý user/role, và tự động load actions.
- **Cơ Sở Dữ Liệu**:
  - **PostgreSQL**: Lưu trữ thông tin users, roles, permissions với quan hệ chặt chẽ.
  - **MongoDB**: Lưu trữ logs (ví dụ: lịch sử đăng nhập, hành động người dùng).
  - **Redis**: Lưu trữ session JWT và cache để tăng hiệu suất.
- **Docker**: Container hóa các dịch vụ (frontend, backend, databases) để triển khai đồng nhất.

## 2. Chức Năng Chính

1. **Đăng Nhập**:
   - Người dùng nhập email và password trên giao diện frontend.
   - Backend kiểm tra thông tin đăng nhập, tạo JWT, lưu session vào Redis.
   - Trả về JWT cho frontend để sử dụng trong các request tiếp theo.

2. **Xác Thực**:
   - Mỗi request tới API được bảo vệ phải kèm theo JWT trong header (Authorization: Bearer <token>).
   - Backend xác thực JWT, kiểm tra session trong Redis để đảm bảo token hợp lệ và chưa hết hạn.
   - Nếu xác thực thất bại, trả về lỗi 401 Unauthorized.

3. **Phân Quyền (RBAC)**:
   - Người dùng được gán một hoặc nhiều roles (ví dụ: admin, editor, viewer).
   - Mỗi role được gán một tập hợp permissions (ví dụ: create_user, view_report).
   - Các API được bảo vệ bởi guard kiểm tra role/permission của người dùng trước khi cho phép truy cập.
   - Ví dụ: Chỉ admin có permission "delete_user" mới được gọi API xóa user.

4. **Tự Động Load Actions**:
   - Backend tự động quét các route/controller (ví dụ: GET /users, POST /reports) để tạo permissions tương ứng (ví dụ: "view_users", "create_reports").
   - Permissions được lưu vào PostgreSQL và có thể gán cho roles thông qua giao diện quản trị hoặc logic mặc định.
   - Hệ thống hỗ trợ cập nhật permissions khi có route mới mà không cần cấu hình thủ công.

5. **Quản Lý Users/Roles**:
   - Admin có thể tạo, sửa, xóa users, roles, và permissions thông qua giao diện quản trị.
   - Giao diện hiển thị danh sách users, roles, và permissions, cho phép gán role cho user hoặc permission cho role.
   - Hỗ trợ tìm kiếm và lọc để quản lý dễ dàng.

## 3. Luồng Thao Tác

### Luồng Đăng Nhập
1. Người dùng truy cập trang `/login` trên frontend.
2. Nhập email và password, nhấn "Đăng nhập".
3. Frontend gửi POST request tới `/auth/login` với body `{ email, password }`.
4. Backend:
   - Kiểm tra email/password trong PostgreSQL.
   - Nếu hợp lệ, tạo JWT với payload chứa user ID và roles.
   - Lưu JWT và thông tin session vào Redis (TTL: 24 giờ).
   - Trả về `{ access_token }` cho frontend.
5. Frontend lưu JWT vào localStorage hoặc cookie, chuyển hướng tới `/dashboard`.

### Luồng Xác Thực và Phân Quyền
1. Người dùng gửi request tới API được bảo vệ (ví dụ: GET `/users`).
2. Frontend đính kèm JWT trong header `Authorization: Bearer <token>`.
3. Backend:
   - Xác thực JWT, kiểm tra session trong Redis.
   - Lấy roles của user từ payload JWT.
   - Kiểm tra permissions của role so với action yêu cầu (ví dụ: "view_users").
   - Nếu hợp lệ, xử lý request và trả về kết quả.
   - Nếu không, trả về lỗi 403 Forbidden.

### Luồng Tự Động Load Actions
1. Khi backend khởi động, quét toàn bộ route/controller (sử dụng metadata hoặc reflection).
2. Tạo danh sách actions (ví dụ: "view_users", "create_reports") và lưu vào bảng `permissions` trong PostgreSQL.
3. Admin có thể gán permissions vào roles thông qua API hoặc giao diện quản trị.
4. Khi có route mới, hệ thống tự động cập nhật permissions mà không cần khởi động lại.

### Luồng Quản Lý Users/Roles
1. Admin đăng nhập, truy cập trang `/admin/users` hoặc `/admin/roles`.
2. Frontend gọi API (ví dụ: GET `/users`, POST `/roles`) để lấy hoặc cập nhật dữ liệu.
3. Backend xử lý yêu cầu, lưu trữ thay đổi vào PostgreSQL.
4. MongoDB ghi log hành động (ví dụ: "Admin created user ID 123").

## 4. Thiết Kế Database

### PostgreSQL (Dữ liệu có cấu trúc)
Sử dụng PostgreSQL để lưu trữ thông tin users, roles, permissions với các bảng sau:

#### Bảng `users`
- **Mô tả**: Lưu thông tin người dùng.
- **Cấu trúc**:
  - `id` (SERIAL, PRIMARY KEY): ID duy nhất của user.
  - `email` (VARCHAR, UNIQUE): Email người dùng.
  - `password` (VARCHAR): Mật khẩu mã hóa (sử dụng bcrypt).
  - `name` (VARCHAR): Tên người dùng.
  - `created_at` (TIMESTAMP): Thời gian tạo.
  - `updated_at` (TIMESTAMP): Thời gian cập nhật.

#### Bảng `roles`
- **Mô tả**: Lưu thông tin vai trò.
- **Cấu trúc**:
  - `id` (SERIAL, PRIMARY KEY): ID duy nhất của role.
  - `name` (VARCHAR, UNIQUE): Tên role (ví dụ: admin, editor).
  - `description` (TEXT): Mô tả role.
  - `created_at` (TIMESTAMP): Thời gian tạo.

#### Bảng `permissions`
- **Mô tả**: Lưu thông tin permissions (hành động được phép).
- **Cấu trúc**:
  - `id` (SERIAL, PRIMARY KEY): ID duy nhất của permission.
  - `action` (VARCHAR, UNIQUE): Tên hành động (ví dụ: view_users, create_reports).
  - `description` (TEXT): Mô tả permission.
  - `created_at` (TIMESTAMP): Thời gian tạo.

#### Bảng `user_roles` (Bảng liên kết)
- **Mô tả**: Liên kết users với roles (quan hệ nhiều-nhiều).
- **Cấu trúc**:
  - `user_id` (INTEGER, FOREIGN KEY → users.id): ID của user.
  - `role_id` (INTEGER, FOREIGN KEY → roles.id): ID của role.
  - **Primary Key**: (`user_id`, `role_id`).

#### Bảng `role_permissions` (Bảng liên kết)
- **Mô tả**: Liên kết roles với permissions (quan hệ nhiều-nhiều).
- **Cấu trúc**:
  - `role_id` (INTEGER, FOREIGN KEY → roles.id): ID của role.
  - `permission_id` (INTEGER, FOREIGN KEY → permissions.id): ID của permission.
  - **Primary Key**: (`role_id`, `permission_id`).

### MongoDB (Dữ liệu không cấu trúc)
Sử dụng MongoDB để lưu trữ logs hành động người dùng trong collection `logs`.

#### Collection `logs`
- **Mô tả**: Lưu trữ lịch sử hành động (đăng nhập, tạo user, sửa role, v.v.).
- **Cấu trúc mẫu**:
  ```json
  {
    "_id": ObjectId,
    "user_id": Number,
    "action": String, // Ví dụ: "login", "create_user"
    "details": Object, // Chi tiết hành động (ví dụ: { user_id: 123, role: "admin" })
    "timestamp": ISODate
  }
  ```

### Redis (Session/Cache)
- **Mô tả**: Lưu trữ session JWT và cache.
- **Cấu trúc**:
  - Key: `session:<user_id>` (String).
  - Value: JSON chứa `{ token: <JWT>, expires_at: <timestamp> }`.
  - TTL: 24 giờ (hoặc tùy chỉnh).

## 5. Lưu Ý Triển Khai
- **Bảo mật**:
  - Mã hóa password bằng bcrypt trước khi lưu vào PostgreSQL.
  - Sử dụng HTTPS cho tất cả API calls.
  - Đặt TTL cho session trong Redis để tự động xóa khi hết hạn.
- **Hiệu suất**:
  - Cache permissions trong Redis để giảm truy vấn PostgreSQL.
  - Sử dụng MongoDB để lưu logs nhằm giảm tải cho PostgreSQL.
- **Mở rộng**:
  - Hỗ trợ thêm OAuth2 hoặc SSO bằng cách mở rộng Auth Module.
  - Cho phép cấu hình permissions chi tiết hơn (ví dụ: phân quyền theo resource cụ thể).
- **Docker**:
  - Container hóa từng dịch vụ (frontend, backend, PostgreSQL, MongoDB, Redis).
  - Sử dụng Docker Compose để quản lý các dịch vụ và volumes.

## 6. Kết Luận
Hệ thống được thiết kế với kiến trúc linh hoạt, bảo mật, và dễ mở rộng. PostgreSQL đảm bảo tính toàn vẹn dữ liệu, MongoDB hỗ trợ log hiệu quả, và Redis tăng tốc độ xử lý session. Chức năng tự động load actions giúp giảm công sức cấu hình permissions, trong khi RBAC đảm bảo phân quyền chặt chẽ.