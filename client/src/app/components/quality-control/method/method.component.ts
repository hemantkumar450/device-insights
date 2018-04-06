
import { Component, OnInit, ViewChild } from '@angular/core';
import { QualityControlService, QualityControlMethod } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { SmartLabSensorType } from '../../shared/enums/base.enum';
import { DefaultRole } from '../../../components/shared/enums/index';
import { LocalStorageService } from '../../../core/shared/services/index';

@Component({
  selector: 'app-quality-control-method',
  templateUrl: './method.component.html',
})

export class QualityControlMethodComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public methods: Array<QualityControlMethod> = new Array<QualityControlMethod>();
  public methodArray: Array<QualityControlMethod> = new Array<QualityControlMethod>();
  public method = new QualityControlMethod();
  instruments: Array<CustomDDO> = [];
  instrumentId: number = 0;
  isAdd: boolean = false;
  isAdmin: boolean = false;
  currentUser: any;
  loggedUser: any;

  public errorMsg: Message[] = [];

  constructor(
    public paginationService: PaginationService,
    private routeService: RouteService,
    private loaderService: LoaderService,
    private masterService: MasterService,
    private localStorageService: LocalStorageService,
    public confirmationService: ConfirmationService,
    private qualityControlService: QualityControlService) {
    this.paginationService.setDefaultPage();
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getCurrentUser();
    this.loggedUser = this.localStorageService.getLoggedUser();
    if (this.currentUser.roleId !== DefaultRole.User) {
      if (this.loggedUser && this.loggedUser.roleId === DefaultRole.SuperUser) {
        this.isAdmin = false;
      } else {
        this.isAdmin = true;
      }
    }
    this.getQualityControlInstrumentDDO();
  }

  public getQualityControlInstrumentDDO() {
    this.loaderService.show();
    this.masterService.getQCInstrumentDDO().then(result => {
      if (result.length > 0) {
        this.instruments = result;
        this.instrumentId = result[0].value;
        this.getQualityControlMethods();
      } else {
        this.loaderService.hide();
      }
    });
  }

  public getQualityControlMethods() {
    this.isAdd = false;
    this.loaderService.show();
    this.qualityControlService.getQualityControlMethods(this.instrumentId, this.paginationService.getParams()).then(result => {
      this.methods = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.methods.forEach(element => {
        element.isEdit = false;
        return element;
      });
      this.methodArray = this.methods.map(x => Object.assign({}, x));
      this.loaderService.hide();
    });
  }


  public addMethod() {
    let isEdit = this.checkEditCase();
    if (isEdit) {
      this.isAdd = true;
    }
  }

  private editMethod(method): void {
    this.isAdd = false;
    method.isEdit = this.checkEditCase();
  }

  checkEditCase() {
    let count = 0;
    let isEdit = false;
    this.methods.forEach(location => {
      if (location.isEdit) {
        count++;
      }
    });
    if (count > 0) {
      isEdit = false;
      this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'First save previous edit' });
    } else {
      isEdit = true;
    }
    return isEdit;
  }

  public saveQualityControlMethod(method: QualityControlMethod) {
    if (method.METHOD_NAME.trim() === '') {
      this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert method name' });
      return;
    }
    method.INSTRUMENT_ID = this.instrumentId;
    method.METHOD_NAME = method.METHOD_NAME.trim();
    this.loaderService.show();
    this.qualityControlService.saveQualityControlMethod(method).then(result => {
      this.isAdd = false;
      this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record added successfully' });
      this.getQualityControlMethods();
    })
  }

  private deleteMethod(method: QualityControlMethod) {
    this.isAdd = false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete - ' + method.METHOD_NAME + ' ?',
      icon: 'fa fa-trash',
      accept: () => {
        this.loaderService.show();
        this.qualityControlService.deleteQCMethodById(method.METHOD_ID).then(result => {
          this.getQualityControlMethods();
          this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
        })
      }
    });
  }

  cancel() {
    this.isAdd = false;
  }

  cancelMethod(method) {
    this.methods = this.methodArray.map(x => Object.assign({}, x));
    method.isEdit = false
  }

  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getQualityControlMethods();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getQualityControlMethods();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getQualityControlMethods();
  }

}