# Tích hợp Frontend với Backend

Tài liệu này mô tả chi tiết cách các thành phần frontend tương tác với các API backend trong hệ thống ZBase.

## 1. Cấu trúc API Client

Đầu tiên, chúng ta cần tạo một API client trong frontend để gọi các API backend với xác thực JWT:

```typescript
// frontend/src/lib/api/client.ts
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function fetchWithAuth(
  endpoint: string,
  method: RequestMethod = "GET",
  data?: any
) {
  const session = await getSession();
  const accessToken = session?.accessToken;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}

export const apiClient = {
  get: (endpoint: string) => fetchWithAuth(endpoint, "GET"),
  post: (endpoint: string, data: any) => fetchWithAuth(endpoint, "POST", data),
  patch: (endpoint: string, data: any) => fetchWithAuth(endpoint, "PATCH", data),
  delete: (endpoint: string) => fetchWithAuth(endpoint, "DELETE"),
};
```

## 2. Xác thực (Authentication)

### a. Đăng nhập

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  // Phần render form
}
```

**Backend API:**
```typescript
// POST /api/auth/login
@Post('login')
async login(
  @Body() loginDto: LoginDto,
  @Ip() ip: string,
  @Headers('user-agent') userAgent: string,
) {
  return this.authService.login({
    ...loginDto,
    ip,
    userAgent,
  });
}
```

### b. Đăng ký

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/auth/register/page.tsx
// Tương tự như login page, nhưng gọi API đăng ký

const onSubmit = async (data: { email: string; password: string; name: string }) => {
  setIsLoading(true);
  setError(null);

  try {
    // Gọi API đăng ký
    await apiClient.post('/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name,
    });

    // Sau khi đăng ký thành công, đăng nhập
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Đăng nhập sau khi đăng ký thất bại");
    } else {
      router.push("/dashboard");
    }
  } catch (error) {
    setError("Đăng ký thất bại. Email có thể đã được sử dụng.");
  } finally {
    setIsLoading(false);
  }
};
```

**Backend API:**
```typescript
// POST /api/auth/register
@Post('register')
async register(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

### c. Lấy thông tin người dùng

**Frontend (NextAuth.js):**
```typescript
// NextAuth.js sẽ lưu thông tin người dùng vào session
// frontend/src/lib/auth/auth-options.ts
export const authOptions: NextAuthOptions = {
  // ...
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  // ...
};
```

**Backend API:**
```typescript
// GET /api/auth/profile
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Req() req: Request) {
  if (!req.user) {
    throw new UnauthorizedException('User not authenticated');
  }
  return this.authService.getProfile(req.user['id']);
}
```

### d. Đăng xuất

**Frontend Component:**
```tsx
// frontend/src/components/layouts/Header.tsx
import { signOut } from "next-auth/react";

const handleLogout = async () => {
  // Gọi API logout để hủy token ở backend
  try {
    await apiClient.post('/auth/logout', {});
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Đăng xuất ở client-side
  signOut({ callbackUrl: '/auth/login' });
};
```

**Backend API:**
```typescript
// POST /api/auth/logout
@UseGuards(JwtAuthGuard)
@Post('logout')
async logout(@Req() req: Request) {
  if (!req.user) {
    throw new UnauthorizedException('User not authenticated');
  }
  return this.authService.logout(req.user['id']);
}
```

## 3. Quản lý người dùng (Users)

### a. Danh sách người dùng

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import MainLayout from "@/components/layouts/MainLayout";
import { useAbility } from "@/abilities/AbilityContext";

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const ability = useAbility();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await apiClient.get('/users');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    // Chỉ gọi API nếu có quyền
    if (ability.can('read', 'User')) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [ability]);

  // Phần render danh sách người dùng
}
```

**Backend API:**
```typescript
// GET /api/users
@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
findAll() {
  return this.usersService.findAll();
}
```

### b. Chi tiết người dùng

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/admin/users/[id]/page.tsx
// Tương tự như danh sách, nhưng lấy chi tiết một người dùng

useEffect(() => {
  async function fetchUser() {
    try {
      const data = await apiClient.get(`/users/${id}`);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }

  fetchUser();
}, [id]);
```

**Backend API:**
```typescript
// GET /api/users/:id
@Get(':id')
@UseGuards(JwtAuthGuard)
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

### c. Cập nhật người dùng

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/admin/users/[id]/edit/page.tsx
// Form cập nhật người dùng

const onSubmit = async (data) => {
  setSubmitting(true);
  try {
    await apiClient.patch(`/users/${id}`, data);
    router.push(`/admin/users/${id}`);
  } catch (error) {
    setError("Cập nhật thất bại");
  } finally {
    setSubmitting(false);
  }
};
```

**Backend API:**
```typescript
// PATCH /api/users/:id
@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(id, updateUserDto);
}
```

## 4. Quản lý bài viết (Posts)

### a. Danh sách bài viết

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import MainLayout from "@/components/layouts/MainLayout";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await apiClient.get('/posts');
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Phần render danh sách bài viết
}
```

**Backend API:**
```typescript
// GET /api/posts
@UseGuards(JwtAuthGuard)
@Get()
findAll(@Request() req) {
  return this.postsService.findAll(req.user.id, req.user.role);
}
```

### b. Chi tiết bài viết

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/posts/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import MainLayout from "@/components/layouts/MainLayout";

export default function PostDetailPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await apiClient.get(`/posts/${id}`);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  // Phần render chi tiết bài viết
}
```

**Backend API:**
```typescript
// GET /api/posts/:id
@UseGuards(JwtAuthGuard)
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
  return this.postsService.findOne(id, req.user.id, req.user.role);
}
```

### c. Tạo bài viết

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/posts/create/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "@/i18n/navigation";
import MainLayout from "@/components/layouts/MainLayout";

export default function CreatePostPage() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const postSchema = z.object({
    title: z.string().min(5).max(100),
    content: z.string().min(10),
    published: z.boolean().default(false),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      published: false,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/posts', data);
      router.push('/posts');
    } catch (error) {
      setError("Tạo bài viết thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phần render form tạo bài viết
}
```

