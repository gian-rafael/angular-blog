import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { pluck, defaultIfEmpty } from "rxjs/operators";
import { createBlogCrumbsFromRoot } from "../../components/blog-crumbs/blog-crumbs.component";

@Component({
  selector: "blog-container",
  templateUrl: "./blog-container.component.html",
  styleUrls: ["./blog-container.component.scss"],
})
export class BlogContainerComponent {
  blogs$ = this.route.data.pipe(pluck("blogs"), defaultIfEmpty([]));

  crumbs = createBlogCrumbsFromRoot();

  constructor(private route: ActivatedRoute, private title: Title) {
    this.title.setTitle("Home");
  }
}
