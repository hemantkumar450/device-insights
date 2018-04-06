import { NgModule } from '@angular/core';
import { analyticsRouting } from './analytics.routing';
import { SharedComponentModule } from '../shared/shared-component.module';


import {
  AnalyticsComponent,
  AnalyticsService
} from './index';


@NgModule({
  imports: [
    SharedComponentModule,
    analyticsRouting
  ],
  declarations: [
    AnalyticsComponent
  ],
  providers: [
    AnalyticsService
  ]
})

export class AnalyticsModule { }
