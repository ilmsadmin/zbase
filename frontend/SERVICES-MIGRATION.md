# Chuẩn Hóa Tầng Dịch Vụ

## Tổng Quan

Chúng ta đang chuẩn hóa cấu trúc tầng dịch vụ frontend để loại bỏ sự trùng lặp giữa `src/lib/services` và `src/services/api`. Mã nguồn hiện tại sử dụng cả hai mô hình, dẫn đến các vấn đề về bảo trì và không nhất quán.

## Kế Hoạch Di Chuyển

### Bước 1: Hợp nhất các dịch vụ API vào `src/lib/services`

Chúng ta đã di chuyển chức năng từ `src/services/api/reports.ts` sang `src/lib/services/reportsService.ts` như một ví dụ. Các di chuyển tương tự nên được thực hiện cho các dịch vụ sau:

- ✅ Dịch vụ Báo cáo (Reports Service)
- ⬜ Dịch vụ Sản phẩm (Products Service)
- ⬜ Dịch vụ Kho hàng (Inventory Service)
- ⬜ Dịch vụ Khách hàng (Customers Service)
- ⬜ Dịch vụ Hóa đơn (Invoices Service)
- ⬜ Dịch vụ Kho bãi (Warehouses Service)
- ⬜ Dịch vụ Giao dịch (Transactions Service)
- ⬜ Dịch vụ Đối tác (Partners Service)

### Bước 2: Tạo lớp tương thích (Đã hoàn thành)

Để tránh làm hỏng các component hiện có, chúng ta đã tạo một lớp tương thích trong `src/services/api/index.ts` để tái xuất các hàm dịch vụ đã hợp nhất từ `src/lib/services/*`.

### Bước 3: Di chuyển các import trong component

Đối với các component đang sử dụng `import { someFunction } from '@/services/api/serviceName'`, hãy cập nhật theo một trong các mẫu sau:

**Cách tiếp cận ưu tiên (cho tất cả component mới):**
```typescript
import { serviceName } from '@/lib/services';
// Sau đó sử dụng: serviceName.functionName()
```

**Cách tiếp cận tạm thời (trong quá trình di chuyển):**
```typescript
import { someFunction } from '@/services/api';
// Cách này sẽ sử dụng lớp tương thích
```

### Bước 4: Hợp nhất cấu hình API client

Chúng ta đã chuẩn hóa `src/lib/api.ts` cho tất cả các yêu cầu API. Tất cả các hàm dịch vụ nên sử dụng API client này.

## Lợi Ích

- **Nguồn dữ liệu duy nhất**: Tất cả tương tác API đều thông qua một tầng dịch vụ chuẩn hóa
- **Mẫu nhất quán**: Các component sẽ tuân theo cùng một mẫu import và sử dụng
- **Bảo trì dễ dàng hơn**: Cập nhật các điểm cuối API chỉ cần diễn ra ở một nơi
- **Tổ chức tốt hơn**: Các kiểu dữ liệu và giao diện được đặt cùng với các triển khai dịch vụ tương ứng

## Lộ Trình

- Giai đoạn 1 (Hiện tại): Di chuyển dịch vụ Báo cáo + lớp tương thích
- Giai đoạn 2: Di chuyển dịch vụ Sản phẩm và Kho hàng
- Giai đoạn 3: Di chuyển dịch vụ Khách hàng và Hóa đơn
- Giai đoạn 4: Di chuyển các dịch vụ còn lại
- Giai đoạn 5: Loại bỏ lớp tương thích khi tất cả component đã được cập nhật

## Câu Hỏi?

Nếu bạn có câu hỏi về việc di chuyển hoặc gặp vấn đề, vui lòng liên hệ trưởng nhóm.
