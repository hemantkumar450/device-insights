import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';

import { SensorTypeComponent } from './sensor-type.component';


export const sensorTypeRoutes: Routes = [
  {
    path: ':moduleName/sensorType',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: SensorTypeComponent,
      }
    ]
  }
];

export const sensorTypeRouting: ModuleWithProviders = RouterModule.forChild(sensorTypeRoutes);
