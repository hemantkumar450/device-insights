import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';
import {
 SmartLabComponent,
 HumidityComponent,
 TemperatureComponent,
 ReportComponent,
 LocationComponent,
 SmartLabDeviceComponent,
 SmartLabDeviceEditComponent
} from './index';


export const smartLabRoutes: Routes = [
  {
    path: ':moduleName/smartLab',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: SmartLabComponent,
      },
      {
        path: 'humidity',
        component: HumidityComponent,
      },
      {
        path: 'temperature',
        component: TemperatureComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
      },
      {
        path: 'device',
        component: SmartLabDeviceComponent,
      },
      {
        path: 'device/:id/edit',
        component: SmartLabDeviceEditComponent,
      },
      {
        path: 'device/add',
        component: SmartLabDeviceEditComponent,
      }
    ]
  }
];

export const smartLabRouting: ModuleWithProviders = RouterModule.forChild(smartLabRoutes);
