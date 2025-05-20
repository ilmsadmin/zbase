# ZBase Frontend

Dự án frontend cho hệ thống ZBase, được xây dựng với Next.js, Tailwind CSS và các công nghệ hiện đại.

## Tính năng

- **Next.js 14** với App Router
- **Tailwind CSS** cho UI
- **NextAuth.js** cho xác thực
- **CASL** cho phân quyền (RBAC)
- **React Hook Form + Zod** cho quản lý form và validation
- **TypeScript** cho type safety
- **Next-intl** cho đa ngôn ngữ (i18n)

## Cấu trúc dự án

```
src/
  ├── abilities/              # CASL RBAC
  ├── app/                    # Next.js App Router
  │   ├── [locale]/           # Các route đa ngôn ngữ
  │   │   ├── admin/          # Trang admin
  │   │   ├── auth/           # Trang xác thực
  │   │   ├── dashboard/      # Trang dashboard
  │   │   ├── profile/        # Trang cá nhân
  │   │   └── unauthorized/   # Trang không có quyền truy cập
  │   ├── api/                # API Routes
  │   │   └── auth/           # NextAuth endpoints
  ├── components/             # React components
  │   ├── auth/               # Auth related components
  │   └── layouts/            # Layout components
  ├── i18n/                   # Cấu hình i18n
  ├── lib/                    # Utilities
  │   └── auth/               # Auth utilities
  ├── messages/               # Các nội dung đa ngôn ngữ
  │   ├── en/                 # Tiếng Anh
  │   └── vi/                 # Tiếng Việt
  └── types/                  # TypeScript types
```

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:

```bash
cd frontend
npm install
```

3. Tạo file `.env.local` (xem `.env.example` để biết các biến cần thiết)
4. Chạy server phát triển:

```bash
npm run dev
```

## Xác thực và Phân quyền

### Xác thực
Dự án sử dụng NextAuth.js cho xác thực. Hiện tại, các tài khoản mẫu là:

- Admin: `admin@example.com` / `password`
- User: `user@example.com` / `password`

### Phân quyền (RBAC)
Dự án sử dụng CASL để phân quyền dựa trên vai trò. Các vai trò hiện có:

- `admin`: Có thể thực hiện tất cả các hành động
- `user`: Có thể đọc nội dung và quản lý nội dung của chính mình

## Đa ngôn ngữ (i18n)

Ứng dụng hỗ trợ đa ngôn ngữ với:

- 🇻🇳 Tiếng Việt (mặc định)
- 🇺🇸 Tiếng Anh

### Cách triển khai i18n

- Sử dụng `next-intl` để quản lý translations
- Các file messages được lưu trữ trong `src/messages/{locale}/`
- Chuyển đổi ngôn ngữ thông qua language switcher ở header
- Định tuyến URL theo locale với định dạng `/{locale}/path`

### Thêm ngôn ngữ mới

1. Tạo thư mục mới trong `src/messages/` với mã locale
2. Sao chép các file từ thư mục locale hiện có và dịch
3. Thêm locale mới vào danh sách locales được hỗ trợ trong `src/i18n/navigation.ts`

## Kết nối với Backend

Khi phần backend sẵn sàng, hãy cập nhật các biến môi trường trong `.env.local` để kết nối với API.