**Backend API:**
```typescript
// POST /api/posts
@UseGuards(JwtAuthGuard)
@Post()
create(@Body() createPostDto: CreatePostDto, @Request() req) {
  return this.postsService.create(createPostDto, req.user.id);
}
```

## 5. Quản lý bình luận (Comments)

### a. Danh sách bình luận

**Frontend Component:**
```tsx
// frontend/src/components/comments/CommentsList.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";

export default function CommentsList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await apiClient.get(`/comments?postId=${postId}`);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  // Phần render danh sách bình luận
}
```

**Backend API:**
```typescript
// GET /api/comments?postId=:postId
@UseGuards(JwtAuthGuard)
@Get()
findAll(@Query('postId', ParseIntPipe) postId: number) {
  return this.commentsService.findAll(postId);
}
```

### b. Tạo bình luận

**Frontend Component:**
```tsx
// frontend/src/components/comments/CommentForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api/client";

export default function CommentForm({ postId, onCommentAdded }) {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentSchema = z.object({
    content: z.string().min(3).max(500),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const newComment = await apiClient.post('/comments', {
        ...data,
        postId,
      });
      
      reset();
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      setError("Thêm bình luận thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phần render form bình luận
}
```

**Backend API:**
```typescript
// POST /api/comments
@UseGuards(JwtAuthGuard)
@Post()
create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
  return this.commentsService.create(createCommentDto, req.user.id);
}
```

## 6. Quản lý phân quyền (RBAC)

### a. CASL trong Frontend

**Cấu hình CASL:**
```typescript
// frontend/src/abilities/defineAbility.ts
import { AbilityBuilder, Ability, AbilityClass, Subject } from "@casl/ability";
import { User } from "@/types/auth";

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subjects = 'User' | 'Post' | 'Comment' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export function defineRulesForUser(user: User | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder(AppAbility);

  if (!user) {
    // Người dùng chưa đăng nhập
    can('read', 'Post', { isPublic: true });
    can('read', 'Comment', { isPublic: true });
    return build();
  }

  // Sử dụng permissions từ backend
  if (user.permissions) {
    user.permissions.forEach(permission => {
      const [action, subject] = permission.split(':');
      can(action as Actions, subject as Subjects);
    });
  }

  return build();
}

export function createAbilityFor(user: User | null): AppAbility {
  return defineRulesForUser(user);
}
```

**Context Provider:**
```tsx
// frontend/src/abilities/AbilityContext.tsx
import { createContext, useContext } from 'react';
import { AppAbility, createAbilityFor } from './defineAbility';
import { useSession } from 'next-auth/react';

const AbilityContext = createContext<AppAbility | undefined>(undefined);

export function AbilityProvider({ children }) {
  const { data: session } = useSession();
  const ability = createAbilityFor(session?.user || null);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error('useAbility must be used within an AbilityProvider');
  }
  return ability;
}
```

