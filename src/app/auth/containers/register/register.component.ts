import { Component } from "@angular/core";
import {
  Validators,
  FormBuilder,
  AbstractControl,
  FormGroup,
} from "@angular/forms";
import { Router } from "@angular/router";
import { switchMap, take } from "rxjs/operators";
import { ToastService } from "src/app/toast.service";
import { AuthService } from "../../auth.service";
import { of } from "rxjs";
import { User } from "src/app/models/user";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  invalidUserCredentials: boolean = false;
  submitting: boolean = false;

  form = this.fb.group({
    email: [
      { value: "", disabled: this.submitting },
      [Validators.required, Validators.email],
      this.checkEmail.bind(this),
    ],
    username: [
      { value: "", disabled: this.submitting },
      Validators.required,
      [this.checkUsername.bind(this)],
    ],
    displayName: ["", Validators.required],
    password: [{ value: "", disabled: this.submitting }, Validators.required],
    confirmPassword: [{ value: "", disabled: this.submitting }],
  });

  get requiredEmail() {
    const control = this.form.get("email");
    return control.hasError("required") && control.touched;
  }

  get invalidEmailFormat() {
    const control = this.form.get("email");
    return control.hasError("email") && control.touched;
  }

  get emailTaken() {
    const control = this.form.get("email");
    return control.hasError("emailTaken");
  }

  get requiredUsername() {
    const control = this.form.get("username");
    return control.hasError("required") && control.touched;
  }

  get takenUsername() {
    const control = this.form.get("username");
    return control.hasError("usernameTaken");
  }

  get requiredDisplayName() {
    const control = this.form.get("displayName");
    return control.hasError("required") && control.touched;
  }

  get invalidPasswordInput() {
    const control = this.form.get("password");
    return control.hasError("required") && control.touched;
  }

  get requiredConfirmPassword() {
    const control = this.form.get("confirmPassword");
    return control.hasError("required") && control.touched;
  }

  get passwordsDoNotMatch() {
    const control = this.form.get("confirmPassword");
    return control.hasError("passwordMismatch") && control.touched;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle("Register")
    this.form
      .get("confirmPassword")
      .setValidators([
        Validators.required,
        this.passwordMismatchValidator(this.form),
      ]);
    this.form.get("password").valueChanges.subscribe(() => {
      this.form.get("confirmPassword").updateValueAndValidity();
    });
  }

  onSubmit() {
    const { displayName, email, password, username } = this.form
      .value as Partial<User>;
    const user: Partial<User> = {
      displayName,
      email,
      password,
      username,
      role: "user",
    };
    this.submitting = true;
    this.form.disable();
    this.authService
      .register(user)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(["/auth"]);
        this.toastService.showMessage({
          title: "Register",
          description: "Registered Successfully",
          type: "success",
        });
        this.submitting = false;
        this.form.enable();
      });
  }

  toggleShowPassword(show: boolean) {
    this.showPassword = show;
  }

  toggleShowConfirmPassword(show: boolean) {
    this.showConfirmPassword = show;
  }

  checkEmail(control: AbstractControl) {
    return this.authService.checkEmail(control.value).pipe(
      switchMap((exists) => {
        if (exists) {
          return of({ emailTaken: true });
        }
        return of(null);
      })
    );
  }

  checkUsername(control: AbstractControl) {
    return this.authService.userExists(control.value).pipe(
      switchMap((exists) => {
        if (exists) {
          return of({ usernameTaken: true });
        }
        return of(null);
      })
    );
  }

  passwordMismatchValidator(form: FormGroup) {
    return () => {
      const password = form.get("password");
      const confirm = form.get("confirmPassword");

      if (password.value === confirm.value) {
        return null;
      }

      return { passwordMismatch: true };
    };
  }
}
