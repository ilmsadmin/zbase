# 📋 Todo List - Triển khai Hệ thống WordPress Hub

## Cấu trúc cơ sở dữ liệu

### 1. Thiết lập database
- [x] Tạo migration cho bảng `sites`
- [x] Tạo migration cho bảng `posts`
- [x] Tạo migration cho bảng `products`
- [x] Tạo migration cho bảng `excel_uploads`
- [x] Tạo migration cho bảng `excel_items`

### 2. Xây dựng entities
- [x] Tạo entity `Site`
- [x] Tạo entity `Post`
- [x] Tạo entity `Product`
- [x] Tạo entity `ExcelUpload`
- [x] Tạo entity `ExcelItem`

## Module quản lý kết nối website

### 1. Module Sites
- [x] Tạo module structure (module, controller, service)
- [x] Tạo DTO cho kết nối mới (CreateSiteDto)
- [x] Tạo DTO cho cập nhật kết nối (UpdateSiteDto)
- [x] Viết service kết nối đến WordPress (kiểm tra thông tin đăng nhập)
- [x] Viết service kết nối đến WooCommerce (kiểm tra API keys)
- [x] Triển khai API endpoints:
  - [x] POST /sites/connect
  - [x] GET /sites
  - [x] GET /sites/:id
  - [x] PUT /sites/:id
  - [x] DELETE /sites/:id
  - [x] POST /sites/:id/test-connection

## Module quản lý bài viết

### 1. Module Posts
- [ ] Tạo module structure (module, controller, service)
- [ ] Tạo DTO cho bài viết mới (CreatePostDto)
- [ ] Tạo DTO cho cập nhật bài viết (UpdatePostDto)
- [ ] Viết service đồng bộ bài viết từ các WordPress sites
- [ ] Viết service tạo và đăng bài viết lên các sites
- [ ] Triển khai API endpoints:
  - [ ] GET /posts
  - [ ] GET /posts/:id
  - [ ] POST /posts
  - [ ] PUT /posts/:id
  - [ ] DELETE /posts/:id
  - [ ] GET /posts/:siteId (lấy bài từ site cụ thể)
  - [ ] POST /posts/push (đẩy bài lên site)
  - [ ] POST /posts/sync (đồng bộ bài viết)

## Module quản lý sản phẩm

### 1. Module Products
- [ ] Tạo module structure (module, controller, service)
- [ ] Tạo DTO cho sản phẩm mới (CreateProductDto)
- [ ] Tạo DTO cho cập nhật sản phẩm (UpdateProductDto)
- [ ] Viết service đồng bộ sản phẩm từ các WooCommerce sites
- [ ] Viết service tạo và đăng sản phẩm lên các sites
- [ ] Triển khai API endpoints:
  - [ ] GET /products
  - [ ] GET /products/:id
  - [ ] POST /products
  - [ ] PUT /products/:id
  - [ ] DELETE /products/:id
  - [ ] GET /products/:siteId (lấy sản phẩm từ site cụ thể)
  - [ ] POST /products/push (đẩy sản phẩm lên site)
  - [ ] POST /products/sync (đồng bộ sản phẩm)

## Module upload và xử lý file Excel

### 1. Module ExcelUploads
- [ ] Tạo module structure (module, controller, service)
- [ ] Cấu hình Multer cho upload file Excel
- [ ] Viết service đọc và validate nội dung file Excel
- [ ] Viết service chuyển đổi dữ liệu Excel thành bài viết/sản phẩm
- [ ] Triển khai API endpoints:
  - [ ] POST /uploads/excel
  - [ ] GET /uploads
  - [ ] GET /uploads/:id/preview
  - [ ] POST /uploads/:id/post

## Module đánh giá SEO

### 1. Module SeoAudit
- [ ] Tạo module structure (module, controller, service)
- [ ] Tích hợp thư viện YoastSEO hoặc xây dựng engine đánh giá SEO custom
- [ ] Viết service phân tích và chấm điểm SEO nội dung
- [ ] Triển khai API endpoints:
  - [ ] POST /seo/audit
  - [ ] GET /seo/audit/:id

## Giao diện người dùng (Frontend)

### 1. Setup dự án frontend (React/Vue)
- [ ] Khởi tạo dự án frontend
- [ ] Cấu hình routing và state management
- [ ] Thiết lập API client và interceptors

### 2. Xây dựng các màn hình chính
- [ ] Dashboard tổng quan
- [ ] Trang kết nối website mới
- [ ] Trang danh sách websites đã kết nối
- [ ] Trang quản lý bài viết
- [ ] Trang quản lý sản phẩm
- [ ] Trang upload và xử lý Excel
- [ ] Trang đánh giá SEO

### 3. Xây dựng các components
- [ ] Component biểu mẫu kết nối website
- [ ] Component editor bài viết
- [ ] Component quản lý sản phẩm
- [ ] Component upload Excel
- [ ] Component preview dữ liệu Excel
- [ ] Component hiển thị đánh giá SEO

## Tích hợp hệ thống crontab / scheduler

- [ ] Xây dựng cronjob đồng bộ bài viết định kỳ
- [ ] Xây dựng cronjob đồng bộ sản phẩm định kỳ
- [ ] Cấu hình các khoảng thời gian đồng bộ

## Tích hợp AI (Giai đoạn 2)

- [ ] Tạo module AIContent
- [ ] Tích hợp OpenAI API
- [ ] Xây dựng service tạo nội dung bằng AI
- [ ] Xây dựng service đánh giá và cải thiện SEO bằng AI
- [ ] Triển khai API endpoints:
  - [ ] POST /ai/generate-content
  - [ ] POST /ai/improve-seo

## Tài liệu và hướng dẫn

- [ ] Viết tài liệu API (Swagger)
- [ ] Viết hướng dẫn sử dụng cho admin
- [ ] Viết hướng dẫn triển khai hệ thống
