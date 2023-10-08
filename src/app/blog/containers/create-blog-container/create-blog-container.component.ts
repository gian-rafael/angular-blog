import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { Blog, BlogWithAuthor } from "src/app/models/blog";
import { BlogService } from "../../blog.service";
import { take } from "rxjs/operators";
import { createBlogCrumbsFromRoot } from "../../components/blog-crumbs/blog-crumbs.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "src/app/toast.service";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/models/user";
import { Observable, of } from "rxjs";

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
  mode: "create" | "editDraft" | "editBlog" = "create";
  draftCopy?: Blog;
  blogCopy?: Blog;
  forDiscard: boolean = false;
  submitted: boolean = false;

  isPreviewMode: boolean = false;
  blogPreview: Observable<Partial<BlogWithAuthor>>;

  readonly helpModalId: string = "blogHelpModal";

  get helpModal() {
    // @ts-ignore
    return $(`#${this.helpModalId}`);
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe((data) => {
      if (data.draft) {
        const { title, content, imgContentUrl } = data.draft as Blog;
        this.draftCopy = { ...data.draft };
        this.form.get("title").setValue(title);
        this.form.get("content").setValue(content);
        this.form.get("imgContentUrl").setValue(imgContentUrl);
        this.mode = "editDraft";
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
      } else if (data.blog) {
        const { title, content, imgContentUrl } = data.blog as Blog;
        this.blogCopy = { ...data.blog };
        this.form.get("title").setValue(title);
        this.form.get("content").setValue(content);
        this.form.get("imgContentUrl").setValue(imgContentUrl);
        this.mode = "editBlog";
        this.crumbs = [
          {
            link: "/blogs",
            title: "Blogs",
          },
          {
            link: "#",
            title: "Edit Blog",
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

  onSubmit(type: "CREATE" | "DRAFT" | "EDIT") {
    const blog: Partial<Blog> = this.form.value;
    this.submitted = true;
    switch (type) {
      case "CREATE":
        const newBlog: Partial<Blog> = {
          ...this.draftCopy,
          ...blog,
          approvalStatus: "pending",
          timestamp: new Date(),
        };
        delete newBlog["user"];
        if (this.mode === "create") {
          this.blogService.createBlog(newBlog).pipe(take(1)).subscribe();
        } else {
          this.blogService.saveBlog(newBlog).pipe(take(1)).subscribe();
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
        delete tempBlog["user"];
        if (this.mode === "create") {
          this.blogService.createBlog(tempBlog).pipe(take(1)).subscribe();
        } else {
          this.blogService.saveBlog(tempBlog).pipe(take(1)).subscribe();
        }
        this.router.navigate(["/drafts"]);
        this.toastService.showMessage({
          title: "Blog Drafted",
          description: "Blog has been saved as draft.",
          type: "success",
        });
        break;
      case "EDIT":
        const updatedBlog: Blog = {
          ...this.blogCopy,
          ...blog,
          timestamp: new Date(),
        };
        console.log(updatedBlog);
        delete updatedBlog["user"];
        this.blogService.saveBlog(updatedBlog).pipe(take(1)).subscribe();
        this.router.navigate(["/"]);
        this.toastService.showMessage({
          title: "Blog Updated",
          description: "Blog has been updated.",
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

  showHelpModal() {
    // @ts-ignore
    this.helpModal.modal("show");
  }

  showPreview() {
    this.isPreviewMode = true;
    this.blogPreview = of({
      content: this.form.get("content").value,
      title: this.form.get("title").value,
      imgContentUrl: this.form.get("imgContentUrl").value,
      timestamp: new Date(),
      user: this.authService.user as User,
    });
  }

  closePreview() {
    this.isPreviewMode = false;
    this.blogPreview = null;
  }
}
