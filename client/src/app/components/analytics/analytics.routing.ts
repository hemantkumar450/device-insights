import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';
import {
 AnalyticsComponent
} from './index';


export const AnalyticsRoutes: Routes = [
  {
    path: ':moduleName/analytics',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: AnalyticsComponent,
      }
    ]
  }
];

export const analyticsRouting: ModuleWithProviders = RouterModule.forChild(AnalyticsRoutes);
