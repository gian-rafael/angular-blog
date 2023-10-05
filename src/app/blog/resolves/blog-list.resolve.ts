import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

import { Blog } from "../../models/blog";
import { AuthService } from "../../auth/auth.service";
import { BlogService } from "../blog.service";

import { NEVER } from "rxjs";

@Injectable()
export class BlogListResolve implements Resolve<Blog[]> {
  resolve() {
    if (this.authService.isLoggedIn) {
      return this.blogService.fetchBlogs();
    }
    return NEVER;
  }

  constructor(
    private authService: AuthService,
    private blogService: BlogService
  ) {}
}
