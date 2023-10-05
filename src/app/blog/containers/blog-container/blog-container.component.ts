import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { pluck, defaultIfEmpty } from "rxjs/operators";
import { createBlogCrumbsFromRoot } from "../../components/blog-crumbs/blog-crumbs.component";
import { ViewportService } from "src/app/viewport.service";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "blog-container",
  templateUrl: "./blog-container.component.html",
  styleUrls: ["./blog-container.component.scss"],
})
export class BlogContainerComponent implements OnInit {
  blogs$ = this.route.data.pipe(pluck("blogs"), defaultIfEmpty([]));

  crumbs = createBlogCrumbsFromRoot();

  maxTitleLength: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private vp: ViewportService
  ) {}

  ngOnInit() {
    this.title.setTitle("Home");
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
