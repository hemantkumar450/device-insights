
import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceModel, SmartLabDeviceService } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { LoaderService } from '../../../core/loader/loader.service';
import { DefaultRole } from '../../shared/enums/index';
import { LocalStorageService } from '../../../core/shared/services/index';


@Component({
  selector: 'app-smart-lab-device',
  templateUrl: './device.component.html',
})

export class SmartLabDeviceComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public devices: Array<DeviceModel> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public errorMessage: Array<Message> = [];
  isAppAdmin: boolean = false;
  isLabAdmin: boolean = false;
  public currentUser: any;


  constructor(private smartLabDeviceService: SmartLabDeviceService,
    public routeService: RouteService,
    public confirmationService: ConfirmationService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    public paginationService: PaginationService) {
    this.paginationService.setDefaultPage();
    this.getDevices();
    this.currentUser = this.localStorageService.getCurrentUser();
    if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
      this.isAppAdmin = true;
    }
    if (this.currentUser.roleId === DefaultRole.LabAdmin || this.currentUser.roleId === DefaultRole.SuperAdmin) {
      this.isLabAdmin = true;
    }
  }

  ngOnInit() {
  }

  getDevices() {
    this.loaderService.show();
    this.smartLabDeviceService.getDevices(this.paginationService.getParams()).then(result => {
      this.devices = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.loaderService.hide();
    })
  }

  addDevice() {
    this.routeService.openRoute('smartLab/device/add');
  }

  editDevice(id) {
    this.routeService.openRoute('smartLab/device/' + id + '/edit');
  }

  deleteDeviceById(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this row?',
      accept: () => {
        this.loaderService.show();
        this.smartLabDeviceService.deleteDeviceById(id).then(result => {
          this.getDevices();
        })
      },
      reject: () => {
      }
    });

  }

  /* call to page change of the grid */
  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getDevices();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getDevices();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getDevices();
  }
}
