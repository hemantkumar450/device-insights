import { NgModule } from '@angular/core';
import { pbiReportsRouting } from './pbi-reports.routing';
import { SharedComponentModule } from '../shared/shared-component.module';


import {
    PBIReportsLeftNavbarComponent,
    PBIReportsService,
    PBIReportsEditComponent,
    PBIReportsComponent
} from './index';


@NgModule({
    imports: [
        SharedComponentModule,
        pbiReportsRouting
    ],
    declarations: [
        PBIReportsComponent,
        PBIReportsLeftNavbarComponent,
        PBIReportsEditComponent
    ],
    providers: [
        PBIReportsService
    ]
})

export class PBIReportsModule { }
