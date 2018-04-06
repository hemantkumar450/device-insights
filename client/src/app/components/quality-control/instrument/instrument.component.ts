
import { Component, OnInit, ViewChild } from '@angular/core';
import { QualityControlService, QualityControlInstrument } from '../shared';
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
  selector: 'app-quality-control-instrument',
  templateUrl: './instrument.component.html',
})

export class QualityControlInstrumentComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public instruments: Array<QualityControlInstrument> = new Array<QualityControlInstrument>();
  public instrumentArray: Array<QualityControlInstrument> = new Array<QualityControlInstrument>();
  public instrument = new QualityControlInstrument();
  isAdd: boolean = false;
  public errorMsg: Message[] = [];
  isAdmin: boolean = false;
  currentUser: any;
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
    this.getQualityControlInstruments();
  }

  public getQualityControlInstruments() {
    this.loaderService.show();
    this.qualityControlService.getQualityControlInstruments(this.paginationService.getParams()).then(result => {
      this.instruments = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.instruments.forEach(element => {
        element.isEdit = false;
        return element;
      });
      this.instrumentArray = this.instruments.map(x => Object.assign({}, x));
      this.loaderService.hide();
    });
  }


  public addInstrument() {
    let isEdit = this.checkEditCase();
    if (isEdit) {
      this.isAdd = true;
    }
  }

  private editInstrument(instrument): void {
    this.isAdd = false;
    instrument.isEdit = this.checkEditCase();
  }

  checkEditCase() {
    let count = 0;
    let isEdit = false;
    this.instruments.forEach(location => {
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

  public saveQualityControlInstrument(instrument: QualityControlInstrument) {
    if (instrument.INSTRUMENT_NAME.trim() === '') {
      this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert Instrument name' });
      return;
    }
    instrument.INSTRUMENT_NAME = instrument.INSTRUMENT_NAME.trim();
    this.loaderService.show();
    this.qualityControlService.saveQualityControlInstrument(instrument).then(result => {
      this.isAdd = false;
      this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record added successfully' });
      this.getQualityControlInstruments();
    })
  }

  private deleteInstrument(instrument: QualityControlInstrument) {
    this.isAdd = false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete - ' + instrument.INSTRUMENT_NAME + ' ?',
      icon: 'fa fa-trash',
      accept: () => {
        this.loaderService.show();
        this.qualityControlService.deleteQCInstrumentById(instrument.INSTRUMENT_ID).then(result => {
          this.getQualityControlInstruments();
          this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
        })
      }
    });
  }

  cancel() {
    this.isAdd = false;
  }

  cancelInstrument(instrument) {
    this.instruments = this.instrumentArray.map(x => Object.assign({}, x));
    instrument.isEdit = false
  }

  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getQualityControlInstruments();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getQualityControlInstruments();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getQualityControlInstruments();
  }

}