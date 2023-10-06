import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { ViewportService } from "../viewport.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  breakpoint: Observable<string>;

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
