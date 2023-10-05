import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";

import { Blog, BlogWithAuthor } from "../models/blog";
import { BLOG_API } from "../api/api.module";
import { map, switchMap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(BLOG_API) private API_ENDPOINT: string
  ) {}

  fetchBlogs(): Observable<Blog[]> {
    return (
      this.http
        // .get<Blog[]>(`${this.API_ENDPOINT}?approvalStatus=approved`)
        .get<Blog[]>(`${this.API_ENDPOINT}`)
        .pipe(
          switchMap((blogs) =>
            of(
              blogs.map((blog) => ({
                ...blog,
                timestamp: new Date(blog.timestamp),
              }))
            )
          )
        )
    );
  }

  fetchBlog(id: number): Observable<BlogWithAuthor> {
    return this.http.get<BlogWithAuthor>(
      `${this.API_ENDPOINT}/${id}?_expand=user`
    );
  }

  fetchPendingBlogs() {
    const userId = this.authService.user.id;
    return this.http
      .get<Blog[]>(
        `${this.API_ENDPOINT}?approvalStatus=pending&userId=${userId}`
      )
      .pipe(
        switchMap((blogs) =>
          of(
            blogs.map((blog) => ({
              ...blog,
              timestamp: new Date(blog.timestamp),
            }))
          )
        )
      );
  }

  createBlog(blog: Partial<Blog>): Observable<Blog> {
    blog.userId = this.authService.user.id;
    return this.http.post<Blog>(this.API_ENDPOINT, blog);
  }

  saveBlogAsDraft(blog: Partial<Blog>): Observable<any> {
    return;
  }
}
