const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  roles: string[];
  expiresAt: string;
}

export interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  createdAt: string;
}

export interface RoleItem {
  id: string;
  name: string;
}

class ApiClient {
  private getHeaders(token?: string): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    return res.json();
  }

  // Auth Endpoints
  async register(data: { email: string; password: string; firstName?: string; lastName?: string; role?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(res);
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<AuthResponse>(res);
  }

  async getCurrentUser(token: string): Promise<UserInfo> {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: this.getHeaders(token),
    });
    return this.handleResponse<UserInfo>(res);
  }

  async getRoles(): Promise<RoleItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/roles`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<RoleItem[]>(res);
  }

  // Dashboard Endpoints
  async getDashboard(role: 'admin' | 'delivery' | 'customer' | 'overview', token: string) {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/${role}`, {
      headers: this.getHeaders(token),
    });
    return this.handleResponse<Record<string, unknown>>(res);
  }
}

export const api = new ApiClient();
