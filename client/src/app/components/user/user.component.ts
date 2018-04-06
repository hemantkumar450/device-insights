import { Component, OnInit, ViewChild } from '@angular/core';
import { UserModel, UserService } from './shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../shared';
import { PaginationEnum } from '../shared/enums';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../core/shared/services/index';
import { LabService } from './../lab/shared/lab.service';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../core/shared/services/common.service';
import { LoaderService } from '../../core/loader/loader.service';
import { Message } from 'primeng/primeng';
import { DefaultRole } from '../shared/enums/index';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',

})

export class UserComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;
  public users: Array<UserModel> = [];
  public totalRecords: number = 0;
  public currentUser: any;
  public pageSize: number = PaginationEnum.PageSize;
  public isAdminLogin: boolean = false;
  public errorMessage: Array<Message> = [];
  isGetUserByAppAdmin: boolean = false;

  constructor(private UserService: UserService,
    public routeService: RouteService,
    private location: Location,
    private loaderService: LoaderService,
    public confirmationService: ConfirmationService,
    private commonService: CommonService,
    public route: ActivatedRoute,
    public paginationService: PaginationService,
    private localStorageService: LocalStorageService,
    private labService: LabService) {
    this.paginationService.setDefaultPage();
    let isSuccess = this.route.snapshot.paramMap.get('successMessage');
    if (isSuccess) {
      this.messageAlter();
      this.location.replaceState('ApplicationAdmin/user');
    }
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getCurrentUser();
    if (this.localStorageService.getLoggedUser()) {
      if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
        this.isGetUserByAppAdmin = true;
      }
      this.isAdminLogin = false;
    } else {
      this.isAdminLogin = true;
    }
    if (this.currentUser.roleId === DefaultRole.SuperAdmin || this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
      this.isAdminLogin = true;
    }
    this.getUsers(true);
  }

  getUsers(isParamRefresh) {
    if (isParamRefresh) {
      let param: any = this.paginationService.getParams();
      param.Filter = [];
      this.paginationService.setDefaultPage();
    }
    this.loaderService.show();
    this.UserService.getUsers(this.paginationService.getParams(), this.isGetUserByAppAdmin).then(result => {
      this.users = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.loaderService.hide();
    })
  }

  addUser() {
    this.routeService.openRoute('user/add');
  }

  editUser(id) {
    this.routeService.openRoute('user/' + id + '/edit');
  }

  deleteUserById(user: UserModel) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + user.FIRST_NAME + ' ?',
      accept: () => {
        this.loaderService.show();
        this.UserService.deleteUserById(user.USER_ID).then(result => {
          this.errorMessage.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
          this.getUsers(true);
        })
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
    this.getUsers(false);
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getUsers(false);
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getUsers(false);
  }
}
