import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, getApiBaseUrl } from './auth';
import type { ApiResponse, PaginatedResponse, AdminStats } from '@/types/api';
import type { User } from '@/types/user';
import type { Component, ComponentQueryParams } from '@/types/component';
import type { Category } from '@/types/category';

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchComponents(params?: ComponentQueryParams) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
  }

  const query = searchParams.toString();
  const path = query ? `/components?${query}` : '/components';

  return serverFetch<PaginatedResponse<Component>>(path);
}

export async function fetchComponentById(id: string) {
  return serverFetch<ApiResponse<Component>>(`/components/${id}`);
}

export async function fetchCategories() {
  return serverFetch<ApiResponse<Category[]>>('/categories');
}

export async function fetchAdminStats() {
  return serverFetch<ApiResponse<AdminStats>>('/admin/stats');
}

export async function fetchCurrentUser() {
  return serverFetch<ApiResponse<User>>('/auth/me');
}
