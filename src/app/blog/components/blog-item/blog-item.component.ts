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
  @Input() page: "blogs" | "drafts" = "blogs";

  displayImageContent(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {}
    return false;
  } 
}
