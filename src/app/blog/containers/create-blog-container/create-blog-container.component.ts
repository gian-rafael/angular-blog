import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { Blog } from "src/app/models/blog";
import { BlogService } from "../../blog.service";
import { take } from "rxjs/operators";
import { createBlogCrumbsFromRoot } from "../../components/blog-crumbs/blog-crumbs.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "src/app/toast.service";

@Component({
  selector: "app-create-blog-container",
  templateUrl: "./create-blog-container.component.html",
  styleUrls: ["./create-blog-container.component.scss"],
})
export class CreateBlogContainerComponent implements OnInit {
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
    return (
      control.hasError("invalidUrl") &&
      control.touched &&
      control.value.trim() !== ""
    );
  }

  crumbs = createBlogCrumbsFromRoot();
  mode: "create" | "edit" = "create";
  draftCopy?: Blog;
  forDiscard: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe((data) => {
      if (data.draft) {
        const { title, content, imgContentUrl } = data.draft as Blog;
        this.draftCopy = { ...data.draft };
        this.form.get("title").setValue(title);
        this.form.get("content").setValue(content);
        this.form.get("imgContentUrl").setValue(imgContentUrl);
        this.mode = "edit";
        this.crumbs = [
          {
            link: "/drafts",
            title: "Drafts",
          },
          {
            link: "#",
            title: "Edit Draft",
          },
        ];
      } else {
        this.crumbs = createBlogCrumbsFromRoot();
        this.crumbs.push({
          title: "Create New Blog",
          link: "#",
        });
      }
    });
  }

  validUrl(control: AbstractControl) {
    const url = control.value;
    let validUrl = true;

    try {
      if (url.trim() !== "") {
        new URL(url);
      }
    } catch (_) {
      validUrl = false;
    }

    return validUrl ? null : { invalidUrl: true };
  }

  onSubmit(type: "CREATE" | "DRAFT") {
    const blog: Partial<Blog> = this.form.value;

    switch (type) {
      case "CREATE":
        const newBlog: Partial<Blog> = {
          ...this.draftCopy,
          ...blog,
          approvalStatus: "pending",
          timestamp: new Date(),
        };
        if (this.mode === "create") {
          this.blogService.createBlog(newBlog).pipe(take(1)).subscribe();
        } else {
          this.blogService.submitDraft(newBlog).pipe(take(1)).subscribe();
        }
        this.router.navigate(["/"]);
        this.toastService.showMessage({
          title: "Blog Submitted",
          description: "Your post is being reviewed.",
          type: "success",
        });
        break;
      case "DRAFT":
        const tempBlog: Partial<Blog> = {
          ...this.draftCopy,
          ...blog,
          approvalStatus: "drafted",
          timestamp: new Date(),
        };
        if (this.mode === "create") {
          this.blogService.createBlog(tempBlog).pipe(take(1)).subscribe();
        } else {
          this.blogService.submitDraft(tempBlog).pipe(take(1)).subscribe();
        }
        this.router.navigate(["/drafts"]);
        this.toastService.showMessage({
          title: "Blog Drafted",
          description: "Blog has been saved as draft.",
          type: "success",
        });
        break;
    }
  }

  onDiscard() {
    this.forDiscard = true;
    if (this.mode === "create") {
      this.router.navigate(["/"]);
    } else {
      this.router.navigate(["/drafts"]);
    }
  }
}
