
import { Component, OnInit, ViewChild } from '@angular/core';
import { QualityControlService, QualityControlReason } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { SmartLabSensorType } from '../../shared/enums/base.enum';
import { LocalStorageService } from '../../../core/shared/services/index';
import { DefaultRole } from '../../../components/shared/enums/index';

@Component({
  selector: 'app-quality-control-reason',
  templateUrl: './reason.component.html',
})

export class QualityControlReasonComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;
  pageSize: number = PaginationEnum.PageSize;
  totalRecords: number = 0;
  reasons: Array<QualityControlReason> = new Array<QualityControlReason>();
  reasonArray: Array<QualityControlReason> = new Array<QualityControlReason>();
  reason = new QualityControlReason();
  isAdd: boolean = false;
  errorMsg: Message[] = [];
  currentUser: any;
  isAdmin: boolean = false;
  loggedUser: any;

  constructor(
    public paginationService: PaginationService,
    private routeService: RouteService,
    private loaderService: LoaderService,
    private masterService: MasterService,
    public confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService,
    private qualityControlService: QualityControlService) {
    this.paginationService.setDefaultPage();
    this.currentUser = this.localStorageService.getCurrentUser();
    this.loggedUser = this.localStorageService.getLoggedUser();
    if (this.currentUser.roleId !== DefaultRole.User) {
      if (this.loggedUser && this.loggedUser.roleId === DefaultRole.SuperUser) {
        this.isAdmin = false;
      } else {
        this.isAdmin = true;
      }
    }
  }

  ngOnInit() {
    this.getQualityControlReasons();
  }

  public getQualityControlReasons() {
    this.loaderService.show();
    this.qualityControlService.getQualityControlReason(this.paginationService.getParams()).then(result => {
      this.reasons = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.reasons.forEach(element => {
        element.isEdit = false;
        return element;
      });
      this.reasonArray = this.reasons.map(x => Object.assign({}, x));
      this.loaderService.hide();
    });
  }


  public addReason() {
    let isEdit = this.checkEditCase();
    if (isEdit) {
      this.isAdd = true;
    }
  }

  private editReason(reason): void {
    this.isAdd = false;
    reason.isEdit = this.checkEditCase();
  }

  checkEditCase() {
    let count = 0;
    let isEdit = false;
    this.reasons.forEach(reason => {
      if (reason.isEdit) {
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

  public saveQualityControlReason(reason: QualityControlReason) {
    if (reason.REASON_NAME.trim() === '') {
      this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert reason name' });
      return;
    }
    if (!reason.REASON_CODE) {
      this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert reason code' });
      return;
    }
    reason.REASON_NAME = reason.REASON_NAME.trim();
    this.loaderService.show();
    this.qualityControlService.saveQualityControlReason(reason).then(result => {
      this.isAdd = false;
      this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record added successfully' });
      this.getQualityControlReasons();
    })
  }

  cancel() {
    this.isAdd = false;
  }

  cancelReason(reason) {
    this.reasons = this.reasonArray.map(x => Object.assign({}, x));
    reason.isEdit = false
  }

  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getQualityControlReasons();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getQualityControlReasons();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getQualityControlReasons();
  }

}