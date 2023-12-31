import {inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  tokenService: TokenService = inject(TokenService);
  router = inject(Router);

  async canActivate() {
    if (this.tokenService.getToken() === null) {
      await this.router.navigate(["/login"]);
      return false;
    } else {
      return true;
    }
  }
}
