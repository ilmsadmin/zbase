# Frontend - Backend API Mapping

Tài liệu này mô tả chi tiết cách frontend tương tác với backend thông qua REST API.

## Xác thực (Authentication)

| Chức năng Frontend | API Backend | Phương thức | Mô tả | Component Frontend |
|-------------------|------------|------------|-------|------------------|
| Đăng nhập | `/api/auth/login` | POST | Đăng nhập với email và password | `src/components/auth/LoginForm.tsx`, `src/lib/auth/auth-options.ts` |
| Đăng ký | `/api/auth/register` | POST | Đăng ký tài khoản mới | `src/app/auth/register/page.tsx` |
| Lấy thông tin người dùng | `/api/auth/profile` | GET | Lấy thông tin chi tiết của người dùng đã đăng nhập | `src/app/profile/page.tsx` |
| Đăng xuất | `/api/auth/logout` | POST | Đăng xuất, hủy token hiện tại | `src/components/layouts/Header.tsx` |
| Làm mới token | `/api/auth/refresh` | POST | Làm mới token khi gần hết hạn | `src/lib/api/client.ts` (refreshToken) |

## Quản lý người dùng (Users)

| Chức năng Frontend | API Backend | Phương thức | Mô tả | Component Frontend |
|-------------------|------------|------------|-------|------------------|
| Danh sách người dùng | `/api/users` | GET | Lấy danh sách người dùng (Admin) | `src/app/users/page.tsx` |
| Chi tiết người dùng | `/api/users/:id` | GET | Xem thông tin chi tiết người dùng | `src/app/users/[id]/page.tsx` |
| Tạo người dùng | `/api/users` | POST | Tạo người dùng mới (Admin) | `src/app/users/new/page.tsx` |
| Cập nhật người dùng | `/api/users/:id` | PATCH | Cập nhật thông tin người dùng (Admin) | `src/app/users/[id]/edit/page.tsx` |
| Xóa người dùng | `/api/users/:id` | DELETE | Xóa người dùng (Admin) | `src/app/users/page.tsx` (chức năng xóa) |

## Quản lý vai trò (Roles)

| Chức năng Frontend | API Backend | Phương thức | Mô tả | Component Frontend |
|-------------------|------------|------------|-------|------------------|
| Danh sách vai trò | `/api/roles` | GET | Lấy danh sách vai trò | `src/app/roles/page.tsx` |
| Chi tiết vai trò | `/api/roles/:id` | GET | Xem thông tin chi tiết vai trò | `src/app/roles/[id]/page.tsx` |
| Tạo vai trò | `/api/roles` | POST | Tạo vai trò mới (Admin) | `src/app/roles/new/page.tsx` |
| Cập nhật vai trò | `/api/roles/:id` | PATCH | Cập nhật thông tin vai trò (Admin) | `src/app/roles/[id]/edit/page.tsx` |
| Xóa vai trò | `/api/roles/:id` | DELETE | Xóa vai trò (Admin) | `src/app/roles/page.tsx` (chức năng xóa) |
| Người dùng trong vai trò | `/api/roles/:id/users` | GET | Lấy danh sách người dùng trong vai trò | `src/app/roles/[id]/users/page.tsx` |
| Quyền hạn của vai trò | `/api/roles/:id/permissions` | GET | Lấy danh sách quyền hạn của vai trò | `src/app/roles/[id]/permissions/page.tsx` |

## Quản lý quyền hạn (Permissions)

| Chức năng Frontend | API Backend | Phương thức | Mô tả | Component Frontend |
|-------------------|------------|------------|-------|------------------|
| Danh sách quyền hạn | `/api/permissions` | GET | Lấy danh sách quyền hạn (Admin) | `src/app/permissions/page.tsx` |
| Khám phá quyền hạn | `/api/permissions/discover` | GET | Quét và cập nhật quyền hạn từ API endpoints (Admin) | `src/app/permissions/discover/page.tsx` |
| Gán quyền cho vai trò | `/api/permissions/role/:roleId/permission/:permissionId` | POST | Gán quyền cho vai trò (Admin) | `src/app/roles/[id]/permissions/edit/page.tsx` |
| Quyền hạn của vai trò | `/api/permissions/role/:roleId` | GET | Lấy quyền hạn của vai trò cụ thể | `src/app/roles/[id]/permissions/page.tsx` |
| Quyền hạn của người dùng | `/api/permissions/user/:userId` | GET | Lấy quyền hạn của người dùng cụ thể | `src/app/users/[id]/permissions/page.tsx`, `src/app/test-permissions/page.tsx` |

## Quản lý bài viết (Posts)

| Chức năng Frontend | API Backend | Phương thức | Mô tả | Component Frontend |
|-------------------|------------|------------|-------|------------------|
| Danh sách bài viết | `/api/posts` | GET | Lấy danh sách bài viết | `src/app/posts/page.tsx` |
| Chi tiết bài viết | `/api/posts/:id` | GET | Xem thông tin chi tiết bài viết | `src/app/posts/[id]/page.tsx` |
| Tạo bài viết | `/api/posts` | POST | Tạo bài viết mới | `src/app/posts/new/page.tsx` |
| Cập nhật bài viết | `/api/posts/:id` | PATCH | Cập nhật thông tin bài viết | `src/app/posts/[id]/edit/page.tsx` |
| Xóa bài viết | `/api/posts/:id` | DELETE | Xóa bài viết | `src/app/posts/page.tsx` (chức năng xóa) |

