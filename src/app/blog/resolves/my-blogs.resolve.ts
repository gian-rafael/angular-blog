import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";

import { Blog } from "../../models/blog";
import { AuthService } from "../../auth/auth.service";
import { BlogService } from "../blog.service";

import { EMPTY } from "rxjs";

@Injectable()
export class MyBlogsResolve implements Resolve<Blog[]> {
  resolve() {
    if (this.authService.isLoggedIn) {
      return this.blogService.fetchUserBlogs();
    }
    return EMPTY;
  }

  constructor(
    private authService: AuthService,
    private blogService: BlogService
  ) {}
}
