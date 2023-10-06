import { Component, Input } from "@angular/core";

@Component({
  selector: "blog-content-help",
  templateUrl: "./blog-content-help.component.html",
  styleUrls: ["./blog-content-help.component.scss"],
})
export class BlogContentHelpComponent {
  @Input() modalId: string;
}
