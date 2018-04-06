
import { Component, OnInit, ViewChild } from '@angular/core';
import { SmartMaintenanceService, SmartMaintenanceInstrument } from '../../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../../shared';
import { PaginationEnum } from '../../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../../shared';
import { LoaderService } from '../../../../core/loader/loader.service';
import { SmartLabSensorType } from '../../../shared/enums/base.enum';
import { DefaultRole } from '../../../../components/shared/enums/index';
import { LocalStorageService } from '../../../../core/shared/services/index';
import { Results } from 'app/components/quality-control';

@Component({
  selector: 'app-smart-maintenance-master-instrument',
  templateUrl: './master-instrument.component.html',
  styleUrls: ['./master-instrument.component.css']
})

export class SmartMaintenanceMasterInstrumentComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public instruments: Array<SmartMaintenanceInstrument> = new Array<SmartMaintenanceInstrument>();
  public instrumentArray: Array<SmartMaintenanceInstrument> = new Array<SmartMaintenanceInstrument>();
  public instrument = new SmartMaintenanceInstrument();
  isAdd: boolean = false;
  masterInstrumentTab: boolean = true;
  errorMsg: Message[] = [];
  frequencies: Array<CustomDDO> = [];
  instrumentDDO: Array<CustomDDO> = [];
  isAdmin: boolean = false;
  currentUser: any;

  constructor(
    public paginationService: PaginationService,
    private routeService: RouteService,
    private loaderService: LoaderService,
    private masterService: MasterService,
    public confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService,
    private smartMaintenanceService: SmartMaintenanceService) {
    this.paginationService.setDefaultPage();
    this.getFrequencies();
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getCurrentUser();
    if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
      this.isAdmin = true;
    }
    this.getInstruments();
    this.getInstrumentDDO();
  }

  getFrequencies() {
    this.loaderService.show();
    this.masterService.getIMFrequencyDDO().then(result => {
      if (result.length > 0) {
        this.frequencies = result;
      }
      this.loaderService.hide();
    })
  }

  getInstrumentDDO() {
    let labId = this.currentUser.labIds[0];
    this.loaderService.show();
    this.masterService.getIMInstrumentDDO(labId).then(result => {
      if (result.length > 0) {
        this.instrumentDDO = result;
      }
      this.loaderService.hide();
    })
  }

  public getInstruments() {
    this.loaderService.show();
    let labId = this.currentUser.labIds[0];
    this.smartMaintenanceService.getSMInstruments(this.paginationService.getParams(), labId).then(result => {
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
    this.instrument = new SmartMaintenanceInstrument();
    let isEdit = this.checkEditCase();
    if (isEdit) {
      this.isAdd = true;
    }
  }

  private editInstrument(instrument: SmartMaintenanceInstrument): void {

    if (this.isAdd) {
      this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please cancel the add option' });
      return;
    } else {
      this.isAdd = false;
    }
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

  public saveInstrument(instrument: SmartMaintenanceInstrument) {
    if (instrument.INSTR_NAME.trim() === '') {
      this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert Instrument name' });
      return;
    }
  
    instrument.INSTR_NAME = instrument.INSTR_NAME.trim();
    instrument.LAB_ID = this.currentUser.labIds[0];
    this.loaderService.show();
    this.smartMaintenanceService.saveSMInstrument(instrument).then(result => {
      this.isAdd = false;
      this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record added successfully' });
      this.getInstruments();
    })
  }

  private deleteInstrument(instrument: SmartMaintenanceInstrument) {
    this.isAdd = false;
    this.confirmationService.confirm({
      message: 'It will delete all its related rows from InstrumentFrequency & Items.' +
        'Are you sure that you want to delete - ' + instrument.INSTR_NAME + ' instrument ?',
      icon: 'fa fa-trash',
      accept: () => {
        this.loaderService.show();
        this.smartMaintenanceService.deleteSMInstrumentById(instrument.INSTR_ID).then(result => {
          this.getInstruments();
          this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
        })
      }
    });
  }


  onTabChange(event) {
    if (event.index === 1) {
      this.masterInstrumentTab = false;
    } else {
      this.masterInstrumentTab = true;
    }
  }

  cancel() {
    this.isAdd = false;
  }

  cancelInstrument(instrument) {
    instrument.isEdit = false;
    this.instruments = this.instrumentArray.map(x => Object.assign({}, x));
  }

  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getInstruments();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getInstruments();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getInstruments();
  }

}