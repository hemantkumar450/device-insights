import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { RouteService, PaginationService } from '../../../shared';
import { Paginator } from '../../../core/paginator/paginator';
import { Message } from 'primeng/primeng';
import { PaginationEnum } from '../../shared/enums';
import { LocalStorageService } from '../../../core/shared/services/index';

import {
    SmartMaintenanceService,
    SmartMaintenanceItem,
    SmartMaintenanceItemService
} from '../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { CustomDDO, MasterService } from '../../shared';

@Component({
    selector: 'app-smart-maintenance-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})

export class SmartMaintenanceReportComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild(Paginator) paginatorComponent: Paginator;
    pageSize: number = PaginationEnum.PageSize;
    totalRecords: number = 0;
    currentUser: any;
    reportArray: Array<any> = [];
    monthArray: Array<CustomDDO> = [];
    yearArray: Array<CustomDDO> = [];
    frequencies: Array<CustomDDO> = [];
    instruments: Array<CustomDDO> = [];
    instrumentId: number = 0;
    monthId: number = 0;
    yearId: number = 0;
    freqId: number = 0;
    errorMsg: Message[] = [];

    constructor(
        public paginationService: PaginationService,
        public route: ActivatedRoute,
        private loaderService: LoaderService,
        private masterService: MasterService,
        public confirmationService: ConfirmationService,
        private smartMaintenanceItemService: SmartMaintenanceItemService,
        private smartMaintenanceService: SmartMaintenanceService,
        private localStorageService: LocalStorageService) {
        this.paginationService.setDefaultPage();
        this.currentUser = this.localStorageService.getCurrentUser();
        this.getInstruments();
        this.getMonthDDO();
        this.getYearDDO();
        this.getFrequencies();
    }

    ngOnInit() {
    }

    getMonthDDO() {
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.masterService.getChecklistMonth(labId).then(result => {
            this.monthArray = result;
            if (this.monthArray.length > 0) {
                this.monthId = this.monthArray[0].value;
            }
        })
    }

    getYearDDO() {
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.masterService.getChecklistYear(labId).then(result => {
            this.yearArray = result;
            if (this.yearArray.length > 0) {
                this.yearId = this.yearArray[0].value;
            }
        })
    }

    getInstruments() {
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.masterService.getIMInstrumentDDO(labId).then(result => {
            if (result.length > 0) {
                this.instruments = result;
                this.instrumentId = this.instruments[0].value;
                this.getReport();
            }

        });
    }

    getFrequencies() {
        this.loaderService.show();
        this.masterService.getIMFrequencyDDO().then(result => {
            if (result.length > 0) {
                this.frequencies = result;
                this.freqId = this.frequencies[0].value;
            }
            this.loaderService.hide();
        });
    }

    getReport() {
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.smartMaintenanceService.getReport(this.paginationService.getParams(), labId).then(result => {
            this.reportArray = result.data.Data;
            this.totalRecords = result.data.TotalRecords;
            this.loaderService.hide();
        });
    }

    openPdf(report) {
        window.open(report.REPORT_URL);
    }


    reportGenerate() {
        let labId = this.currentUser.labIds[0];
        let monthName = this.masterService.getMonthName(this.monthId);
        let instrument: any = this.instruments.filter(i => i.value === this.instrumentId)[0];
        let frequency: any = this.frequencies.filter(i => i.value === this.freqId)[0];
        let obj = {
            LAB_ID: this.currentUser.labIds[0],
            INSTR_ID: this.instrumentId,
            INSTR_NAME: instrument.label,
            FREQ_ID: this.freqId,
            FREQ_NAME: frequency.label,
            MONTH: this.monthId,
            MONTH_NAME: monthName,
            YEAR: this.yearId
        }
        this.loaderService.show();
        this.smartMaintenanceService.generateReport(obj).then(checklist => {
            this.errorMsg.push({ severity: 'success', summary: 'Warn Message', detail: 'report generated successfully' });
            this.getReport();
        });
    }

    pageChanged(event) {
        this.paginationService.setPageChange(event);
        this.getReport();
    }

    /* call to sorting the grid data */
    onSorting(event) {
        this.paginationService.setSortExpression(event);
        this.getReport();
    }

    /* call to filter the grid data */
    onFiltering(event) {
        this.dataTableComponent.reset();
        this.paginatorComponent.first = 0;
        this.paginationService.setFilterValues(event.filters);
        this.getReport();
    }

}
