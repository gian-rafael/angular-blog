import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, of, BehaviorSubject, EMPTY } from "rxjs";
import { switchMap, tap, map, catchError } from "rxjs/operators";

import { Blog, BlogWithAuthor } from "../models/blog";
import { BLOG_API } from "../api/api.module";
import { AuthService } from "../auth/auth.service";
import { ToastService } from "../toast.service";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  private changes = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService,
    @Inject(BLOG_API) private API_ENDPOINT: string
  ) {}

  fetchBlogs(): Observable<Blog[]> {
    return (
      this.http
        .get<Blog[]>(
          `${this.API_ENDPOINT}?approvalStatus=approved&_expand=user`
        )
        // .get<Blog[]>(`${this.API_ENDPOINT}?_expand=user`)
        .pipe(
          switchMap((blogs) =>
            of(
              blogs.map((blog) => ({
                ...blog,
                timestamp: new Date(blog.timestamp),
              }))
            )
          ),
          catchError(() => {
            this.toastService.showMessage({
              title: "Error",
              description: "An error has occured while retrieving blogs.",
              type: "error",
            });
            return EMPTY;
          })
        )
    );
  }

  fetchUserBlogs() {
    const { id } = this.authService.user;
    return (
      this.http
        .get<Blog[]>(`${this.API_ENDPOINT}?userId=${id}&_expand=user`)
        // .get<Blog[]>(`${this.API_ENDPOINT}?_expand=user`)
        .pipe(
          switchMap((blogs) =>
            of(
              blogs.map((blog) => ({
                ...blog,
                timestamp: new Date(blog.timestamp),
              }))
            )
          ),
          catchError((err) => {
            this.toastService.showMessage({
              title: "Error",
              description: "An error has occured while retrieving blogs.",
              type: "error",
            });
            return EMPTY;
          })
        )
    );
  }

  fetchDraftedBlogs(): Observable<Blog[]> {
    const { id } = this.authService.user;
    return (
      this.http
        .get<Blog[]>(`${this.API_ENDPOINT}?approvalStatus=drafted&userId=${id}`)
        // .get<Blog[]>(`${this.API_ENDPOINT}?_expand=user`)
        .pipe(
          switchMap((blogs) =>
            of(
              blogs.map((blog) => ({
                ...blog,
                timestamp: new Date(blog.timestamp),
              }))
            )
          ),
          catchError(() => {
            this.toastService.showMessage({
              title: "Error",
              description: "An error has occured while retrieving blogs.",
              type: "error",
            });
            return EMPTY;
          })
        )
    );
  }

  fetchBlog(id: number): Observable<BlogWithAuthor> {
    return this.http.get<BlogWithAuthor>(
      `${this.API_ENDPOINT}/${id}?_expand=user`
    );
  }

  fetchPendingBlogs(): Observable<Blog[]> {
    return this.changes.pipe(
      switchMap(() =>
        this.http.get<Blog[]>(
          `${this.API_ENDPOINT}?_expand=user&approvalStatus=pending`
        )
      ),
      map((blogs) =>
        blogs.map((blog) => ({
          ...blog,
          timestamp: new Date(blog.timestamp),
        }))
      )
    );
  }

  fetchRejectedBlogs(): Observable<Blog[]> {
    return this.changes.pipe(
      switchMap(() =>
        this.http.get<Blog[]>(
          `${this.API_ENDPOINT}?_expand=user&approvalStatus=rejected`
        )
      ),
      map((blogs) =>
        blogs.map((blog) => ({
          ...blog,
          timestamp: new Date(blog.timestamp),
        }))
      )
    );
  }

  createBlog(blog: Partial<Blog>): Observable<Blog> {
    blog.userId = this.authService.user.id;
    delete blog["user"];
    return this.http.post<Blog>(this.API_ENDPOINT, blog);
  }

  saveBlog(blog: Partial<Blog>): Observable<Blog> {
    const id = blog.id;
    delete blog["user"];
    return this.http.patch<Blog>(`${this.API_ENDPOINT}/${id}`, blog);
  }

  approveBlog(blog: Blog): Observable<any> {
    blog.approvalStatus = "approved";
    delete blog["user"];
    return this.http
      .patch<any>(`${this.API_ENDPOINT}/${blog.id}`, blog)
      .pipe(tap(() => this.changes.next(null)));
  }

  rejectBlog(blog: Blog): Observable<any> {
    blog.approvalStatus = "rejected";
    delete blog["user"];
    return this.http
      .patch<any>(`${this.API_ENDPOINT}/${blog.id}`, blog)
      .pipe(tap(() => this.changes.next(null)));
  }

  deleteBlog(blog: Blog) {
    return this.http.delete(`${this.API_ENDPOINT}/${blog.id}`);
  }
}
