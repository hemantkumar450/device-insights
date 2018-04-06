import { NgModule } from '@angular/core';
import { smartLabRouting } from './smart-lab.routing';
import { SharedComponentModule } from '../shared/shared-component.module';


import {
  SmartLabComponent,
  SmartLabService,
  TemperatureComponent,
  HumidityComponent,
  ReportComponent,
  LocationComponent,
  SmartLabDeviceComponent,
  SmartLabDeviceEditComponent,
  SmartLabLocationService,
  SmartLabDeviceService
} from './index';


@NgModule({
  imports: [
    SharedComponentModule,
    smartLabRouting
  ],
  declarations: [
    SmartLabComponent,    
    TemperatureComponent,
    HumidityComponent,
    ReportComponent,
    LocationComponent,
    SmartLabDeviceEditComponent,
    SmartLabDeviceComponent
  ],
  providers: [
    SmartLabService,
    SmartLabLocationService,
    SmartLabDeviceService
  ]
})

export class SmartLabModule { }
