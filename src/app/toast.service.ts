import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type ToastType = "info" | "error" | "success";

export interface ToastData {
  type: ToastType;
  title: string;
  description: string;
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastId: string;
  private get toast() {
    return $(`#${this.toastId}`);
  }

  private toastData: BehaviorSubject<ToastData> = new BehaviorSubject({
    title: "",
    description: "",
    type: "info",
  });
  get toastData$() {
    return this.toastData;
  }

  constructor() {}

  initialize(toastId: string) {
    this.toastId = toastId;
    // @ts-ignore
    this.toast.toast({});
  }

  showMessage(data: ToastData) {
    this.toastData.next(data);
    // @ts-ignore
    this.toast.toast("show");
  }
}
