
import { Component, OnInit, ViewChild } from '@angular/core';
import { LabModel, LabService } from './shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../shared';
import { PaginationEnum } from '../shared/enums';
import { Message } from 'primeng/primeng';
import { LoaderService } from '../../core/loader/loader.service';
import { LocalStorageService, AuthenticationService, CommonService, } from '../../core/shared/services/index';
import { ActivatedRoute } from '@angular/router';
import { DefaultRole } from '../shared/enums/index';
import { TruncatePipe } from '../shared';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})

export class LabComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public labs: Array<LabModel> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public errorMessage: Array<Message> = [];
  currentUser: any;
  loggedUser: any;
  isSuperAdmin: boolean = false;


  constructor(private labService: LabService,
    public routeService: RouteService,
    private location: Location,
    public confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    public route: ActivatedRoute,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    public paginationService: PaginationService) {
    this.paginationService.setDefaultPage();
    let isSuccess = this.route.snapshot.paramMap.get('successMessage');
    if (isSuccess) {
      this.messageAlter();
      this.location.replaceState('ApplicationAdmin/lab');
    }
    this.loggedUser = this.localStorageService.getLoggedUser();
    if (this.loggedUser) {
      this.roleChangeEvent();
    } else {
      this.setCurrentUser();
      this.getLabs();
    }

  }

  ngOnInit() {
  }

  setCurrentUser() {
    this.currentUser = this.localStorageService.getCurrentUser();
    if (this.currentUser.roleId === DefaultRole.SuperUser) {
      this.isSuperAdmin = true;
    } else if (this.currentUser.roleId === DefaultRole.SuperAdmin) {
      this.isSuperAdmin = true;
    }
  }

  getLabs() {
    this.loaderService.show();
    this.labService.getLabs(this.paginationService.getParams()).then(result => {
      this.labs = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.loaderService.hide();
    })
  }

  addLab() {
    this.routeService.openRoute('lab/add');
  }

  editLab(labId) {
    this.routeService.openRoute('lab/' + labId + '/edit');
  }

  activateLabById(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to activate this row?',
      accept: () => {
        this.labService.activateLabById(id).then(result => {
          this.getLabs();
        })
      },
      reject: () => {
      }
    });
  }

  deleteLabById(lab: LabModel) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to deactivate ' + lab.LAB_NAME + ' ?',
      accept: () => {
        this.loaderService.show();
        this.labService.deleteLabById(lab.LAB_ID).then(result => {
          this.errorMessage.push({ severity: 'success', summary: '', detail: 'Record deactivated successfully' });
          this.getLabs();
        })
      },
      reject: () => {
      }
    });
  }


  adminSignIn(lab: LabModel) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to switch into ' + lab.LAB_NAME + ' ?',
      accept: () => {
        this.loaderService.show();
        this.authenticationService.changeLab(lab.LAB_ID).then(result => {
          if (this.localStorageService.getLoggedUser() === null) {
            this.localStorageService.setLoggedUser();
          }

          let obj = this.localStorageService.getModuleName();
          this.localStorageService.setCurrentUser(result.data);
          this.localStorageService.setTopMenu('dashboard');

          if (this.currentUser.roleId === DefaultRole.SuperAdmin) {
            this.localStorageService.setModuleName('SuperLabAdmin');
            this.commonService.notifyOther({ option: 'onSelected', value: 6 });
          } else if (this.currentUser.roleId === DefaultRole.SuperUser) {
            this.localStorageService.setModuleName('SuperLabUser');
            this.commonService.notifyOther({ option: 'onSelected', value: 7 });
          }

          let domainName = 'dashboard';
          this.commonService.notifyOther({ option: 'onLogoChange', value: lab.LAB_ID });
          if (domainName === 'dashboard') {
            this.commonService.notifyOther({ option: 'onSelected', value: 'dashboard' });
          }
        });
      },
      reject: () => {
      }
    });
  }


  roleChangeEvent() {
    let admin = this.localStorageService.getLoggedUser();
    this.localStorageService.setCurrentUser(admin);
    this.localStorageService.removeLoggedUser();
    localStorage.removeItem('labLogo');
    localStorage.removeItem('QCDashboard');
    this.setCurrentUser();
    this.getLabs();
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
    this.getLabs();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getLabs();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getLabs();
  }
}
