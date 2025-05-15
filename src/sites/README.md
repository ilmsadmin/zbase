# Sites Module

## Tổng quan
Module Sites cung cấp các API để quản lý kết nối và đồng bộ với các website WordPress và WooCommerce trong hệ thống WordPress Hub. Các API này cho phép bạn kết nối, kiểm tra kết nối, liệt kê và quản lý các website từ một điểm trung tâm.

## Cấu trúc module

```
sites/
├── dto/                           # Data Transfer Objects
│   ├── create-site.dto.ts         # DTO cho việc tạo mới site 
│   ├── site-connection-response.dto.ts  # DTO cho phản hồi kết nối
│   ├── site-response.dto.ts       # DTO cho phản hồi thông tin site
│   └── update-site.dto.ts         # DTO cho việc cập nhật site
├── filters/                       # Exception filters
│   └── sites-exception.filter.ts  # Filter xử lý lỗi
├── helpers/                       # Helper functions  
│   └── site.helpers.ts            # Các hàm hỗ trợ kết nối WordPress/WooCommerce
├── sites.controller.spec.ts       # Unit tests cho controller
├── sites.controller.ts            # Controller xử lý các API endpoints
├── sites.module.ts                # Module definition 
└── sites.service.spec.ts          # Unit tests cho service
└── sites.service.ts               # Service xử lý logic nghiệp vụ
```

## API Endpoints

### 1. Lấy danh sách site
- **Endpoint**: `GET /sites`
- **Mô tả**: Lấy danh sách tất cả các site đã kết nối
- **Quyền hạn**: `admin`
- **Phản hồi**: Danh sách các site

### 2. Lấy thông tin một site
- **Endpoint**: `GET /sites/:id`
- **Mô tả**: Lấy thông tin chi tiết của một site cụ thể
- **Tham số**: `id` (ID của site)
- **Quyền hạn**: `admin`
- **Phản hồi**: Thông tin của site

### 3. Tạo mới site
- **Endpoint**: `POST /sites`
- **Mô tả**: Tạo mới một site
- **Quyền hạn**: `admin`
- **Body**: `CreateSiteDto`
- **Phản hồi**: Site đã tạo

### 4. Cập nhật site
- **Endpoint**: `PUT /sites/:id`
- **Mô tả**: Cập nhật thông tin của một site
- **Tham số**: `id` (ID của site)
- **Quyền hạn**: `admin`
- **Body**: `UpdateSiteDto`
- **Phản hồi**: Site đã cập nhật

### 5. Xóa site
- **Endpoint**: `DELETE /sites/:id`
- **Mô tả**: Xóa một site
- **Tham số**: `id` (ID của site)
- **Quyền hạn**: `admin`
- **Phản hồi**: 204 No Content (nếu thành công)

### 6. Kiểm tra kết nối
- **Endpoint**: `POST /sites/:id/test-connection`
- **Mô tả**: Kiểm tra kết nối đến WordPress/WooCommerce API
- **Tham số**: `id` (ID của site)
- **Quyền hạn**: `admin`
- **Phản hồi**: Kết quả kiểm tra kết nối

### 7. Kết nối và lưu site mới
- **Endpoint**: `POST /sites/connect`
- **Mô tả**: Kiểm tra kết nối và lưu thông tin site nếu kết nối thành công
- **Quyền hạn**: `admin`
- **Body**: `CreateSiteDto`
- **Phản hồi**: Kết quả kết nối và thông tin site đã lưu

## Mô hình dữ liệu

```typescript
// Site Entity
{
  id: number;
  name: string;
  wp_url: string;
  wp_user?: string;
  app_password?: string;
  wc_key?: string;
  wc_secret?: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

## Cách sử dụng API

### Tạo kết nối mới
```bash
curl -X POST "http://localhost:3001/sites/connect" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Blog", "wp_url": "https://myblog.com", "wp_user": "admin", "app_password": "xxxx xxxx xxxx"}'
```

### Kiểm tra kết nối
```bash
curl -X POST "http://localhost:3001/sites/1/test-connection" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Cách chạy unit tests
```bash
# Chạy unit tests cho module Sites
npm test sites.controller
npm test sites.service
```

## Thử nghiệm API
```bash
# Chạy script thử nghiệm API Sites
npm run test:sites
```
