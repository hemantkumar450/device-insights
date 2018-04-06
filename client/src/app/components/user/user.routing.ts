import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';
import { UserComponent, UserEditComponent } from './index';

export const userRoutes: Routes = [
  {
    path: ':moduleName/user',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: UserComponent,
      },
      {
        path: 'all',
        component: UserComponent,
      },
      {
        path: 'add',
        component: UserEditComponent,
      },
      {
        path: ':id/edit',
        component: UserEditComponent,
      }
    ]
  }
];

export const userRouting: ModuleWithProviders = RouterModule.forChild(userRoutes);
