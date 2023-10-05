import { Component } from "@angular/core";
import { ToastService } from "./toast.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  readonly toastId = "appToast";

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.initialize(this.toastId);
  }
}
