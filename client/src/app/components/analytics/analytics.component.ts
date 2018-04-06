
import { Component, OnInit, ViewChild } from '@angular/core';
import { AnalyticsModel, AnalyticsService } from './shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../shared';
import { PaginationEnum } from '../shared/enums';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
})

export class AnalyticsComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public labs: Array<AnalyticsModel> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;

  constructor(private analyticsService: AnalyticsService,
    public routeService: RouteService,
    public confirmationService: ConfirmationService,
    public paginationService: PaginationService) {
    this.paginationService.setDefaultPage();
  }

  ngOnInit() {
  }

  getAnalytics() {
  }

  addAnalytics() {
    this.routeService.openRoute('lab/add');
  }

  editAnalytics(labId) {
    this.routeService.openRoute('lab/' + labId + '/edit');
  }

  deleteAnalyticsById(id) {
  }

  /* call to page change of the grid */
  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getAnalytics();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getAnalytics();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getAnalytics();
  }
}
