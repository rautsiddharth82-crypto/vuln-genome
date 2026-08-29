import { User } from '../types';
import { apiClient } from './apiClient';
import { INITIAL_USER } from '../data/mockData';

export interface LoginCredentials {
  username: string;
  password?: string;
  ssoProvider?: 'ARMY_SSO' | 'DOD_CAC' | 'NATO_ID';
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    const savedUser = localStorage.getItem('vuln_genome_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch {
        this.currentUser = null;
      }
    }
  }

  getCurrentUser(): User | null {
    if (!this.currentUser && apiClient.getToken()) {
      return INITIAL_USER;
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!apiClient.getToken() || !!this.currentUser;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const isSSO = !!credentials.ssoProvider;
    
    return apiClient.post<AuthResponse>(
      '/auth/token',
      credentials,
      async () => {
        // Realistic simulated JWT login response
        await new Promise((r) => setTimeout(r, 600));

        if (!isSSO && credentials.password === 'wrong') {
          throw new Error('Invalid security credentials or expired clearance.');
        }

        const mockToken = `eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.${btoa(
          JSON.stringify({ sub: credentials.username, role: 'ANALYST', clearance: 'TOP_SECRET' })
        )}.sig_mil_sec_${Date.now()}`;

        const user: User = {
          ...INITIAL_USER,
          username: credentials.username || 'analyst.vanguard',
          name: isSSO ? 'Maj. Sarah Vance (SSO Validated)' : 'Maj. Sarah Vance',
          lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        };

        apiClient.setToken(mockToken);
        localStorage.setItem('vuln_genome_user', JSON.stringify(user));
        this.currentUser = user;

        return {
          token: mockToken,
          user,
          expiresIn: 86400,
        };
      }
    );
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {}, () => Promise.resolve({}));
    } catch {
      // ignore
    } finally {
      apiClient.setToken(null);
      localStorage.removeItem('vuln_genome_user');
      this.currentUser = null;
    }
  }
}

export const authService = new AuthService();
