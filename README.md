# ZBase - Hệ thống quản lý với RBAC

Dự án ZBase là một hệ thống quản lý hiện đại sử dụng kiến trúc monorepo với frontend và backend tách biệt, tập trung vào xác thực người dùng và phân quyền dựa trên vai trò (RBAC).

## Cấu trúc dự án

```
zbase/
  ├── frontend/      # Ứng dụng Next.js với Tailwind CSS
  ├── backend/       # API Backend với NestJS và Prisma
  └── docs/          # Tài liệu dự án
```

## Các công nghệ sử dụng

### Frontend
- **Next.js 14** với App Router
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling
- **NextAuth.js** cho xác thực
- **CASL** cho phân quyền (RBAC)
- **React Hook Form + Zod** cho form validation

### Backend
- **NestJS** framework
- **TypeScript** cho type safety
- **Prisma** cho ORM
- **PostgreSQL** cho cơ sở dữ liệu
- **Redis** cho session/cache
- **MongoDB** cho logs
- **JWT** cho xác thực
- **Passport** cho authentication strategies
- **Class Validator** cho validation

## Tính năng chính

- **Xác thực người dùng**: Đăng nhập, đăng ký, quản lý session
- **Phân quyền dựa trên vai trò (RBAC)**: Admin, User, và các vai trò tùy chỉnh
- **Tự động phát hiện quyền hạn**: Backend tự động quét các endpoints để tạo danh sách quyền hạn
- **Dashboard**: Hiển thị thông tin và chức năng dựa trên quyền hạn
- **Quản lý người dùng**: Xem, thêm, sửa, xóa người dùng (chỉ dành cho Admin)
- **Quản lý bài viết**: CRUD operations cho bài viết
- **Quản lý bình luận**: CRUD operations cho bình luận
- **Cache với Redis**: Cải thiện hiệu suất bằng caching
- **Logging với MongoDB**: Ghi lại các hoạt động hệ thống
- **Responsive Design**: Giao diện hoạt động tốt trên nhiều thiết bị

## Cài đặt và Chạy

### Cài đặt chung

```bash
# Clone repository
git clone https://github.com/yourusername/zbase.git
cd zbase

# Cài đặt dependencies (nếu có)
npm install
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại http://localhost:3000

### Backend

```bash
cd backend
npm install

# Cấu hình PostgreSQL trong file .env
# Tạo database và áp dụng migrations
npx prisma migrate dev --name init

# Tạo dữ liệu mẫu
npm run db:seed

# Chạy ứng dụng
npm run start:dev
```

Backend API sẽ chạy tại http://localhost:3001/api

> **Lưu ý**: Hãy chắc chắn rằng frontend được cấu hình để kết nối với port 3001 của backend. Kiểm tra file `.env.local` trong thư mục frontend.

## Tài khoản demo

- **Admin**: `admin@example.com` / `password`
- **Admin 2**: `toan@zplus.vn` / `ToanLinh`
- **User**: `user@example.com` / `password`

## Phân quyền và Kiểm soát truy cập

Hệ thống sử dụng phân quyền dựa trên vai trò (RBAC) được triển khai qua nhiều lớp:

### Backend

1. **Roles (Vai trò)**: USER, ADMIN và các vai trò tùy chỉnh
   - Được lưu trong bảng `roles` trong cơ sở dữ liệu
   - Mỗi người dùng có thể thuộc nhiều vai trò (quan hệ nhiều-nhiều)

2. **Permissions (Quyền hạn)**: Các quyền chi tiết
   - Ví dụ: `create:Post`, `read:User`, `manage:Comment`
   - Mỗi vai trò được gán các quyền cụ thể

3. **Guards**: Kiểm soát truy cập API
   - `JwtAuthGuard`: Xác thực token
   - `RolesGuard`: Kiểm tra vai trò người dùng
   - `PermissionsGuard`: Kiểm tra quyền chi tiết

### Frontend

1. **NextAuth.js**: Quản lý phiên đăng nhập và token
   - Lưu trữ thông tin người dùng, vai trò và token JWT
   - Cung cấp `useSession` hook để truy cập thông tin phiên

2. **CASL**: Định nghĩa và kiểm tra quyền trong UI
   - `defineAbility`: Định nghĩa các quyền dựa trên vai trò và quyền từ API
   - `useAbility`: Hook để kiểm tra quyền trong components

3. **RoleGuard**: Component bảo vệ các trang dựa trên vai trò
   - Chuyển hướng người dùng không có quyền đến trang unauthorized

### Quy trình làm việc

1. Người dùng đăng nhập và nhận JWT token chứa thông tin vai trò
2. Token được lưu trong phiên NextAuth.js
3. Backend kiểm tra vai trò và quyền cho mỗi API request
4. Frontend sử dụng CASL để hiển thị/ẩn các chức năng dựa trên quyền
5. RoleGuard ngăn truy cập vào các trang không được phép

Tài liệu chi tiết về phân quyền có thể xem tại [docs/api-mapping.md](./docs/api-mapping.md) phần "Luồng xác thực và phân quyền".
- [Chi tiết tích hợp Frontend-Backend](./docs/frontend-backend-integration.md)
- [Thiết kế hệ thống](./docs/zbase-design.md)

## Cấu trúc dữ liệu

### PostgreSQL
- `users`: Thông tin người dùng
- `roles`: Vai trò trong hệ thống
- `permissions`: Quyền hạn
- `user_roles`: Quan hệ giữa người dùng và vai trò
- `role_permissions`: Quan hệ giữa vai trò và quyền hạn
- `posts`: Bài viết
- `comments`: Bình luận

### Redis
- Cache session và token JWT
- Cache permissions để tăng hiệu suất

### MongoDB
- Logs các hoạt động của người dùng

## Giấy phép

[MIT](LICENSE)
