import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { BlogService } from "../blog.service";
import { of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BlogWithAuthor } from "src/app/models/blog";

@Injectable()
export class DraftItemGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot) {
    const id = route.params["id"];
    return this.blogService.fetchBlog(id).pipe(
      switchMap((blog: BlogWithAuthor) => {
        return of(blog.userId === this.authService.user.id);
      })
    );
  }

  constructor(
    private authService: AuthService,
    private blogService: BlogService
  ) {}
}
