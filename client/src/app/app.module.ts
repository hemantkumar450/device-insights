import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import {
  AuthGuard,
  MasterService, SharedComponentModule,
} from './components/shared';
import {
  ApiUrl,
  RouteService, PaginationService
} from './shared';

import { SlimScrollModule } from 'ng2-slimscroll';


import {
  LoginComponent, HeaderComponent, HomeComponent, TopNavbarComponent,
  AuthenticationService, httpFactory, LocalStorageService,
  CommonService, ForgotPasswordComponent, ResetPasswordComponent, LoaderService, ErrorService, LoaderComponent
} from './core';


import { DashboardModule } from './components/dashboard/dashboard.module';
import { LabModule } from './components/lab/lab.module';
import { UserModule } from './components/user/user.module';
import { QualityControlModule } from './components/quality-control/quality-control.module';
import { AnalyticsModule } from './components/analytics/analytics.module';
import { SmartLabModule } from './components/smart-lab/smart-lab.module';
import { SmartMaintenanceModule } from './components/smart-maintenance/smart-maintenance.module';
import { SensorTypeModule } from './components/sensor-type/sensor-type.module';
import { PBIReportsModule } from './components/pbi-reports/pbi-reports.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    TopNavbarComponent,
    HomeComponent,
    /*Loader*/
    LoaderComponent,
    /* reset password module */
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HttpModule,
    routing,
    SlimScrollModule,
    SharedComponentModule,
    DashboardModule,
    LabModule,
    UserModule,
    QualityControlModule,
    AnalyticsModule,
    SmartLabModule,
    SmartMaintenanceModule,
    SensorTypeModule,
    PBIReportsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  providers: [
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, ApiUrl, Router, LoaderService, ErrorService, LocalStorageService]
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthGuard,
    CommonService,
    AuthenticationService,
    ApiUrl,
    RouteService,
    LocalStorageService,
    MasterService,
    PaginationService,
    LoaderService,
    ErrorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
