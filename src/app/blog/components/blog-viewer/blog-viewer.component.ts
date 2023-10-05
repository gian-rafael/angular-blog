import { Component, OnInit, SecurityContext } from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { pluck, take, tap } from "rxjs/operators";
import { Blog } from "src/app/models/blog";

import { Remarkable } from "remarkable";
import { createBlogCrumbsFromRoot } from "../blog-crumbs/blog-crumbs.component";

@Component({
  selector: "app-blog-viewer",
  templateUrl: "./blog-viewer.component.html",
  styleUrls: ["./blog-viewer.component.scss"],
  providers: [TitleCasePipe],
})
export class BlogViewerComponent implements OnInit {
  blog$ = this.route.data.pipe(pluck("blog"));

  parser: Remarkable;

  crumbs = createBlogCrumbsFromRoot();

  displayImageContent(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {}
    return false;
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
    private sanitizer: DomSanitizer
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
}
