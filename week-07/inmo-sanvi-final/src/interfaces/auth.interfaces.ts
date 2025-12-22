export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  avatar: string; // Image is in base64 format
}

export interface TokenResponse {
  accessToken: string;
}
