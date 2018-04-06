import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';
import {
  LabComponent,
  LabEditComponent
} from './index';


export const labRoutes: Routes = [
  {
    path: ':moduleName/lab',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: LabComponent,
      }, {
        path: 'add',
        component: LabEditComponent,
      }, {
        path: ':id/edit',
        component: LabEditComponent,
      }
    ]
  }
];

export const labRouting: ModuleWithProviders = RouterModule.forChild(labRoutes);
