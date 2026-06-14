import axios, { AxiosError } from 'axios';
import type { ApiResponse, PaginatedResponse, AdminStats } from '@/types/api';
import type { User } from '@/types/user';
import type {
  Component,
  ComponentQueryParams,
  CreateComponentDto,
  UpdateComponentDto,
} from '@/types/component';
import type { Category } from '@/types/category';

function getClientBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }

  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
}

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.baseURL = getClientBaseUrl();
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<never>>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const isLoginPage = window.location.pathname === '/admin/login';

      if (isAdminRoute && !isLoginPage) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  },
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw { response: { data, status: response.status } };
    }

    return { data };
  },

  logout: async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    const data = await response.json();
    return { data };
  },

  me: () => api.get<ApiResponse<User>>('/auth/me'),
};

export const componentsApi = {
  getAll: (params?: ComponentQueryParams) =>
    api.get<PaginatedResponse<Component>>('/components', { params }),
  getById: (id: string) => api.get<ApiResponse<Component>>(`/components/${id}`),
  create: (data: CreateComponentDto) => api.post<ApiResponse<Component>>('/components', data),
  update: (id: string, data: UpdateComponentDto) =>
    api.put<ApiResponse<Component>>(`/components/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/components/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
};

export const adminApi = {
  getStats: () => api.get<ApiResponse<AdminStats>>('/admin/stats'),
};

export default api;
