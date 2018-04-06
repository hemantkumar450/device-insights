import { DefaultRole } from '../shared/enums/index';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../core/paginator/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService, PaginationService } from '../../shared';
import { PaginationEnum, DefaultModule } from '../shared/enums';
import { DashboardModel } from './shared/dashboard.model';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from '../../core/shared/services/index';
import { DashboardService, Module } from './shared';
import { CommonService } from '../../core/shared/services/common.service';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from '../../core/loader/loader.service';


@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  private dashboard: DashboardModel = new DashboardModel();
  private toDate: string = '';
  private fromDate: string = '';
  private datePipe = new DatePipe('en-US');
  private currentUser: any;
  private loggedUser: any;
  public modules: Array<Module> = [];
  private subscription: Subscription;
  public QCModule: number = DefaultModule.QualityControl;
  public AModule: number = DefaultModule.Analytics;
  public SMModule: number = DefaultModule.SmartLabMonitoring;
  public IMModule: number = DefaultModule.SmartMaintenance;

  private rangeDetail: any;
  constructor(
    public routeService: RouteService,
    public dashboardService: DashboardService,
    private commonService: CommonService,
    private loaderService: LoaderService,
    private router: Router,
    private localStorageService: LocalStorageService) {
    this.currentUser = this.localStorageService.getCurrentUser();
    this.loggedUser = this.localStorageService.getLoggedUser();
    this.getModule();
    console.log(this.QCModule);
    let userRole = this.localStorageService.checkUserRole();
    if (this.loggedUser) {
      if (this.loggedUser.roleId === DefaultRole.SuperAdmin) {
        this.localStorageService.setModuleName('SuperLabAdmin');
      } else if (this.loggedUser.roleId === DefaultRole.SuperUser) {
        this.localStorageService.setModuleName('SuperLabUser');
      } else if (this.loggedUser.roleId !== DefaultRole.User) {
        this.localStorageService.setModuleName('LabAdmin');
      }

    } else {
      this.localStorageService.setModuleName(userRole);
    }

  }

  ngOnInit() {

    this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'onSelected') {
        if (res.value === 'dashboard') {

          this.currentUser = this.localStorageService.getCurrentUser();
          this.getModule();
        }
      }
    });
  }

  getModule() {
    this.loaderService.show();
    let moduleIds = this.currentUser.moduleIds;
    this.dashboardService.getModule(moduleIds).then(res => {
      this.modules = res.data;
      this.loaderService.hide();
    })
  }

  private routePage(selectedItem) {
    let moduleName = '';


    switch (selectedItem) {
      case 1:
        this.qualityControlConfiguration();
        break;
      case 2:
        this.smartLabConfiguration();
        break;
      case 3:
        this.smartMaintenanceConfiguration();
        break;
      case 4:
        this.routeService.openRoute('analytics');
        break;
    }
  }

  private qualityControlConfiguration() {
    let moduleName = '';
    if (this.currentUser.roleId !== DefaultRole.User) {
      moduleName = 'qualityControlAdmin';
    } else {
      moduleName = 'qualityControlUser';
    }
    this.localStorageService.setTopMenu('qualityControl');
    this.localStorageService.setModuleName(moduleName);
    this.routeService.openRoute('qualityControl');
  }


  private smartLabConfiguration() {
    let moduleName = '';
    if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
      moduleName = 'smartLabSuperAdmin';
    } else {
      moduleName = 'smartLabAdmin';
    }
    this.localStorageService.setTopMenu('smartLab');
    this.localStorageService.setModuleName(moduleName);
    this.routeService.openRoute('smartLab');
  }

  private smartMaintenanceConfiguration() {
    let moduleName = '';
    if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
      moduleName = 'smartMaintenanceAdmin';
    } else {
      moduleName = 'smartMaintenanceUser';
    }
    this.localStorageService.setTopMenu('smartMaintenance');
    this.localStorageService.setModuleName(moduleName);
    this.routeService.openRoute('smartMaintenance/report');
  }
}
