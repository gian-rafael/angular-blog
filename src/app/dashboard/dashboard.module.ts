import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { DashboardPendingBlogsResolve } from "./resolves/dashboard-pending-blog.resolve";
import { DashboardContainerComponent } from './containers/dashboard-container/dashboard-container.component';
import { PendingBlogItemComponent } from './components/pending-blog-item/pending-blog-item.component';
import { BlogPreviewModalComponent } from './components/blog-preview-modal/blog-preview-modal.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "",
        component: DashboardContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [DashboardComponent, DashboardContainerComponent, PendingBlogItemComponent, BlogPreviewModalComponent],
  providers: [DashboardPendingBlogsResolve],
})
export class DashboardModule {}
