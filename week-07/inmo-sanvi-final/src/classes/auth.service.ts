import { Http } from "./http.class";
import { SERVER } from "../constants";
import type {
  LoginData,
  RegisterData,
  TokenResponse,
} from "../interfaces/auth.interfaces";
import type { User } from "../interfaces/user.interfaces";

export class AuthService {
  #http: Http;

  constructor() {
    this.#http = new Http();
  }

  // Returns an empty promise because the only important is it fails or not
  // It saves the token in localStorage
  async login(credentials: LoginData): Promise<void> {
    const response = await this.#http.post<TokenResponse, LoginData>(
      `${SERVER}/auth/login`,
      credentials
    );

    // save token with the key "token" as the exercise says
    localStorage.setItem("token", response.accessToken);
  }

  // Method to register a new user
  async register(data: RegisterData): Promise<User> {
    // Register returns the User object created
    return await this.#http.post<User, RegisterData>(
      `${SERVER}/auth/register`,
      data
    );
  }

  // Method to verify the token
  // This is called on every protected page
  async checkToken(): Promise<void> {
    await this.#http.get<void>(`${SERVER}/auth/validate`);
  }

  // Method to log out the user
  logout(): void {
    localStorage.removeItem("token");
    location.assign("login.html");
  }

  // Auxiliary method to know if there's a token saved (without server validation)
  static get isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }
}
