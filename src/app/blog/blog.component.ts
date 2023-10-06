import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { ViewportService } from "../viewport.service";
import { Observable } from "rxjs";

interface NavRoute {
  name: string;
  path: string;
  icon: string;
}

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  breakpoint: Observable<string>;

  routes: NavRoute[] = [
    {
      name: "Home",
      path: "/home",
      icon: "house"
    },
    {
      name: "My Blogs",
      path: "/my-blogs",
      icon: "file"
    },
    {
      name: "Saved Drafts",
      path: "/drafts",
      icon: "scroll"
    },
  ]

  constructor(
    private authService: AuthService,
    private router: Router,
    private vp: ViewportService
  ) {}

  ngOnInit() {
    this.breakpoint = this.vp.breakpoint$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/auth"]);
  }
}
