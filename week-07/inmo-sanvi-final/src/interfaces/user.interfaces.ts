import type { RegisterData } from "./auth.interfaces";

export interface User extends Omit<RegisterData, "password"> {
  id: number;
  me?: boolean; // Indicates if the user is the currently logged-in user is an optional field from the server
}

export interface SingleUserResponse {
  user: User;
}

export interface UserAvatar {
  avatar: string; // Image is in base64 format
}

export interface UserProfile {
  name: string;
  email: string;
}

export interface UserPassword {
  password: string;
}

// Response interfaces for updates
export interface AvatarUpdate {
  avatar: string;
}

export interface PasswordUpdate {
  password: string;
}
