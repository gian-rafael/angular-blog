import { Component, OnInit, SecurityContext, Input } from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, Title } from "@angular/platform-browser";

import { Observable, of } from "rxjs";
import { pluck, take, tap, switchMap, map, catchError } from "rxjs/operators";
import { Remarkable } from "remarkable";

import { Blog, BlogWithAuthor } from "src/app/models/blog";
import { createBlogCrumbsFromRoot } from "../blog-crumbs/blog-crumbs.component";
import { AuthService } from "src/app/auth/auth.service";
import { BlogService } from "../../blog.service";
import { ToastService } from "src/app/toast.service";

@Component({
  selector: "blog-viewer",
  templateUrl: "./blog-viewer.component.html",
  styleUrls: ["./blog-viewer.component.scss"],
  providers: [TitleCasePipe],
})
export class BlogViewerComponent implements OnInit {
  @Input() blog$: Observable<BlogWithAuthor> = this.route.data.pipe(
    pluck("blog")
  );

  parser: Remarkable;

  readonly modalId = "confirmationModal";

  crumbs = createBlogCrumbsFromRoot();

  displayImageContent(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {}
    return false;
  }

  get isCurrentUser() {
    return this.blog$.pipe(
      switchMap((blog: Blog) => of(blog.userId === this.authService.user.id))
    );
  }

  renderBlogContent(content: string) {
    const sanitizedContent = this.sanitizer.sanitize(
      SecurityContext.HTML,
      this.parser.render(content)
    );
    return sanitizedContent;
  }

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private titleCase: TitleCasePipe,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.parser = new Remarkable({ html: true });
  }

  ngOnInit() {
    this.route.data
      .pipe(
        pluck("blog"),
        take(1),
        tap((blog: Blog) => {
          this.title.setTitle(this.titleCase.transform(blog.title));
          this.crumbs.push({ title: blog.title, link: "#" });
        })
      )
      .subscribe();
  }

  promptDelete() {
    // @ts-ignore
    $(`#${this.modalId}`).modal("show");
  }

  onPromptCancel() {
    // @ts-ignore
    $(`#${this.modalId}`).modal("hide");
  }

  onDelete() {
    this.blog$
      .pipe(
        take(1),
        switchMap((blog: Blog) => this.blogService.deleteBlog(blog))
      )
      .subscribe(() => {
        // @ts-ignore
        $(`#${this.modalId}`).modal("hide");

        this.router.navigate(["/"]);
        this.toastService.showMessage({
          title: "Deleted",
          description: "Blog deleted successfully",
          type: "success",
        });
      });
  }

  onResubmit() {
    this.blog$
      .pipe(
        take(1),
        map((blog) => {
          const tempBlog = { ...blog };
          delete tempBlog["user"];
          tempBlog.approvalStatus = "pending";
          return tempBlog;
        }),
        switchMap((blog) => this.blogService.saveBlog(blog)),
        switchMap(() => of(true)),
        catchError(() => of(false))
      )
      .subscribe((val) => {
        if (val) {
          this.toastService.showMessage({
            description: "Your submission is being reviewed.",
            title: "Blog Resubmitted",
            type: "success",
          });
        } else {
          this.toastService.showMessage({
            description: "We are unable to process your request at the moment.",
            title: "An error has occured",
            type: "error",
          });
        }
      });
  }
}
