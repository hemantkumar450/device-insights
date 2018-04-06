import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { HomeComponent } from '../../core/home/home.component';
import {
  QualityControlComponent,
  AdjMeanSDComponent,
  MeanSDComponent,
  QulalityControlResultComponent,
  QualityControlCompoundComponent,
  QualityControlInstrumentComponent,
  QualityControlMethodComponent,
  QualityControlReasonComponent,
  QualityControlReviewComponent
} from './index';


export const qualityControlRoutes: Routes = [
  {
    path: ':moduleName/qualityControl',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      {
        path: '',
        component: QualityControlComponent,
      },
      {
        path: 'adjMeanSD',
        component: AdjMeanSDComponent
      },
      {
        path: 'result',
        component: QulalityControlResultComponent
      },
      {
        path: 'meanSD',
        component: MeanSDComponent
      },
      {
        path: 'compound',
        component: QualityControlCompoundComponent
      },
      {
        path: 'instrument',
        component: QualityControlInstrumentComponent
      },
      {
        path: 'method',
        component: QualityControlMethodComponent
      },
      {
        path: 'reason',
        component: QualityControlReasonComponent
      },
      {
        path: 'review',
        component: QualityControlReviewComponent
      }
      
    ]
  }
];

export const qualityControlRouting: ModuleWithProviders = RouterModule.forChild(qualityControlRoutes);
