
import { Component, OnInit, ViewChild } from '@angular/core';
import { AdjMeanSD, QualityControlService } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { LocalStorageService } from '../../../core/shared/services/index';

@Component({
  selector: 'app-quality-control-adj-mean',
  templateUrl: './adj-mean-sd.component.html',
})

export class AdjMeanSDComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public adjMeanSD: Array<AdjMeanSD> = [];
  public adjMeanSDArray: Array<AdjMeanSD> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public errorMessage: Array<Message> = [];
  public compounds: Array<any> = [];
  instruments: Array<any> = [];
  public methods: Array<any> = [];
  public yearArray: Array<any> = [];
  public monthArray: Array<any> = [];
  editableMode: boolean = false;
  instrumentId: number = 0;
  compoundId: number = 0;
  methodId: number = 0;
  yearId: number = 0;
  monthId: number = 0;
  currentUser: any;

  constructor(private qualityControlService: QualityControlService,
    public routeService: RouteService,
    private masterService: MasterService,
    private loaderService: LoaderService,
    public confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService,
    public paginationService: PaginationService) {
    this.paginationService.setDefaultPage();
    this.currentUser = this.localStorageService.getCurrentUser();
    this.getInstruments();
  }

  ngOnInit() {
  }

  getInstruments() {
    this.loaderService.show();
    let labId = this.currentUser.labIds[0];
    this.masterService.getInstruments(labId).then(result => {
      if (result.length > 0) {
        this.instruments = result;
        this.instrumentId = this.instruments[0].value;
      }
      this.getCompounds();
    });
  }

  getCompounds() {
    let labId = this.currentUser.labIds[0];
    this.loaderService.show();
    this.masterService.getMeanSDCompoundDDOByInstrumentId(labId, this.instrumentId).then(result => {
      this.compounds = [];
      if (result.length > 0) {
        this.compounds = result;
        let obj = { label: "All", value: "All" };
        this.compounds.splice(0, 0, obj);
        this.compoundId = this.compounds[0].value;
      }
      this.getCompoundMethodDDO();
    });
  }

  private getCompoundMethodDDO() {
    this.loaderService.show();
    let labId = this.currentUser.labIds[0];
    this.masterService.getCompoundMethodDDOByinstrumentId(labId, this.instrumentId).then(result => {
      this.methods = [];
      if (result.length > 0) {
        this.methods = result;
        let obj = { label: "All", value: "All" };
        this.methods.splice(0, 0, obj);
        this.methodId = result[0].value;
      }
      this.getMonthDDO();
    });
  }

  getMonthDDO() {
    this.loaderService.show();
    this.masterService.getAdjMeanMonthDDO(this.currentUser.labIds[0]).then(result => {
      if (result.length > 0) {
        this.monthArray = result;
        this.monthId = result[0].value;
      }
      this.getYearDDO();
    });
  }

  getYearDDO() {
    this.loaderService.show();
    this.masterService.getAdjMeanYearDDO(this.currentUser.labIds[0]).then(result => {
      if (result.length > 0) {
        this.yearArray = result;
        this.yearId = result[0].value;
      }
      this.getAdjMeanSD();
    });
  }

  getAdjMeanSD() {
    this.editableMode = false;
    this.loaderService.show();
    let obj = {
      labId: this.currentUser.labIds[0],
      compoundId: this.compoundId,
      instrumentId: this.instrumentId,
      methodId: this.methodId,
      monthId: this.monthId,
      yearId: this.yearId,
      startPage: this.paginationService.startPage
    }
    this.qualityControlService.getAdjMeanSD(obj).then((result) => {
      let data: any = result.data;
      this.adjMeanSD = [];
      data.forEach(element => {
        let obj: any = {
          COMPOUND_NAME: element.COMP_NAME,
          COMPOUND_METHOD: element.METHOD_NAME,
          ADJ_MEAN: element.ADJ_MEAN,
          ADJ_SD: element.ADJ_SD,
          isEdit: false,
          COMP_ID: element.COMP_ID,
          INSTRUMENT_ID: element.INSTRUMENT_ID,
          LAB_ID: element.LAB_ID,
          METHOD_ID: element.METHOD_ID,
          MONTH: element.MONTH,
          YEAR: element.YEAR,
          CV: 0
        };
        obj.CV = (parseFloat(element.ADJ_SD) / parseFloat(element.ADJ_MEAN)) * 100;
        this.adjMeanSD.splice(this.adjMeanSD.length, 0, obj);
        return element;
      });
      this.adjMeanSDArray = this.adjMeanSD.map(x => Object.assign({}, x));
      this.loaderService.hide();
    });
  }


  editAdjMeanSD(item) {
    let check = 0;
    let isEDitOpenValue = this.adjMeanSD.filter(i => i.isEdit === true);
    if (isEDitOpenValue.length === 0) {
      item.isEdit = true;
    } else {
      this.errorMessage.push({ severity: 'error', summary: '', detail: 'Please save the previous one' });
    }
  }

  saveAdjMeanSD(data) {
    if (data.isEdit) {
      this.loaderService.show();
      let obj = {
        labId: this.currentUser.labIds[0],
        compoundId: data.COMP_ID,
        instrumentId: data.INSTRUMENT_ID,
        methodId: data.METHOD_ID,
        monthId: data.MONTH,
        yearId: data.YEAR,
        adjMean: data.ADJ_MEAN,
        adjSD: data.ADJ_SD
      }
      this.qualityControlService.saveAdjMeanSD(obj).then(result => {
        this.getAdjMeanSD();
      });
    }
  }

  cancelAdjMean(compound) {
    this.adjMeanSD = this.adjMeanSDArray.map(x => Object.assign({}, x));
    compound.isEdit = false;
  }
  /* call to page change of the grid */
  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getAdjMeanSD();
  }
}
