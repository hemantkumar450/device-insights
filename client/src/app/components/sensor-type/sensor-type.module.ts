import { NgModule } from '@angular/core';
import { sensorTypeRouting } from './sensor-type.routing';
import { SharedComponentModule } from '../shared/shared-component.module';



import { SensorTypeService } from './index';

import { SensorTypeComponent } from './sensor-type.component';

@NgModule({
  imports: [
    sensorTypeRouting,
    SharedComponentModule
  ],
  declarations: [
    SensorTypeComponent,
  ],
  providers: [
    SensorTypeService
  ]
})

export class SensorTypeModule { }
