
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportModel, SmartLabService } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { LocalStorageService } from '../../../core/shared/services/index';
import { Message } from 'primeng/primeng';
import { LoaderService } from '../../../core/loader/loader.service';

@Component({
  selector: 'app-smart-lab-report',
  templateUrl: './report.component.html',
})

export class ReportComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public reports: Array<ReportModel> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public errorMessage: Array<Message> = [];
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public currentYear: number = 0;
  public currentUser: any;

  constructor(private smartLabService: SmartLabService,
    public routeService: RouteService,
    public confirmationService: ConfirmationService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    public paginationService: PaginationService) {
    this.paginationService.setDefaultPage();
    this.startDate.setMonth(this.startDate.getMonth() - 1);
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getCurrentUser();
    var year = new Date();
    this.currentYear = year.getFullYear() + 10;
    this.getReports();
  }

  getReports() {
    this.loaderService.show();
    this.smartLabService.getSmartLabReports().then(result => {
      this.reports = result.data;
      if (this.reports.length > 0) {
        this.totalRecords = this.reports[0].COUNTNO;
      }
      this.loaderService.hide();
    });
  }

  generateReport() {
    this.loaderService.show();
    this.smartLabService.generateReport(this.startDate, this.endDate).then(result => {
      this.getReports();
    });
  }

  openPdf(report: ReportModel) {
    window.open(report.REPORT_LINK);
  }

  deleteSMPdf(report: ReportModel) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this row?',
      accept: () => {
        this.loaderService.show();
        this.smartLabService.deleteSMReportPdf(report.LAB_ID, report.REPORT_ID).then(result => {
          this.getReports();
        });
      },
      reject: () => {
      }
    });

  }


  /* call to page change of the grid */
  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getReports();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getReports();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getReports();
  }
}
