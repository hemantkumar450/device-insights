import { NgModule } from '@angular/core';
import { smartMaintenanceRouting } from './smart-maintenance.routing';
import { SharedComponentModule } from '../shared/shared-component.module';


import {
  SmartMaintenanceComponent,
  SmartMaintenanceService,
  SmartMaintenanceItemService,
  SmartMaintenanceItemMappingService,
  SmartMaintenanceLeftNavbarComponent,
  SmartMaintenanceItemComponent,
  SmartMaintenanceItemMappingComponent,
  SmartMaintenanceMasterInstrumentComponent,
  SmartMaintenanceFrequencyService,
  SmartMaintenanceFrequencyComponent,
  SmartMaintenanceDynamicFrequencyComponent,
  SmartMaintenanceReportComponent
} from './index';



@NgModule({
  imports: [
    SharedComponentModule,
    smartMaintenanceRouting
  ],
  declarations: [
    SmartMaintenanceComponent,
    SmartMaintenanceLeftNavbarComponent,
    SmartMaintenanceItemComponent,
    SmartMaintenanceItemMappingComponent,
    SmartMaintenanceMasterInstrumentComponent,
    SmartMaintenanceFrequencyComponent,
    SmartMaintenanceDynamicFrequencyComponent,
    SmartMaintenanceReportComponent
  ],
  providers: [
    SmartMaintenanceService,
    SmartMaintenanceItemService,
    SmartMaintenanceFrequencyService,
    SmartMaintenanceItemMappingService
  ]
})

export class SmartMaintenanceModule { }
