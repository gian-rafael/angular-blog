import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppGuard } from "./guards/app.guard";
import { LoginComponent } from "./auth/containers/login/login.component";
import { AuthGuard } from "./auth/guard/auth.guard";

const routes: Routes = [
  {
    path: "auth",
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "login",
      },
      {
        path: "login",
        component: LoginComponent,
      },
    ],
  },
  {
    path: "",
    canLoad: [AppGuard],
    loadChildren: () =>
      import("./blog/blog.module").then((mod) => mod.BlogModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
