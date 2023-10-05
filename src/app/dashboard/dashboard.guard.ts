import { Injectable } from "@angular/core";
import { CanLoad, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class DashboardGuard implements CanLoad {
  canLoad() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(["/auth", "login"]);
      return false;
    }

    return (
      this.authService.isLoggedIn && this.authService.user.role === "admin"
    );
  }

  constructor(private authService: AuthService, private router: Router) {}
}
