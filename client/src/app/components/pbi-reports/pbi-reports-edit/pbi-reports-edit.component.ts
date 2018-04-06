import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from './../../../shared';
import { PBIReportModel, PBIReportsService } from '../shared';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from './../../shared';
import { DefaultRole } from '../../shared/enums';
import { LoaderService } from '../../../core/loader/loader.service';

@Component({
    selector: 'app-pbi-reports-edit',
    templateUrl: './pbi-reports-edit.component.html',
    styleUrls: ['./pbi-reports-edit.component.css']
})

export class PBIReportsEditComponent implements OnInit {
    public errorMsg: Message[] = [];
    public pbiReport: PBIReportModel = new PBIReportModel();
    public modules: Array<CustomDDO> = [];
    public labs: Array<CustomDDO> = [];

    constructor(
        private pbiReportsService: PBIReportsService,
        private routeService: RouteService,
        private router: Router,
        private masterService: MasterService,
        private loaderService: LoaderService,
        public route: ActivatedRoute) {
    }

    ngOnInit() {
        this.getDefaultParams();

        this.getLabDDO();
    }

    getDefaultParams() {
        this.pbiReport.LAB_ID = +this.route.snapshot.params['labId'] || 0;
        this.pbiReport.MODULE_ID = +this.route.snapshot.params['moduleId'] || 0;
        if (this.pbiReport.MODULE_ID > 0) {
            this.pbiReport.IS_EDIT = true;
            this.getLabById();
        }
    }

    getLabDDO() {
        this.loaderService.show();
        this.masterService.getLabDDO().then((res) => {
            this.labs = res;
            this.getModuleDDO();
        });
    }

    getModuleDDO() {
        this.loaderService.show();
        this.masterService.getModuleDDO().then((res) => {
            this.modules = res;
            this.loaderService.hide();
        });
    }

    private getLabById() {
        this.loaderService.show();
        this.pbiReportsService.getPBIReportsById(this.pbiReport.LAB_ID, this.pbiReport.MODULE_ID).then((result) => {
            this.pbiReport = result.data;
            this.pbiReport.IS_EDIT = true;
            this.loaderService.hide();
        });
    }

    public save(isValid) {
        if (this.pbiReport.GROUP_ID === '' || this.pbiReport.REPORT_ID === ''
            || this.pbiReport.LAB_ID === 0 || this.pbiReport.MODULE_ID === 0
            || this.pbiReport.VIEW_NAME === '') {
            this.errorMsg.push({
                severity: 'error',
                summary: 'Success Message', detail: 'All fields are required.'
            });
            return;
        }
        this.loaderService.show();
        this.pbiReportsService.savePBIReports(this.pbiReport).then((res) => {
            this.errorMsg.push({
                severity: 'success',
                summary: 'Success Message', detail: 'Save Successfully'
            });
            this.router.navigate(['ApplicationAdmin/pbiReports', { successMessage: true }]);
        });
    }

    public cancel(): void {
        this.routeService.openRoute('pbiReports');
    }
}
