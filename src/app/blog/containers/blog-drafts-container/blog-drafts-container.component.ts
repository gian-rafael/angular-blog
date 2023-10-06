import { Observable, of } from "rxjs";
import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { pluck, defaultIfEmpty, switchMap } from "rxjs/operators";
import { ViewportService } from "src/app/viewport.service";

@Component({
  selector: "app-blog-drafts-container",
  templateUrl: "./blog-drafts-container.component.html",
  styleUrls: ["./blog-drafts-container.component.scss"],
})
export class BlogDraftsContainerComponent {
  blogs$ = this.route.data.pipe(pluck("blogs"), defaultIfEmpty([]));
  maxTitleLength: Observable<number>;

  crumbs = [
    {
      link: "/drafts",
      title: "Drafts",
    },
  ];
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
