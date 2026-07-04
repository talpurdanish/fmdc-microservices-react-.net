// api/UserService.ts
import { Constants } from "../../Helpers/Constants";
import type { IApiClient } from "./Generics/IApiClient";
import { createLoginModel, type LoginModel } from "../Models/Login.Model";

const baseUri = "/users";

export class AuthService {
  constructor(private client: IApiClient) {}

  GetUser(): LoginModel | null {
    const u = sessionStorage.getItem(Constants.USER_STORAGE_KEY);
    return u ? (JSON.parse(u) as LoginModel) : null;
  }

  async Login(username: string, password: string): Promise<LoginModel | null> {
    if (!username || !password) return null;
    const url = `${baseUri}/login`;
    // const pwd = this.rsaHelper.encrypt(password);
    const res = await this.client.post<LoginModel>(
      url,
      { username, password },
      createLoginModel,
    );
    return res.result ?? null;
  }

  async LoginWithGoogle(googleToken: string): Promise<LoginModel | null> {
    if (!googleToken) return null;
    const url = `${baseUri}/googlelogin`;
    const res = await this.client.post<LoginModel>(
      url,
      { googleToken },
      createLoginModel,
    );
    return res.result ?? null;
  }

  async Logout(): Promise<boolean> {
    const url = `${baseUri}/logout`;
    const res = await this.client.get<boolean>(url);

    return !res.error;
  }
}
