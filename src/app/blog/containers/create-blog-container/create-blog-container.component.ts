import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { Blog } from "src/app/models/blog";
import { BlogService } from "../../blog.service";
import { take } from "rxjs/operators";
import { createBlogCrumbsFromRoot } from "../../components/blog-crumbs/blog-crumbs.component";

@Component({
  selector: "app-create-blog-container",
  templateUrl: "./create-blog-container.component.html",
  styleUrls: ["./create-blog-container.component.scss"],
})
export class CreateBlogContainerComponent {
  form = this.fb.group({
    title: ["", [Validators.required, Validators.maxLength(50)]],
    content: ["", Validators.required],
    imgContentUrl: ["", [this.validUrl]],
  });

  get requiredTitle() {
    const control = this.form.get("title");
    return control.hasError("required") && control.touched;
  }

  get titleMaxLength() {
    const control = this.form.get("title");
    return control.hasError("maxlength");
  }

  get requiredContent() {
    const control = this.form.get("content");
    return control.hasError("required") && control.touched;
  }

  get invalidImageUrl() {
    const control = this.form.get("imgContentUrl");
    console.log(control.errors);
    return (
      control.hasError("invalidUrl") &&
      control.touched &&
      control.value.trim() !== ""
    );
  }

  crumbs = createBlogCrumbsFromRoot();

  constructor(private fb: FormBuilder, private blogService: BlogService) {
    this.crumbs.push({
      title: "Create New Blog",
      link: "#",
    });
  }

  validUrl(control: AbstractControl) {
    const url = control.value;
    let validUrl = true;

    try {
      if(url.trim() !== "") {
        new URL(url);
      }
    } catch (_) {
      validUrl = false;
    }

    return validUrl ? null : { invalidUrl: true };
  }

  onSubmit(type: "CREATE" | "DRAFT") {
    const { title, content, imgContentUrl }: Partial<Blog> = this.form.value;

    switch (type) {
      case "CREATE":
        const newBlog: Partial<Blog> = {
          approvalStatus: "pending",
          content,
          title,
          imgContentUrl,
          timestamp: new Date(),
        };
        this.blogService.createBlog(newBlog).pipe(take(1)).subscribe();
        // TODO: Navigate to home and show message that blog has been created successfully
        break;
      case "DRAFT":
        break;
    }
  }
}
