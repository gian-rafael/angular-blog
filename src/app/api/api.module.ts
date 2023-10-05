import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const API_BASE = "http://localhost:3000";
export const USER_API = new InjectionToken<string>("user_api");
export const BLOG_API = new InjectionToken<string>("blog_api");

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: USER_API,
      useValue: `${API_BASE}/users`
    },
    {
      provide: BLOG_API,
      useValue: `${API_BASE}/blogs`
    },
  ],
  declarations: []
})
export class ApiModule { }
