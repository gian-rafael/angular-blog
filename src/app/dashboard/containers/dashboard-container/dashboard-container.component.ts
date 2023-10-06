import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { BlogService } from "src/app/blog/blog.service";
import { Blog } from "src/app/models/blog";
import { ToastService } from "src/app/toast.service";
import { ViewportService } from "src/app/viewport.service";

type DashboardTab = "pending" | "rejected";

@Component({
  selector: "app-dashboard-container",
  templateUrl: "./dashboard-container.component.html",
  styleUrls: ["./dashboard-container.component.scss"],
})
export class DashboardContainerComponent implements OnInit, AfterViewInit {
  blogs$: Observable<Blog[]>;
  breakpoint$: Observable<string>;

  readonly previewModalId = "previewModal";
  currentBlog: Blog = null;

  currentTab: DashboardTab = "pending";

  constructor(
    private blogService: BlogService,
    private vp: ViewportService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.blogs$ = this.blogService.fetchPendingBlogs();
    this.breakpoint$ = this.vp.breakpoint$;
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    $(`#${this.previewModalId}`).modal({
      backdrop: "static",
      keyboard: false,
      show: false,
    });
  }

  onSelect(blog: Blog) {
    this.currentBlog = { ...blog };
    // @ts-ignore
    $(`#${this.previewModalId}`).modal("show");
  }

  handleApprove(blog: Blog) {
    this.blogService.approveBlog(blog).pipe(take(1)).subscribe();
    this.closeModal();
    this.toastService.showMessage({
      type: "success",
      description: "Blog has been approved successfully.",
      title: "Approved",
    });
  }

  handleReject(blog: Blog) {
    this.blogService.rejectBlog(blog).pipe(take(1)).subscribe();
    this.closeModal();
    this.toastService.showMessage({
      type: "success",
      title: "Rejected",
      description: "Blog has been rejected successfully.",
    });
  }

  private closeModal() {
    // @ts-ignore
    $(`#${this.previewModalId}`).modal("hide");
    this.currentBlog = null;
  }

  setCurrentTab(value: DashboardTab) {
    this.currentTab = value;
    switch (value) {
      case "pending":
        this.blogs$ = this.blogService.fetchPendingBlogs();
        break;
      case "rejected":
        this.blogs$ = this.blogService.fetchRejectedBlogs();
        break;
    }
  }
}
