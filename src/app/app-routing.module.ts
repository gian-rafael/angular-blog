import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppGuard } from "./guards/app.guard";
import { LoginComponent } from "./auth/containers/login/login.component";
import { AuthGuard } from "./auth/guard/auth.guard";
import { DashboardGuard } from "./dashboard/dashboard.guard";
import { RegisterComponent } from "./auth/containers/register/register.component";

const routes: Routes = [
  {
    path: "auth",
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    runGuardsAndResolvers: "always",
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
      {
        path: "register",
        component: RegisterComponent,
      },
    ],
  },
  {
    path: "dashboard",
    canLoad: [DashboardGuard],
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((mod) => mod.DashboardModule),
  },
  {
    path: "",
    canLoad: [AppGuard],
    canActivate: [AppGuard],
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
