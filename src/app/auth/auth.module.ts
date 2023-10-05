import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./containers/login/login.component";
import { ApiModule } from "../api/api.module";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ApiModule],
  declarations: [LoginComponent],
})
export class AuthModule {}
