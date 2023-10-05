import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Blog } from "src/app/models/blog";

@Component({
  selector: "pending-blog-item",
  templateUrl: "./pending-blog-item.component.html",
  styleUrls: ["./pending-blog-item.component.scss"],
})
export class PendingBlogItemComponent {
  @Input() blog: Blog;

  @Output() select: EventEmitter<void> = new EventEmitter();

  onItemClick() {
    this.select.emit();
  }
}
