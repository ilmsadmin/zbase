# Hướng dẫn tích hợp Backend với Frontend

Tài liệu này mô tả cách tích hợp phần Backend với Frontend của hệ thống ZBase.

## Cấu trúc API

Backend sẽ cung cấp các API endpoints sau:

### Xác thực

```
POST /api/auth/register - Đăng ký tài khoản mới
POST /api/auth/login - Đăng nhập
GET /api/auth/profile - Lấy thông tin profile (yêu cầu xác thực)
```

### Users

```
GET /api/users - Lấy danh sách người dùng (chỉ ADMIN)
GET /api/users/:id - Lấy thông tin một người dùng
PATCH /api/users/:id - Cập nhật thông tin người dùng (chỉ ADMIN)
DELETE /api/users/:id - Xóa người dùng (chỉ ADMIN)
```

### Posts

```
POST /api/posts - Tạo bài viết mới
GET /api/posts - Lấy danh sách bài viết
GET /api/posts/:id - Lấy thông tin một bài viết
PATCH /api/posts/:id - Cập nhật bài viết
DELETE /api/posts/:id - Xóa bài viết
```

### Comments

```
POST /api/comments - Tạo bình luận mới
GET /api/comments?postId=:postId - Lấy danh sách bình luận của một bài viết
GET /api/comments/:id - Lấy thông tin một bình luận
PATCH /api/comments/:id - Cập nhật bình luận
DELETE /api/comments/:id - Xóa bình luận
```

## Xác thực (Authentication)

Backend sử dụng JWT (JSON Web Token) để xác thực. Khi đăng nhập thành công, server sẽ trả về một access token mà frontend cần lưu trữ và gửi kèm trong header của các request yêu cầu xác thực.

### Đăng nhập

**Request:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "user@example.com",
    "firstName": "Normal",
    "lastName": "User",
    "role": "USER"
  }
}
```

### Sử dụng Access Token

Để truy cập các API được bảo vệ, thêm token vào header Authorization:

```
GET /api/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Tích hợp với Frontend

### Trong NextAuth.js

Cấu hình NextAuth.js để sử dụng JWT từ backend:

```typescript
// src/lib/auth/auth-options.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          return {
            id: String(data.user.id),
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`,
            role: data.user.role,
            accessToken: data.access_token
          };
        } catch (error) {
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role;
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};
```

### Tạo API Client

Tạo một API client để gọi API từ backend:

```typescript
// src/lib/api/client.ts
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = {
  async get(endpoint: string) {
    const session = await getSession();
    return fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
  },

  async post(endpoint: string, data: any) {
    const session = await getSession();
    return fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(res => res.json());
  },

  async patch(endpoint: string, data: any) {
    const session = await getSession();
    return fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(res => res.json());
  },

  async delete(endpoint: string) {
    const session = await getSession();
    return fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
  },
};
```

### Sử dụng API Client trong Components

```typescript
import { apiClient } from '@/lib/api/client';
import { useEffect, useState } from 'react';

export function PostsList() {
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

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

## Phân quyền (RBAC)

Backend đã triển khai RBAC (Role-Based Access Control) thông qua việc kiểm tra quyền trên mỗi endpoint. Frontend cần đảm bảo các chức năng và UI phù hợp với vai trò của người dùng.

Sử dụng thư viện CASL như đã triển khai trong frontend để kiểm soát quyền truy cập.
POST /api/auth/login - Đăng nhập
POST /api/auth/register - Đăng ký
POST /api/auth/refresh - Làm mới token
GET /api/auth/me - Lấy thông tin người dùng hiện tại
POST /api/auth/logout - Đăng xuất
```

### Người dùng

```
GET /api/users - Lấy danh sách người dùng
GET /api/users/:id - Lấy thông tin người dùng
POST /api/users - Tạo người dùng mới
PUT /api/users/:id - Cập nhật thông tin người dùng
DELETE /api/users/:id - Xóa người dùng
```

### Vai trò và Quyền hạn

```
GET /api/roles - Lấy danh sách vai trò
GET /api/roles/:id - Lấy thông tin chi tiết vai trò
POST /api/roles - Tạo vai trò mới
PUT /api/roles/:id - Cập nhật vai trò
DELETE /api/roles/:id - Xóa vai trò

GET /api/permissions - Lấy danh sách quyền hạn
```

## Tích hợp với NextAuth.js

Để tích hợp backend với NextAuth.js, cần cập nhật file `auth-options.ts` như sau:

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jose";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Gọi API đăng nhập từ backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            permissions: data.user.permissions,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      
      // Kiểm tra nếu token hết hạn
      if (token.accessToken) {
        const currentTime = Math.floor(Date.now() / 1000);
        const decodedToken = jwtDecode(token.accessToken as string);
        
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Làm mới token
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: token.refreshToken }),
            });
            
            if (response.ok) {
              const data = await response.json();
              token.accessToken = data.accessToken;
              if (data.refreshToken) {
                token.refreshToken = data.refreshToken;
              }
            } else {
              // Nếu không thể làm mới token, đăng xuất người dùng
              return {};
            }
          } catch (error) {
            console.error("Error refreshing token:", error);
            return {};
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

## Tạo API Client

Tạo một file `api-client.ts` để xử lý các request đến backend:

```typescript
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

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
  put: (endpoint: string, data: any) => fetchWithAuth(endpoint, "PUT", data),
  delete: (endpoint: string) => fetchWithAuth(endpoint, "DELETE"),
};
```

## Cập nhật CASL để sử dụng quyền hạn từ backend

Sau khi tích hợp với backend, CASL sẽ sử dụng quyền hạn được trả về từ API:

```typescript
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

## Hướng dẫn triển khai

1. Phát triển backend API theo cấu trúc đã định nghĩa
2. Cập nhật các file NextAuth.js để tích hợp với backend
3. Sử dụng API client để gọi các API từ backend
4. Cập nhật các component React để sử dụng dữ liệu từ API

## Lưu ý bảo mật

- Đảm bảo sử dụng HTTPS cho tất cả các request API
- Cấu hình CORS trên backend để chỉ cho phép frontend của bạn truy cập
- Triển khai rate limiting để ngăn chặn tấn công brute force
- Không lưu trữ thông tin nhạy cảm (như token) trong localStorage
