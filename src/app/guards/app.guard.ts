import { Injectable } from "@angular/core";
import { CanActivate, CanLoad, Router } from "@angular/router";

import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class AppGuard implements CanActivate, CanLoad {
  canActivate() {
    if (!this.authService.isLoggedIn) {
      console.log("navigate to auth");
      this.router.navigate(["/auth"]);
      return false;
    }

    return true;
  }

  canLoad() {
    if (!this.authService.isLoggedIn) {
      console.log("navigate to auth");
      this.router.navigate(["/auth"]);
      return false;
    }

    return true;
  }

  constructor(private authService: AuthService, private router: Router) {}
}
