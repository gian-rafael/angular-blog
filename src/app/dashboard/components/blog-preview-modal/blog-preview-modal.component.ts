import {
  Component,
  Input,
  Output,
  EventEmitter,
  SecurityContext,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Blog } from "src/app/models/blog";

import { Remarkable } from "remarkable";

@Component({
  selector: "blog-preview-modal",
  templateUrl: "./blog-preview-modal.component.html",
  styleUrls: ["./blog-preview-modal.component.scss"],
})
export class BlogPreviewModalComponent {
  @Input() id: string;
  @Input() blog: Blog;

  @Output() approve: EventEmitter<Blog> = new EventEmitter();
  @Output() reject: EventEmitter<Blog> = new EventEmitter();

  renderBlogContent(content: string) {
    const sanitizedContent = this.sanitizer.sanitize(
      SecurityContext.HTML,
      this.parser.render(content)
    );
    return sanitizedContent;
  }

  displayImageContent(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {}
    return false;
  }

  private parser: Remarkable;

  constructor(private sanitizer: DomSanitizer) {
    this.parser = new Remarkable({ html: true });
  }

  onReject() {
    this.reject.emit(this.blog);
  }

  onApprove() {
    this.approve.emit(this.blog);
  }
}
