import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
  canActivate() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["/home"]);
      return false;
    }
    return true;
  }

  canActivateChild() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["/home"]);
      return false;
    }
    return true;
  }

  constructor(private authService: AuthService, private router: Router) {}
}
