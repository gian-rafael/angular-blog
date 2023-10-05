import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { take } from "rxjs/operators";

import { AuthService } from "../../auth.service";
import { ToastService } from "src/app/toast.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  invalidUserCredentials: boolean = false;
  submitting: boolean = false;

  form = this.fb.group({
    user: [{ value: "", disabled: this.submitting }, Validators.required],
    password: [{ value: "", disabled: this.submitting }, Validators.required],
    remember: [{ value: false, disabled: this.submitting }],
  });

  get invalidUserInput() {
    const control = this.form.get("user");
    return control.hasError("required") && control.touched;
  }

  get invalidPasswordInput() {
    const control = this.form.get("password");
    return control.hasError("required") && control.touched;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.invalidUserCredentials = false;
    this.submitting = true;
    this.form.disable();
    this.authService
      .login(this.form.value)
      .pipe(take(1))
      .subscribe((success) => {
        if (success) {
          this.router.navigate(["/"]);
        } else {
          this.invalidUserCredentials = true;
        }
        this.submitting = false;
        this.form.enable();
      });
  }

  toggleShowPassword(show: boolean) {
    this.showPassword = show;
  }
}