**Sử dụng trong Component:**
```tsx
// frontend/src/app/[locale]/dashboard/page.tsx
"use client";

import { useAbility } from "@/abilities/AbilityContext";

export default function DashboardPage() {
  const ability = useAbility();
  
  // Kiểm tra quyền truy cập các tính năng
  const canManageUsers = ability.can("manage", "User");
  const canCreatePosts = ability.can("create", "Post");
  
  return (
    <MainLayout>
      {/* Hiển thị các tính năng dựa trên quyền hạn */}
      {canManageUsers && (
        <div className="manage-users-section">
          {/* UI quản lý người dùng */}
        </div>
      )}
      
      {canCreatePosts && (
        <div className="create-posts-section">
          {/* UI tạo bài viết */}
        </div>
      )}
    </MainLayout>
  );
}
```

### b. Quản lý vai trò (Admin UI)

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/admin/roles/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import MainLayout from "@/components/layouts/MainLayout";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await apiClient.get('/roles');
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  // Phần render danh sách vai trò
}
```

**Backend API:**
```typescript
// GET /api/roles
@Get()
findAll() {
  return this.rolesService.findAll();
}
```

### c. Gán quyền cho vai trò

**Frontend Component:**
```tsx
// frontend/src/app/[locale]/admin/roles/[id]/permissions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import MainLayout from "@/components/layouts/MainLayout";

export default function RolePermissionsPage({ params }) {
  const { id } = params;
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [roleData, rolePermissions, allPerms] = await Promise.all([
          apiClient.get(`/roles/${id}`),
          apiClient.get(`/permissions/role/${id}`),
          apiClient.get('/permissions'),
        ]);
        
        setRole(roleData);
        setPermissions(rolePermissions);
        setAllPermissions(allPerms);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleAssignPermission = async (permissionId) => {
    try {
      await apiClient.post(`/permissions/role/${id}/permission/${permissionId}`, {});
      // Refresh permissions
      const updatedPermissions = await apiClient.get(`/permissions/role/${id}`);
      setPermissions(updatedPermissions);
    } catch (error) {
      console.error('Error assigning permission:', error);
    }
  };

  // Phần render UI quản lý quyền hạn
}
```

**Backend API:**
```typescript
// POST /api/permissions/role/:roleId/permission/:permissionId
@Post('role/:roleId/permission/:permissionId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
async assignPermissionToRole(
  @Param('roleId') roleId: string,
  @Param('permissionId') permissionId: string,
) {
  await this.permissionsService.assignPermissionToRole(
    parseInt(roleId, 10),
    parseInt(permissionId, 10),
  );
  
  return { success: true };
}
```

## 7. Cài đặt và cấu hình

### a. Thiết lập hệ thống

1. Cấu hình environment variables:

```
# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Backend .env
DATABASE_URL=postgresql://user:password@localhost:5432/zbase
APP_PORT=8000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1d
REDIS_URL=redis://localhost:6379
```

2. Chạy migrations và seed dữ liệu mẫu:

```bash
# Trong thư mục backend
npx prisma migrate dev --name init
npm run db:seed
```

3. Chạy ứng dụng:

```bash
# Chạy backend
cd backend
npm run start:dev

# Chạy frontend
cd frontend
npm run dev
```

### b. Luồng xác thực và phân quyền

1. Người dùng đăng nhập thông qua form đăng nhập
2. Frontend gửi thông tin đăng nhập đến API backend (`/api/auth/login`)
3. Backend xác thực và trả về token JWT cùng thông tin người dùng
4. NextAuth.js lưu token vào session
5. Các yêu cầu API tiếp theo kèm theo token để backend xác thực
6. Backend kiểm tra quyền hạn cho mỗi yêu cầu API
7. Frontend sử dụng CASL để hiển thị UI dựa trên quyền hạn

## 8. Xử lý lỗi và bảo mật

### a. Xử lý lỗi API

```typescript
// Trong API client
async function fetchWithAuth(endpoint, method, data) {
  try {
    // Code gọi API
  } catch (error) {
    // Phân loại lỗi
    if (error.status === 401) {
      // Lỗi xác thực - chuyển đến trang đăng nhập
      signOut({ callbackUrl: '/auth/login' });
    } else if (error.status === 403) {
      // Lỗi phân quyền - hiển thị thông báo
      toast.error("Bạn không có quyền thực hiện hành động này");
    } else {
      // Lỗi khác
      toast.error("Đã xảy ra lỗi: " + (error.message || "Vui lòng thử lại"));
    }
    throw error;
  }
}
```

### b. Bảo mật

1. **HTTPS**: Sử dụng HTTPS cho tất cả API calls
2. **CORS**: Cấu hình CORS trên backend để chỉ cho phép frontend truy cập
3. **JWT**: Sử dụng JWT với thời gian hết hạn hợp lý
4. **Phân quyền**: Áp dụng phân quyền chặt chẽ ở cả backend và frontend
5. **Rate limiting**: Áp dụng giới hạn tần suất API calls để ngăn chặn tấn công brute force
