import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";

import { pluck, defaultIfEmpty, switchMap } from "rxjs/operators";
import { ViewportService } from "src/app/viewport.service";
import { createBlogCrumbsFromRoot } from "../../components/blog-crumbs/blog-crumbs.component";

@Component({
  selector: "app-my-blogs-container",
  templateUrl: "./my-blogs-container.component.html",
  styleUrls: ["./my-blogs-container.component.scss"],
})
export class MyBlogsContainerComponent implements OnInit {
  blogs$ = this.route.data.pipe(pluck("blogs"), defaultIfEmpty([]));

  crumbs = createBlogCrumbsFromRoot();

  maxTitleLength: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private vp: ViewportService
  ) {}

  ngOnInit() {
    this.title.setTitle("My Blogs");
    this.maxTitleLength = this.vp.breakpoint$.pipe(
      switchMap((bp) => {
        let length = 12;
        switch (bp) {
          case "xs":
            break;
          case "sm":
            length = 24;
            break;
          case "md":
          case "lg":
            length = 35;
            break;
          case "xl":
          case "xxl":
            length = 50;
            break;
        }
        return of(length);
      })
    );
  }
}
