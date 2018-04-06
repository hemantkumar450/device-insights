import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';
import {
DashboardComponent
} from './index'

export const dashboardRoutes: Routes = [
  {
    path: ':moduleName/dashboard',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
         component: DashboardComponent
      }
    ]
  }
];

export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);
