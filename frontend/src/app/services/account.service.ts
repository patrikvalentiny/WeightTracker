import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";

import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {TokenService} from "./token.service";
import {User} from "../dtos/user";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  httpClient: HttpClient = inject(HttpClient);
  tokenService: TokenService = inject(TokenService);
  router: Router = inject(Router);
  user: User | null = null;

  async login(username: string, password: string) {
    try {
      const call = this.httpClient.post<{
        token: string,
        user: User
      }>(environment.baseUrl + "/account/login", {username: username, password: password});
      const response = await firstValueFrom<{ token: string, user: User }>(call);
      this.tokenService.setToken(response.token);
      await this.router.navigate(["/"])
      this.user = response.user;
    } catch (e) {
      throw e;
    }
  }

  async register(value: FormGroup) {
    try {
      const call = this.httpClient.post<{
        token: string,
        user: User
      }>(environment.baseUrl + "/account/register", value.value);
      const response = await firstValueFrom<{ token: string, user: User }>(call);
      this.tokenService.setToken(response.token);
      await this.router.navigate(["/onboarding/weight"])
    } catch (e) {
      throw e;
    }
  }

  async logout() {
    this.tokenService.clearToken();
    await this.router.navigate(["/login"])
  }
}
