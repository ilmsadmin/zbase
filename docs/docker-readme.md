# Hướng dẫn Docker cho ZBase

## Yêu cầu hệ thống
- Docker Desktop đã được cài đặt
- Docker Compose đã được cài đặt (thường đi kèm với Docker Desktop)

## Cấu hình hệ thống
Tất cả cấu hình cơ sở dữ liệu được quản lý tập trung trong file `.env`:

```
# Database Configuration
DB_HOST=127.0.0.1  # Tự động được ghi đè thành "postgres" khi chạy trong Docker
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=ToanLinh
DB_DATABASE=zbase
```

Ứng dụng sẽ tự động đọc các biến môi trường này. Khi chạy trong Docker:
- Cho môi trường phát triển (development): biến môi trường `DB_HOST` sẽ được ghi đè thành `postgres`
- Cho môi trường sản phẩm (production): biến môi trường `DB_HOST` cũng sẽ được ghi đè thành `postgres`

## Chạy ứng dụng trong chế độ Production
Để chạy ứng dụng ở chế độ production:

```powershell
docker-compose up -d
```

Lệnh này sẽ:
- Build image cho container ứng dụng
- Khởi động container PostgreSQL database
- Tạo mạng để các container giao tiếp với nhau
- Tạo volume lưu trữ dữ liệu cho cơ sở dữ liệu

Để dừng ứng dụng:

```powershell
docker-compose down
```

## Chạy ứng dụng trong chế độ Development
Để phát triển với tính năng hot-reload:

```powershell
docker-compose -f docker-compose.dev.yml up -d
```

Chế độ này sẽ mount các file từ máy host vào container để hỗ trợ hot-reload, giúp các thay đổi được cập nhật ngay lập tức.

## Truy cập ứng dụng
- Web App: http://localhost:3001
- PostgreSQL: localhost:5432 (Sử dụng các thông tin đăng nhập từ file .env)

## Khởi tạo cơ sở dữ liệu
Hệ thống sử dụng container PostgreSQL có tên `zbase`. Database được khởi tạo tự động bằng file SQL tại `db/zbase.sql` được mount vào container như một script khởi tạo.

Để import thủ công file SQL vào container PostgreSQL hiện có:
```powershell
docker exec -i zbase psql -U postgres -d zbase < ./db/zbase.sql
```

## Cấu hình container PostgreSQL
Hệ thống sử dụng PostgreSQL trong Docker với cấu hình sau:
```powershell
docker run --name zbase -e POSTGRES_PASSWORD=ToanLinh -e POSTGRES_DB=zbase -p 5432:5432 -d postgres
```

Thông tin quan trọng về cấu hình này:
1. Tên container: `zbase`
2. Database mặc định: `zbase` (được tạo tự động với -e POSTGRES_DB=zbase)
3. Ánh xạ cổng: host:5432 -> container:5432
4. Người dùng: postgres
5. Mật khẩu: ToanLinh

Để làm việc với container này:
1. Đảm bảo container đang chạy: `docker ps`
2. Kết nối đến PostgreSQL CLI: `docker exec -it zbase psql -U postgres -d zbase`
3. Import file SQL của bạn:
```powershell
docker exec -i zbase psql -U postgres -d zbase < ./db/zbase.sql
```

**Quan trọng**: Khi chạy ứng dụng trên máy host, file `.env` sử dụng `DB_HOST=127.0.0.1`. 
Khi chạy trong Docker, biến môi trường `DB_HOST` được tự động đặt thành `postgres`.

## Quản lý Container
Xem các container đang chạy:
```powershell
docker ps
```

Xem log từ ứng dụng (production):
```powershell
docker logs zbase-app
```

Xem log từ ứng dụng (development):
```powershell
docker logs zbase-app-dev
```

Truy cập shell trong container ứng dụng:
```powershell
docker exec -it zbase-app sh  # production
docker exec -it zbase-app-dev sh  # development
```

Truy cập PostgreSQL CLI:
```powershell
docker exec -it zbase psql -U postgres -d zbase
```

## Volumes và Dữ liệu liên tục
Dữ liệu cơ sở dữ liệu được lưu trữ trong Docker volume:
- Cho môi trường production: `zbase-postgres-data`
- Cho môi trường development: `zbase-postgres-data-dev`

Điều này đảm bảo dữ liệu của bạn được giữ nguyên ngay cả khi bạn xóa các container.

User uploads are mapped to the host machine at `./src/public/uploads` to ensure they're persisted.
