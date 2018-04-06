
import { Component, OnInit, ViewChild } from '@angular/core';
import { QualityControlService, MeanSD } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { LocalStorageService } from '../../../core/shared/services/index';

@Component({
  selector: 'app-quality-control-mean-sd',
  templateUrl: './mean-sd.component.html',
})

export class MeanSDComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public meanSDArray: Array<MeanSD> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public errorMessage: Array<Message> = [];
  compounds: Array<any> = [];
  instruments: Array<any> = [];
  methods: Array<any> = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  compoundId: number = 0;
  instrumentId: number = 0;
  methodId: number = 0;
  currentYear: number = 0;
  currentUser: any;

  constructor(private qualityControlService: QualityControlService,
    public routeService: RouteService,
    private masterService: MasterService,
    private loaderService: LoaderService,
    public confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService,
    public paginationService: PaginationService) {
    this.currentUser = this.localStorageService.getCurrentUser();
    this.paginationService.setDefaultPage();
    this.getInstruments();
  }

  ngOnInit() {
    this.startDate.setMonth(this.startDate.getMonth() - 1);
    let year = new Date();
    this.currentYear = year.getFullYear() + 10;
  }

  getInstruments() {
    this.loaderService.show();
    let labId = this.currentUser.labIds[0];
    this.masterService.getInstruments(labId).then(result => {
      this.instruments = [];
      if (result.length > 0) {
        this.instruments = result;
        this.instrumentId = this.instruments[0].value;
      }
      this.getCompounds(true);
    })
  }

  getCompounds(isLoad) {
    this.loaderService.show();
    let labId = this.currentUser.labIds[0];
    this.masterService.getMeanSDCompoundDDOByInstrumentId(labId, this.instrumentId).then(result => {
      this.compounds = [];
      if (result.length > 0) {
        this.compounds = result;
        let obj = { label: "All", value: "All" };
        this.compounds.splice(0, 0, obj);
        this.compoundId = this.compounds[0].value;
      }
      this.getCompoundMethodDDO(isLoad);
    })
  }

  private getCompoundMethodDDO(isload) {
    let labId = this.currentUser.labIds[0];
    this.masterService.getCompoundMethodDDOByinstrumentId(labId, this.instrumentId).then(result => {
      this.methods = [];
      if (result.length > 0) {
        this.methods = result;
        let obj = { label: "All", value: "All" };
        this.methods.splice(0, 0, obj);
        this.methodId = result[0].value;
      }
      this.getMeanSD(isload);
    })
  }

  getMeanSD(isLoad) {
    let obj = { compoundId: null, instrumentId: this.instrumentId, methodId: null, startDate: this.startDate, endDate: this.endDate }
    if (!isLoad) {
      obj.compoundId = this.compoundId;
      obj.methodId = this.methodId;
      obj.startDate = this.startDate;
      obj.endDate = this.endDate;
    }
    this.loaderService.show();
    this.qualityControlService.getMeanSD(obj).then((result) => {
      let data: any = result.data;
      this.meanSDArray = [];
      data.forEach(element => {
        let obj: any = {
          COMPOUND_NAME: element.COMPOUND_NAME,
          COMPOUND_METHOD: element.COMPOUND_METHOD,
          MEAN: element.MEAN,
          SD: element.SD,
          CV: 0
        };
        if (element.SD) {
          obj.CV = (parseFloat(element.SD.replace(/,/g, '')) / parseFloat(element.MEAN.replace(/,/g, ''))) * 100;
        }
        this.meanSDArray.splice(this.meanSDArray.length, 0, obj);
        return element;
      });
      this.loaderService.hide();
    });
  }

  /* call to page change of the grid */
  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getMeanSD(true);
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getMeanSD(true);
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getMeanSD(true);
  }
}
