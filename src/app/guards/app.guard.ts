import { Injectable } from "@angular/core";
import { CanActivate, CanLoad, Router } from "@angular/router";

import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class AppGuard implements CanActivate, CanLoad {
  canActivate() {
    console.log("called");
    if (!this.authService.isLoggedIn) {
      this.router.navigate(["/auth"]);
      return false;
    } else {
      if (this.authService.user.role === "admin") {
        this.router.navigate(["/dashboard"]);
        return false;
      }
    }
    return true;
  }

  canLoad() {
    if (!this.authService.isLoggedIn) {
      console.log("navigate to auth");
      this.router.navigate(["/auth"]);
      return false;
    } else {
      if (this.authService.user.role === "admin") {
        this.router.navigate(["/dashboard"]);
        return false;
      }
    }

    return true;
  }

  constructor(private authService: AuthService, private router: Router) {}
}
