# Prisma Migration

Sau khi hoàn thành setup, chạy lệnh sau để khởi tạo database:

```bash
npx prisma migrate dev --name init
```

Nếu sử dụng PostgreSQL, đảm bảo:
1. PostgreSQL đã được cài đặt và đang chạy
2. Database "zbase" đã được tạo (hoặc sửa đổi DATABASE_URL trong .env)
3. Thông tin đăng nhập trong DATABASE_URL chính xác

Nếu muốn sử dụng SQLite thay thế:
1. Sửa file prisma/schema.prisma, comment phần datasource PostgreSQL và uncomment phần SQLite
2. Sửa file .env, comment phần DATABASE_URL cho PostgreSQL và uncomment phần cho SQLite
