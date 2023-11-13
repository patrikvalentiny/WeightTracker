import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RegisterAndLoginModule} from "./register-and-login/register-and-login.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthHttpInterceptor} from "./interceptors/auth-http-interceptor";
import {TokenService} from "./token.service";
import {provideHotToastConfig} from '@ngneat/hot-toast';
import {ErrorHttpInterceptor} from "./interceptors/error-http-interceptor";
import {HomeModule} from "./home/home.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RegisterAndLoginModule,
    HttpClientModule,
    HomeModule,
  ],
  providers: [TokenService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHttpInterceptor,
    multi: true
    },
    provideHotToastConfig(
      {position: 'bottom-center',
        theme: "snackbar"
      }),
    {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHttpInterceptor,
    multi: true
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
