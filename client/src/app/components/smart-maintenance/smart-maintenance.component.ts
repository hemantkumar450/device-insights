
import { Component, OnInit, ViewChild } from '@angular/core';
import { SmartMaintenance, SmartMaintenanceService } from './shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../shared';
import { PaginationEnum } from '../shared/enums';
import { LoaderService } from '../../core/loader/loader.service';

@Component({
  selector: 'app-smart-maintenance',
  templateUrl: './smart-maintenance.component.html',
})

export class SmartMaintenanceComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public labs: Array<SmartMaintenance> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;

  constructor(private smartMaintenanceService: SmartMaintenanceService,
    public routeService: RouteService,
    public confirmationService: ConfirmationService,
    private loaderService: LoaderService,
    public paginationService: PaginationService) {
    this.paginationService.setDefaultPage();
    // this.getAnalytics();
  }

  ngOnInit() {
  }

  getInstrumentManagement() {
    this.loaderService.show();
    // this.smartMaintenanceService.getLabs(this.paginationService.getParams()).then(result => {
    //   this.labs = result.data;
    //   this.totalRecords = this.labs.length;
    //   this.loaderService.hide();
    // })
  }

  addInstrumentManagement() {
    this.routeService.openRoute('lab/add');
  }

  editInstrumentManagement(labId) {
    this.routeService.openRoute('lab/' + labId + '/edit');
  }

  deleteInstrumentManagementById(id) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want to delete this row?',
    //   accept: () => {
    //     this.labService.deleteLabById(id).then(result => {
    //       this.getInstrumentManagement();
    // this.loaderService.hide();
    //     })
    //   },
    //   reject: () => {
    //   }
    // });
  }

  /* call to page change of the grid */
  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getInstrumentManagement();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getInstrumentManagement();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getInstrumentManagement();
  }
}
