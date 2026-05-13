export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}
