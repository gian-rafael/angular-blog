import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { BlogContainerComponent } from "./containers/blog-container/blog-container.component";
import { BlogItemComponent } from "./components/blog-item/blog-item.component";
import { BlogListResolve } from "./resolves/blog-list.resolve";
import { ApiModule } from "../api/api.module";
import { RouterModule, Routes } from "@angular/router";
import { BlogViewerComponent } from "./components/blog-viewer/blog-viewer.component";
import { BlogResolve } from "./resolves/blog.resolve";
import { BlogComponent } from "./blog.component";
import { CreateBlogContainerComponent } from "./containers/create-blog-container/create-blog-container.component";
import { ReactiveFormsModule } from "@angular/forms";
import { BlogCrumbsComponent } from "./components/blog-crumbs/blog-crumbs.component";
import { BlogDraftsContainerComponent } from "./containers/blog-drafts-container/blog-drafts-container.component";
import { BlogDraftsResolve } from "./resolves/blog-drafts.resolve";
import { BlogGuard } from "./guards/blog.guard";
import { BlogDraftResolve } from "./resolves/blog-draft.resolve";
import { CreateBlogGuard } from "./containers/create-blog-container/create-blog.guard";
import { MyBlogsContainerComponent } from "./containers/my-blogs-container/my-blogs-container.component";
import { MyBlogsResolve } from "./resolves/my-blogs.resolve";
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { BlogContentHelpComponent } from './components/blog-content-help/blog-content-help.component';

const routes: Routes = [
  {
    path: "",
    component: BlogComponent,
    runGuardsAndResolvers: "always",
    canActivateChild: [BlogGuard],
    children: [
      {
        path: "",
        redirectTo: "/home",
        pathMatch: "full",
      },
      {
        path: "home",
        component: BlogContainerComponent,
        resolve: {
          blogs: BlogListResolve,
        },
      },
      {
        path: "my-blogs",
        component: MyBlogsContainerComponent,
        resolve: {
          blogs: MyBlogsResolve,
        },
      },
      {
        path: "blog/edit/:id",
        component: CreateBlogContainerComponent,
        canDeactivate: [CreateBlogGuard],
        resolve: {
          blog: BlogDraftResolve,
        },
      },
      {
        path: "drafts",
        component: BlogDraftsContainerComponent,
        resolve: {
          blogs: BlogDraftsResolve,
        },
      },
      {
        path: "drafts/edit/:id",
        component: CreateBlogContainerComponent,
        canDeactivate: [CreateBlogGuard],
        resolve: {
          draft: BlogDraftResolve,
        },
      },
      {
        path: "blog/new",
        component: CreateBlogContainerComponent,
        canDeactivate: [CreateBlogGuard],
      },
      {
        path: "blog/:id",
        component: BlogViewerComponent,
        resolve: {
          blog: BlogResolve,
        },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ApiModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  declarations: [
    BlogContainerComponent,
    BlogItemComponent,
    BlogViewerComponent,
    BlogComponent,
    CreateBlogContainerComponent,
    BlogCrumbsComponent,
    BlogDraftsContainerComponent,
    MyBlogsContainerComponent,
    DeleteConfirmationComponent,
    BlogContentHelpComponent,
  ],
  exports: [BlogContainerComponent],
  providers: [
    BlogListResolve,
    BlogResolve,
    BlogDraftsResolve,
    BlogDraftResolve,
    MyBlogsResolve,
    BlogGuard,
    CreateBlogGuard,
  ],
})
export class BlogModule {}
