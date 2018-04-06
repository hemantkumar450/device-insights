
import { Component, OnInit, ViewChild } from '@angular/core';
import { PBIReportModel, PBIReportsService } from './shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../shared';
import { PaginationEnum } from '../shared/enums';
import { Message } from 'primeng/primeng';
import { LoaderService } from '../../core/loader/loader.service';
import { LocalStorageService, AuthenticationService, CommonService, } from '../../core/shared/services/index';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-pbi-reports',
    templateUrl: './pbi-reports.component.html',
    styleUrls: ['./pbi-reports.component.css']
})

export class PBIReportsComponent implements OnInit {

    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild(Paginator) paginatorComponent: Paginator;

    public PBIReports: Array<PBIReportModel> = [];
    public pageSize: number = PaginationEnum.PageSize;
    public totalRecords: number = 0;
    public errorMessage: Array<Message> = [];
    currentUser: any;
    loggedUser: any;
    isSuperAdmin: boolean = false;


    constructor(private pbiReportsService: PBIReportsService,
        public routeService: RouteService,
        public route: ActivatedRoute,
        private location: Location,
        public confirmationService: ConfirmationService,
        private authenticationService: AuthenticationService,
        private loaderService: LoaderService,
        private localStorageService: LocalStorageService,
        public paginationService: PaginationService) {
        this.paginationService.setDefaultPage();
        this.getpbiReports();
        let isSuccess = this.route.snapshot.paramMap.get('successMessage');
        if (isSuccess) {
            this.messageAlter();
            this.location.replaceState('ApplicationAdmin/pbiReports');
        }
    }

    ngOnInit() {
    }

    getpbiReports() {
        this.loaderService.show();
        this.pbiReportsService.getPBIReports(this.paginationService.getParams()).then(result => {
            this.PBIReports = result.data.Data;
            this.totalRecords = result.data.TotalRecords;
            this.loaderService.hide();
        })
    }

    addPBIReports() {
        this.routeService.openRoute('pbiReports/add');
    }

    editPBIReports(pbiReport: PBIReportModel) {
        this.routeService.openRoute('pbiReports/' + pbiReport.LAB_ID + '/' + pbiReport.MODULE_ID + '/edit');
    }


    deletePBIReportsById(pbiReport: PBIReportModel) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this row?',
            accept: () => {
                this.loaderService.show();
                this.pbiReportsService.deletePBIReportsById(pbiReport.LAB_ID, pbiReport.MODULE_ID).then(result => {
                    this.errorMessage.push({ severity: 'success', summary: '', detail: 'Record deactivated successfully' });
                    this.getpbiReports();
                });
            },
            reject: () => {
            }
        });
    }


    messageAlter() {
        this.errorMessage = [];
        this.errorMessage.push({
            severity: 'success',
            summary: 'Success Message', detail: 'Save Successfully'
        });
    }

    /* call to page change of the grid */
    pageChanged(event) {
        this.paginationService.setPageChange(event);
        this.getpbiReports();
    }

    /* call to sorting the grid data */
    onSorting(event) {
        this.paginationService.setSortExpression(event);
        this.getpbiReports();
    }

    /* call to filter the grid data */
    onFiltering(event) {
        this.dataTableComponent.reset();
        this.paginatorComponent.first = 0;
        this.paginationService.setFilterValues(event.filters);
        this.getpbiReports();
    }
}
