import { Component, Input } from "@angular/core";
import { Blog } from "src/app/models/blog";

@Component({
  selector: "blog-item",
  templateUrl: "./blog-item.component.html",
  styleUrls: ["./blog-item.component.scss"],
})
export class BlogItemComponent {
  @Input() blog: Blog;
  @Input() titleLength: number = 15;
  @Input() page: "blogs" | "drafts" | "my-blogs" = "blogs";

  get routerLink() {
    switch (this.page) {
      case "blogs":
        return ["/blog", this.blog.id];
      case "drafts":
        return ["/drafts", "edit", this.blog.id];
      case "my-blogs":
        switch (this.blog.approvalStatus) {
          case "drafted":
            return ["/drafts", "edit", this.blog.id];
          case "approved":
          case "pending":
          case "rejected":
            return ["/blog", this.blog.id];
        }
    }
  }

  displayImageContent(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {}
    return false;
  }
}
