
import { Component, OnInit, ViewChild } from '@angular/core';
import { QualityControlService, Results } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { LocalStorageService } from '../../../core/shared/services/index';
import { DefaultRole } from '../../../components/shared/enums/index';
import { TruncatePipe } from '../../../components/shared/pipe/truncate.pipe';

@Component({
  selector: 'qulaity-control-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})

export class QulalityControlResultComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public results: Array<Results> = [];
  public resultArray: Array<Results> = [];
  public pageSize: number = 50 // PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public errorMessage: Array<Message> = [];
  batches: Array<CustomDDO> = [];
  instruments: Array<CustomDDO> = [];
  yearArray: Array<CustomDDO> = [];
  monthArray: Array<CustomDDO> = [];
  compounds: Array<CustomDDO> = [];
  statusArray: Array<any> = [{ label: 'All', value: null }, { label: 'Pass', value: 'Pass' }, { label: 'Fail', value: 'Fail' }];
  dayArray: Array<any> = [];
  compoundId: number = 0;
  batchId: any = 0;
  instrumentId: number = 0;
  yearId: number = 0;
  monthId: number = 0;
  reasons: Array<CustomDDO> = [];
  reasonId: number = 0;
  dayId: number = 0;
  loggedUser: any
  currentUser: any;
  status: string = null;
  isReviewBatch: boolean = false;
  isAdmin: boolean = false;
  batchReviewed: boolean = false;
  comment: string = '';

  constructor(private qualityControlService: QualityControlService,
    public routeService: RouteService,
    private masterService: MasterService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    public confirmationService: ConfirmationService,
    public paginationService: PaginationService) {
    this.paginationService.setDefaultPage();

    if (this.localStorageService.getLoggedUser()) {
      this.loggedUser = this.localStorageService.getLoggedUser();
      this.isAdmin = true;
    }
    this.currentUser = this.localStorageService.getCurrentUser();

    if (this.currentUser.roleId === DefaultRole.LabAdmin) {
      this.isAdmin = true;
    }
    this.getDateArray();
    this.getInstruments();
  }

  ngOnInit() {

  }

  getDateArray() {
    this.dayArray = [];
    for (var index = 0; index <= 31; index++) {
      let obj: any = { label: index, value: index }
      if (index === 0) {
        obj = { label: 'All', value: 0 };
        this.dayArray.splice(this.dayArray.length, 0, obj);
      } else {
        this.dayArray.splice(this.dayArray.length, 0, obj);
      }
    }
  }

  getInstruments() {
    this.loaderService.show();
    let labId = this.currentUser.labIds[0];
    this.masterService.getInstruments(labId).then(result => {
      if (result.length > 0) {
        this.instruments = result;
        this.instrumentId = this.instruments[0].value;
      }
      this.getReasons();
    });
  }

  getReasons() {
    this.loaderService.show();
    this.masterService.getReasons().then((result) => {
      this.reasons = result;
      this.getMonthDDO();
    });
  }

  getMonthDDO() {
    this.loaderService.show();
    this.masterService.getMeanMonthDDO(this.currentUser.labIds[0]).then(result => {
      if (result.length !== 0) {
        this.monthArray = result;
        this.monthId = result[0].value;
      }
      this.getYearDDO();
    });
  }

  getYearDDO() {
    this.loaderService.show();
    this.masterService.getMeanYearDDO(this.currentUser.labIds[0], this.instrumentId).then(result => {
      if (result.length !== 0) {
        this.yearArray = result;
        this.yearId = result[0].value;
      }
      this.getCompoundDDO();
    });
  }

  getCompoundDDO() {
    this.loaderService.show();
    this.masterService.getQCCompoundDDO(this.instrumentId).then(result => {
      this.compounds = [];
      if (result.length !== 0) {
        this.compounds = result;
        let obj: any = { label: "All", value: 0 };
        this.compounds.splice(0, 0, obj);
        this.compoundId = result[0].value;
      }
      this.dayId = this.dayArray[0].value;
      this.getBatches(true);
    });
  }

  getBatches(isLoad) {
    this.loaderService.show();

    this.masterService.getbatchesDDO(this.monthId, this.yearId, this.dayId).then((result) => {
      if (result.length > 0) {
        this.batches = result;
        let obj: any = { label: "All", value: "All" };
        this.batches.splice(0, 0, obj);
        if (isLoad) {
          this.batchId = result[0].value;
        }
      } else {
        this.batchId = 0;
        this.batches = [];
      }
      this.paginationService.setDefaultPage();
      this.getResults();
    });
  }

  reviewBatchDialogEvent() {
    if (this.isReviewBatch) {
      this.isReviewBatch = false;
      this.comment = '';
    } else {
      this.isReviewBatch = true;
    }
  }

  reviewBatch() {

    let userId = this.currentUser.userId;
    if (this.loggedUser) {
      userId = this.loggedUser.userId
    }

    this.isReviewBatch = false;
    this.loaderService.show();
    this.qualityControlService.reviewBatch(this.instrumentId, this.batchId, userId, this.comment).then(response => {
      this.comment = '';
      this.getResults();
    })
  }

  getResults() {
    this.loaderService.show();
    this.results = [];
    this.qualityControlService.getResults(this.paginationService.getParams(),
      this.instrumentId, this.batchId, this.yearId, this.monthId, this.dayId, this.compoundId, this.status).then(response => {
        this.results = response.data.Data;
        this.results.forEach(element => {
          element.isEdit = false;
          element.LOW = Math.round(element.LOW);
          element.MID = Math.round(element.MID);
          element.HIGH = Math.round(element.HIGH);
          element.END = Math.round(element.END);
          return element;
        });
        this.totalRecords = response.data.TotalRecords;
        this.loaderService.hide();
        this.resultArray = this.results.map(x => Object.assign({}, x));
        this.checkBatchReview();
      })
  }

  checkBatchReview() {
    if (this.isAdmin) {
      this.batchReviewed = false;
    }
    if (this.results.length > 0 && this.results[0].USER_NAME) {
      this.batchReviewed = true;
    } else {
      this.batchReviewed = false;
    }
  }

  editResult(item: Results) {
    item.isEdit = false;
    item.isEdit = this.checkEditCase();
  }

  setBatchStatus() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to update of this ' + this.batchId + ' batch?',
      accept: () => {
        let obj = {
          LAB_ID: this.currentUser.labIds[0],
          INSTRUMENT_ID: this.instrumentId,
          COMP_ID: this.compoundId,
          MONTH: this.monthId,
          YEAR: this.yearId,
          BATCH_ID: this.batchId
        };
        this.loaderService.show();
        this.qualityControlService.updateBatchStatus(obj).then(response => {
          this.getResults();
        })
      },
      reject: () => {
      }
    });
  }

  checkEditCase() {
    let count = 0;
    let isEdit = false;
    this.results.forEach(item => {
      if (item.isEdit) {
        count++;
      }
    });
    if (count > 0) {
      isEdit = false;
      this.errorMessage.push({ severity: 'error', summary: 'Warn Message', detail: 'First save previous edit' });
    } else {
      isEdit = true;
    }
    return isEdit;
  }

  resetReason(item: Results) {
    item.REASON_ID = 0;
  }

  saveResult(item) {
    let obj = {
      LAB_ID: item.LAB_ID,
      INSTRUMENT_ID: item.INSTRUMENT_ID,
      BATCH_ID: item.BATCH_ID,
      COMP_ID: item.COMP_ID,
      REASON_ID: item.REASON_ID
    }
    this.loaderService.show();
    this.qualityControlService.saveQualityControlResultRow(obj).then(result => {
      this.getBatches(false);
    });
  }

  deleteBatch() {
    let batchName = '';
    this.batches.forEach(item => {
      if (item.value === this.batchId) {
        batchName = item.label;
      }
    });

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete BatchNo ' + batchName + ' ?',
      accept: () => {
        this.loaderService.show();
        this.qualityControlService.deleteBatch(this.batchId, this.yearId, this.monthId).then(result => {
          this.getBatches(false);
        })
      },
      reject: () => {
      }
    });
  }

  cancelResult(compound) {
    this.results = this.resultArray.map(x => Object.assign({}, x));
    compound.isEdit = false
  }

  /* call to page change of the grid */
  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getResults();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getResults();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getResults();
  }
}
