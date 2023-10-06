import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Blog } from "src/app/models/blog";
import { BlogService } from "../blog.service";

@Injectable()
export class BlogDraftResolve implements Resolve<Blog> {
  resolve(route: ActivatedRouteSnapshot) {
    const id = route.params["id"];
    return this.blogService.fetchBlog(id);
  }

  constructor(private blogService: BlogService) {}
}
