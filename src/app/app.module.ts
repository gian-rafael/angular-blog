import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { ApiModule } from './api/api.module';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [AppComponent, ToastComponent],
  imports: [BrowserModule, AppRoutingModule, AuthModule, ApiModule],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
