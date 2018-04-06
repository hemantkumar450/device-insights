import { NgModule } from '@angular/core';
import { qualityControlRouting } from './quality-control.routing';
import { SharedComponentModule } from '../shared/shared-component.module';


import {
  QualityControlComponent,
  QualityControlService,
  QualityControlLeftNavbarComponent,
  AdjMeanSDComponent,
  MeanSDComponent,
  QulalityControlResultComponent,
  QualityControlCompoundComponent,
  QualityControlInstrumentComponent,
  QualityControlMethodComponent,
  QualityControlReasonComponent,
  QualityControlReviewComponent
} from './index';


@NgModule({
  imports: [
    SharedComponentModule,
    qualityControlRouting
  ],
  declarations: [
    QualityControlComponent,
    QualityControlLeftNavbarComponent,
    AdjMeanSDComponent,
    MeanSDComponent,
    QulalityControlResultComponent,
    QualityControlCompoundComponent,
    QualityControlInstrumentComponent,
    QualityControlMethodComponent,
    QualityControlReasonComponent,
    QualityControlReviewComponent
  ],
  providers: [
    QualityControlService
  ]
})

export class QualityControlModule { }
