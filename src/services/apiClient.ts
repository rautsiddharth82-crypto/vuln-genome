// Centralized API Client supporting FastAPI + LangGraph + CrewAI Backend
// and graceful fallback to realistic local autonomous security engine

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('vuln_genome_jwt');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('vuln_genome_jwt', token);
    } else {
      localStorage.removeItem('vuln_genome_jwt');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('vuln_genome_jwt');
    }
    return this.token;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    fallbackData?: () => Promise<T> | T
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          window.dispatchEvent(new CustomEvent('auth_unauthorized'));
        }
        throw new Error(`API Error [${response.status}]: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      // If demo mode or backend is not reachable, fallback smoothly
      if (fallbackData) {
        // Return simulated realistic response
        return await fallbackData();
      }
      throw err;
    }
  }

  async get<T>(endpoint: string, fallbackData?: () => Promise<T> | T): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, fallbackData);
  }

  async post<T>(endpoint: string, body?: any, fallbackData?: () => Promise<T> | T): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      fallbackData
    );
  }

  async put<T>(endpoint: string, body?: any, fallbackData?: () => Promise<T> | T): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      fallbackData
    );
  }

  async delete<T>(endpoint: string, fallbackData?: () => Promise<T> | T): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, fallbackData);
  }
}

export const apiClient = new ApiClient();
