import { Component, Input } from "@angular/core";

export interface BlogCrumb {
  title: string;
  link: string;
}

export function createBlogCrumbsFromRoot(): BlogCrumb[] {
  return [
    {
      link: "/",
      title: "Blogs",
    },
  ];
}

@Component({
  selector: "blog-crumbs",
  templateUrl: "./blog-crumbs.component.html",
  styleUrls: ["./blog-crumbs.component.scss"],
})
export class BlogCrumbsComponent {
  @Input() data: BlogCrumb[];
}
