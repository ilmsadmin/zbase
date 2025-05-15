
# 📘 Hệ thống Quản lý Nhiều Website WordPress/WooCommerce

## 🧠 Mục tiêu hệ thống
Xây dựng hệ thống trung tâm ("Hub") để:
- Kết nối và đồng bộ bài viết, sản phẩm với nhiều website WordPress/WooCommerce
- Quản lý nội dung tập trung
- Đánh giá SEO nội dung
- Nhập nội dung từ file Excel hoặc tạo trực tiếp
- Giai đoạn 2: Tích hợp AI (ChatGPT) để tạo nội dung và tối ưu SEO


---

## 🧱 Kiến trúc hệ thống tổng thể
```
+----------------+        +----------------+        +----------------+
| WordPress Site | <----> |   Hub Server   | <----> | Admin Dashboard |
| + WooCommerce  |        | (NestJS + PG)  |        |  (React/Vue)    |
+----------------+        +----------------+        +----------------+
       ↑                         ↑                          ↑
   App Password            REST API               SEO & AI Engine
```

---

## 🔐 Xác thực kết nối
### WordPress:
- Sử dụng Application Password (Basic Auth)
- API endpoint: `/wp-json/wp/v2/posts`

### WooCommerce:
- REST API với Consumer Key/Secret
- API endpoint: `/wp-json/wc/v3/products`

---

## 📦 Chức năng chính

### 1. Kết nối website
- Nhập thông tin:
  - URL
  - App Password / Username (WordPress)
  - Consumer Key / Secret (WooCommerce)
- Kiểm tra kết nối và lưu vào bảng `connected_sites`

### 2. Quản lý bài viết
- Hiển thị danh sách bài viết từ tất cả site
- Đồng bộ bài viết theo lịch hoặc thủ công
- Tạo mới bài viết:
  - Nhập tay trên hệ thống
  - Tải lên file Excel

### 3. Quản lý sản phẩm
- Đồng bộ sản phẩm, danh mục, tồn kho, giá
- Chỉnh sửa và đăng sản phẩm tập trung

### 4. SEO Audit
- Tự động đánh giá điểm SEO:
  - Meta title, meta desc, keyword density, alt image, link nội bộ
- Chấm điểm và gợi ý cải thiện SEO

### 5. Nhập nội dung qua file Excel
- Hỗ trợ định dạng:
  - Bài viết: `title`, `content`, `categories`, `tags`, `image`, `status`
  - Sản phẩm: `name`, `description`, `price`, `stock`, `image_url`
- Xem trước nội dung từ Excel → chọn để đăng → gửi API

### 6. Tạo nội dung bằng AI (giai đoạn 2)
- Sử dụng ChatGPT API để:
  - Viết bài theo chủ đề, từ khóa
  - Tự động tạo meta title/desc
  - Đánh giá và cải thiện SEO bằng AI

---

## 🗃️ Cơ sở dữ liệu đề xuất
### `connected_sites`
| id | name | wp_url | wp_user | app_password | wc_key | wc_secret | active |

### `posts`
| id | site_id | wp_post_id | title | slug | content | updated_at | seo_score |

### `products`
| id | site_id | wc_product_id | name | price | stock | synced_at |

### `excel_uploads`
| id | user_id | filename | type | status | uploaded_at |

### `excel_items`
| id | upload_id | data (JSONB) | valid | error_messages | ready_to_post |

---

## 🔄 Quy trình hoạt động
1. Admin kết nối site WordPress/WooCommerce
2. Đồng bộ dữ liệu bài viết/sản phẩm
3. Tạo nội dung trực tiếp hoặc nhập file Excel
4. Gửi nội dung đến site được chọn qua REST API
5. SEO Engine đánh giá bài viết
6. Giai đoạn 2: AI tạo nội dung & tối ưu SEO

---

## 📎 API Backend gợi ý (NestJS)
- `POST /sites/connect` - Thêm site mới
- `GET /posts/:siteId` - Lấy danh sách bài viết
- `POST /posts/push` - Đăng bài viết
- `POST /products/push` - Đăng sản phẩm
- `POST /uploads/excel` - Upload file Excel
- `GET /uploads/:id/preview` - Xem trước dữ liệu
- `POST /uploads/:id/post` - Gửi bài viết/sản phẩm từ file Excel

---

## 🧰 Thư viện đề xuất
| Tác vụ              | Thư viện                        |
|---------------------|----------------------------------|
| Đọc file Excel       | `xlsx`                          |
| Upload file         | `multer`, `@nestjs/platform-express` |
| Gửi API             | `axios`                         |
| Validate dữ liệu    | `class-validator`               |
| SEO Engine          | `yoastseo`, custom parser       |
| AI Content (GĐ2)    | OpenAI ChatGPT API              |

---

## ✅ Lợi ích hệ thống
- Quản lý nội dung tập trung cho nhiều website
- Tiết kiệm thời gian nhập bài viết/sản phẩm
- Đảm bảo chuẩn SEO trước khi đăng bài
- Giai đoạn 2: Tự động hoá toàn bộ quá trình sáng tạo nội dung
