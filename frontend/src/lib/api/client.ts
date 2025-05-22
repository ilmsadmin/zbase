import { getSession, signOut } from "next-auth/react";
import { HttpError } from "./errors";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: Error) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  
  failedQueue = [];
};

async function refreshToken() {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("No user session found");
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    const newToken = data.access_token;

    // Update session token would happen in NextAuth

    isRefreshing = false;
    processQueue(null, newToken);
    return newToken;
  } catch (error) {
    isRefreshing = false;
    processQueue(error as Error);
    // Logout user when refresh token fails
    signOut({ callbackUrl: "/auth/login" });
    throw error;
  }
}

async function fetchWithAuth(
  endpoint: string,
  method: RequestMethod = "GET",
  data?: any
) {
  const session = await getSession();
  let accessToken = session?.accessToken;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  try {
    let response = await fetch(`${API_URL}${endpoint}`, options);

    // Handle token expiration (401 Unauthorized)
    if (response.status === 401 && session) {
      try {
        accessToken = await refreshToken();
        // Retry the original request with new token
        const newOptions = {
          ...options,
          headers: {
            ...options.headers as Record<string, string>,
            Authorization: `Bearer ${accessToken}`,
          },
        };
        response = await fetch(`${API_URL}${endpoint}`, newOptions);
      } catch (refreshError) {
        // If token refresh fails, throw unauthorized error
        throw new HttpError(401, "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
    }    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpError(
        response.status,
        errorData.message || "Đã xảy ra lỗi khi gọi API",
        errorData
      );
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      // Handle empty responses - return empty object instead of trying to parse
      return text ? JSON.parse(text) : {};
    }
    
    return {};
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, (error as Error)?.message || "Đã xảy ra lỗi không mong muốn");
  }
}

export const apiClient = {
  get: (endpoint: string) => fetchWithAuth(endpoint, "GET"),
  post: (endpoint: string, data: any) => fetchWithAuth(endpoint, "POST", data),
  patch: (endpoint: string, data: any) => fetchWithAuth(endpoint, "PATCH", data),
  delete: (endpoint: string) => fetchWithAuth(endpoint, "DELETE"),
};
