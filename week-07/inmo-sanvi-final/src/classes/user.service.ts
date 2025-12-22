import { Http } from "./http.class";
import { SERVER } from "../constants";
import type {
  User,
  SingleUserResponse,
  UserProfile,
  UserAvatar,
  UserPassword,
  AvatarUpdate,
} from "../interfaces/user.interfaces";

export class UserService {
  #http: Http;

  constructor() {
    this.#http = new Http();
  }

  async getProfile(id?: number): Promise<User> {
    const url = id ? `${SERVER}/users/${id}` : `${SERVER}/users/me`;
    const resp = await this.#http.get<SingleUserResponse>(url);
    return resp.user;
  }

  async saveProfile(name: string, email: string): Promise<void> {
    await this.#http.put<void, UserProfile>(`${SERVER}/users/me`, {
      name,
      email,
    });
  }

  async saveAvatar(avatar: string): Promise<string> {
    const resp = await this.#http.put<AvatarUpdate, UserAvatar>(
      `${SERVER}/users/me/avatar`,
      { avatar }
    );
    return resp.avatar;
  }

  async savePassword(password: string): Promise<void> {
    await this.#http.put<void, UserPassword>(`${SERVER}/users/me/password`, {
      password,
    });
  }
}
