import { Injectable } from "@angular/core";
import { CanActivateChild } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class BlogGuard implements CanActivateChild {
  canActivateChild() {
    return this.authService.isLoggedIn;
  }

  constructor(private authService: AuthService) {}
}
