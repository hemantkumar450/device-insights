import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';
import {
  PBIReportsComponent,
  PBIReportsEditComponent
} from './index';


export const pbiReportsRoutes: Routes = [
  {
    path: ':moduleName/pbiReports',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: PBIReportsComponent,
      }, {
        path: 'add',
        component: PBIReportsEditComponent,
      }, {
        path: ':labId/:moduleId/edit',
        component: PBIReportsEditComponent,
      }
    ]
  }
];

export const pbiReportsRouting: ModuleWithProviders = RouterModule.forChild(pbiReportsRoutes);