## Quản lý bình luận (Comments)

| Chức năng Frontend | API Backend | Phương thức | Mô tả | Component Frontend |
|-------------------|------------|------------|-------|------------------|
| Danh sách bình luận của bài viết | `/api/comments?postId=:postId` | GET | Lấy danh sách bình luận của bài viết | `src/app/posts/[id]/page.tsx` (hiển thị bình luận) |
| Chi tiết bình luận | `/api/comments/:id` | GET | Xem thông tin chi tiết bình luận | `src/app/comments/[id]/page.tsx` |
| Tạo bình luận | `/api/comments` | POST | Tạo bình luận mới | `src/app/posts/[id]/page.tsx` (form bình luận) |
| Cập nhật bình luận | `/api/comments/:id` | PATCH | Cập nhật thông tin bình luận | `src/app/comments/[id]/edit/page.tsx` |
| Xóa bình luận | `/api/comments/:id` | DELETE | Xóa bình luận | `src/app/posts/[id]/page.tsx` (chức năng xóa bình luận) |

## Luồng xác thực và phân quyền

1. Frontend đăng nhập thông qua NextAuth.js, gọi API `/api/auth/login`
   - Đăng nhập được xử lý trong `src/lib/auth/auth-options.ts` thông qua CredentialsProvider
   - Form đăng nhập nằm trong `src/app/auth/login/page.tsx` hoặc `src/components/auth/LoginForm.tsx`

2. Backend xác thực, trả về token JWT và thông tin người dùng
   - Backend xử lý trong `src/auth/auth.service.ts` (phương thức login)
   - Token JWT chứa thông tin user.id, roles và expiration time
   - Response bao gồm access_token và thông tin người dùng (id, email, name, roles, permissions)

3. Frontend lưu token vào session NextAuth
   - Token được lưu trong jwt callback của NextAuth
   - Thông tin người dùng và token được cung cấp cho toàn bộ ứng dụng thông qua useSession hook

4. Frontend gọi API với token trong header Authorization
   - API client (`src/lib/api/client.ts`) tự động đính kèm token vào mỗi request
   - Token refresh tự động được xử lý khi token hết hạn

5. Backend kiểm tra token và quyền hạn cho mỗi request
   - JwtAuthGuard xác thực token
   - RolesGuard kiểm tra vai trò
   - Permissions được kiểm tra thông qua PermissionsGuard

6. Frontend sử dụng CASL để hiển thị/ẩn các chức năng UI dựa trên quyền hạn
   - AbilityContext cung cấp quyền hạn cho toàn bộ ứng dụng
   - Các component sử dụng useAbility hook để kiểm tra quyền

## Làm việc với CASL trong Frontend

CASL được cấu hình để sử dụng quyền hạn từ backend thông qua:

```javascript
// Đọc quyền từ token và tạo ability
// Được cấu hình trong src/abilities/defineAbility.ts
const ability = defineAbility((can, cannot) => {
  // Admin có tất cả quyền
  if (user.role === "ADMIN") {
    can("manage", "all");
  }
  
  // User thường chỉ có quyền đọc và tạo bài viết, và quản lý bài viết của mình
  if (user.role === "USER") {
    can("read", "Post");
    can("create", "Post");
    can("manage", "Post", { authorId: user.id });
    can("read", "Comment");
    can("create", "Comment");
    can("manage", "Comment", { authorId: user.id });
  }
  
  // Áp dụng các quyền hạn từ API
  if (user.permissions) {
    user.permissions.forEach(permission => {
      can(permission.action, permission.subject);
    });
  }
});

// Sử dụng trong component
const ability = useAbility();
{ability.can('create', 'Post') && <button>Tạo bài viết mới</button>}
```

## Bảo mật API trong Backend

Backend áp dụng bảo mật bằng các guards:

1. `JwtAuthGuard`: Xác thực JWT token
   - Kiểm tra token có hợp lệ và chưa hết hạn
   - Được cấu hình trong `src/auth/guards/jwt-auth.guard.ts`

2. `RolesGuard`: Kiểm tra vai trò của người dùng
   - Sử dụng @Roles decorator để chỉ định vai trò được phép
   - Được cấu hình trong `src/auth/guards/roles.guard.ts`

3. `PermissionsGuard`: Kiểm tra quyền hạn cụ thể
   - Sử dụng @Permissions decorator
   - Được cấu hình trong `src/auth/guards/permissions.guard.ts`

Ví dụ sử dụng guards trong controller:

```typescript
// Yêu cầu đăng nhập và vai trò ADMIN
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get()
findAll() {
  return this.usersService.findAll();
}

// Yêu cầu đăng nhập và quyền đọc User
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('read:User')
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(+id);
}
```

## Xử lý lỗi và API Response

### Backend Response Format

Phản hồi API tuân theo định dạng chuẩn:

```json
// Success response
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful" 
}

// Error response
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [ ... ]
}
```

### Frontend Error Handling

Frontend xử lý lỗi API thông qua:

```typescript
// src/lib/api/errors.ts
export class HttpError extends Error implements ApiError {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

// Sử dụng trong component
try {
  const data = await apiClient.get('/posts');
} catch (err) {
  const apiError = handleApiError(err);
  setError(apiError.message);
}
```
  // Chỉ ADMIN mới có thể truy cập
}
