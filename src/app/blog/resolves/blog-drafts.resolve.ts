import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Blog } from "src/app/models/blog";
import { BlogService } from "../blog.service";

@Injectable()
export class BlogDraftsResolve implements Resolve<Blog[]> {
  resolve() {
    return this.blogService.fetchDraftedBlogs();
  }

  constructor(private blogService: BlogService) {}
}
