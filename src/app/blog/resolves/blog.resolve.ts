import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";

import { Blog } from "../../models/blog";
import { AuthService } from "../../auth/auth.service";
import { BlogService } from "../blog.service";

import { NEVER } from "rxjs";

@Injectable()
export class BlogResolve implements Resolve<Blog> {
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.params["id"];
    if (this.authService.isLoggedIn && id) {
      return this.blogService.fetchBlog(id);
    }
    return NEVER;
  }

  constructor(
    private authService: AuthService,
    private blogService: BlogService
  ) {}
}
