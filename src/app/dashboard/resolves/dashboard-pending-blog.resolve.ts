import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

import { Blog } from "../../models/blog";
import { BlogService } from "src/app/blog/blog.service";

@Injectable()
export class DashboardPendingBlogsResolve implements Resolve<Blog[]> {
  resolve() {
    return this.blogService.fetchPendingBlogs();
  }

  constructor(private blogService: BlogService) {}
}
