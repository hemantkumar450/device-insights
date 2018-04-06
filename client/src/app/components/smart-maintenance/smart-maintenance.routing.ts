import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';

import {
  SmartMaintenanceComponent,
  SmartMaintenanceMasterInstrumentComponent,
  SmartMaintenanceItemComponent,
  SmartMaintenanceFrequencyComponent,
  SmartMaintenanceDynamicFrequencyComponent,
  SmartMaintenanceItemMappingComponent,
  SmartMaintenanceReportComponent
} from './index';


export const smartMaintenanceModuleRoutes: Routes = [
  {
    path: ':moduleName/smartMaintenance',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: SmartMaintenanceComponent,
      },
      {
        path: 'frequency',
        component: SmartMaintenanceFrequencyComponent,
      },
      {
        path: 'instrument',
        component: SmartMaintenanceMasterInstrumentComponent,
      },
      {
        path: 'item',
        component: SmartMaintenanceItemComponent,
      },
      {
        path: 'dynamicfrequency/:freqId',
        component: SmartMaintenanceDynamicFrequencyComponent
      },
      {
        path: 'itemMapping',
        component: SmartMaintenanceItemMappingComponent
      },
      {
        path: 'report',
        component: SmartMaintenanceReportComponent
      }

    ]
  }
];

export const smartMaintenanceRouting: ModuleWithProviders = RouterModule.forChild(smartMaintenanceModuleRoutes);
