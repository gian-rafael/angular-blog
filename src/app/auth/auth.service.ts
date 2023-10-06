import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, from, iif, of } from "rxjs";
import { switchMap, catchError, take } from "rxjs/operators";

import { LoginPayload } from "./models/login";
import { User } from "../models/user";
import { USER_API } from "../api/api.module";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: Pick<User, "username" | "email" | "role" | "id">;

  get isLoggedIn() {
    return !!this.user;
  }

  get isLoggedIn$() {
    return of(!!this.user);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(USER_API) private API_ENDPOINT: string
  ) {
    const session = localStorage.getItem("user");
    if (session) {
      this.user = JSON.parse(session);
    }
  }

  login({
    user: username,
    password,
    remember,
  }: LoginPayload): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.API_ENDPOINT}?username=${username}`, {
        observe: "response",
      })
      .pipe(
        catchError(() => {
          return of(false);
        }),
        switchMap((response: HttpResponse<User[]>) =>
          iif(
            () => response.body.length === 0,
            of(false),
            from(response.body).pipe(
              take(1),
              switchMap((user) => {
                if (user.password === password) {
                  this.user = user;

                  if (remember) {
                    this.persistToLocalStorage(user);
                  }
                  return of(true);
                }
                return of(false);
              })
            )
          )
        )
      );
  }

  logout() {
    this.user = null;
    localStorage.removeItem("user");
    this.router.navigate(["/"]);
  }

  register(user: Partial<User>) {
    return this.http.post(this.API_ENDPOINT, user);
  }

  private persistToLocalStorage(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  userExists(username: string) {
    return this.http
      .get(`${this.API_ENDPOINT}?username=${username}`)
      .pipe(switchMap((users: User[]) => of(users.length > 0)));
  }

  checkEmail(email: string) {
    return this.http
      .get(`${this.API_ENDPOINT}?email=${email}`)
      .pipe(switchMap((users: User[]) => of(users.length > 0)));
  }
}
