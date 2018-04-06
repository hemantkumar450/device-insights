import { NgModule } from '@angular/core';
import { labRouting } from './lab.routing';
import { SharedComponentModule } from '../shared/shared-component.module';


import {
  LabComponent,
  LabService,
  LabLeftNavbarComponent,
  LabEditComponent
} from './index';


@NgModule({
  imports: [
    SharedComponentModule,
    labRouting
  ],
  declarations: [
    LabComponent,
    LabLeftNavbarComponent,
    LabEditComponent
  ],
  providers: [
    LabService
  ]
})

export class LabModule { }
