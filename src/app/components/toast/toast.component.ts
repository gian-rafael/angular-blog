import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ToastData, ToastService } from "src/app/toast.service";

@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
})
export class ToastComponent implements OnInit {
  @Input() id: string;

  toastData$: Observable<ToastData>;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastData$ = this.toastService.toastData$;
  }
}
