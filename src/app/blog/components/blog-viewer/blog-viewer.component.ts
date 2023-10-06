import { Component, OnInit, SecurityContext } from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, Title } from "@angular/platform-browser";

import { of, EMPTY } from "rxjs";
import { pluck, take, tap, switchMap, catchError } from "rxjs/operators";

import { Remarkable } from "remarkable";
import { Blog } from "src/app/models/blog";
import { createBlogCrumbsFromRoot } from "../blog-crumbs/blog-crumbs.component";
import { AuthService } from "src/app/auth/auth.service";
import { BlogService } from "../../blog.service";
import { ToastService } from "src/app/toast.service";

@Component({
  selector: "app-blog-viewer",
  templateUrl: "./blog-viewer.component.html",
  styleUrls: ["./blog-viewer.component.scss"],
  providers: [TitleCasePipe],
})
export class BlogViewerComponent implements OnInit {
  blog$ = this.route.data.pipe(pluck("blog"));

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
    this.parser = new Remarkable();
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
}
