
import { Component, OnInit, ViewChild } from '@angular/core';
import { QualityControlService, QualityControlCompound } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { DefaultRole } from '../../../components/shared/enums/index';
import { LocalStorageService } from '../../../core/shared/services/index';

@Component({
  selector: 'app-quality-control-compound',
  templateUrl: './compound.component.html',
})

export class QualityControlCompoundComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public compounds: Array<QualityControlCompound> = new Array<QualityControlCompound>();
  public compoundArray: Array<QualityControlCompound> = new Array<QualityControlCompound>();
  public compound = new QualityControlCompound();
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
    this.getQualityControlInstrumentDDO();
  }

  public getQualityControlInstrumentDDO() {
    this.loaderService.show();
    this.masterService.getQCInstrumentDDO().then(result => {
      if (result.length > 0) {
        this.instruments = result;
        this.instrumentId = result[0].value;
        this.getQualityControlCompounds();
      } else {
        this.loaderService.hide();
      }
    });
  }

  public getQualityControlCompounds() {
    this.loaderService.show();
    this.isAdd = false;
    this.qualityControlService.getQualityControlCompounds(this.instrumentId, this.paginationService.getParams()).then(result => {
      this.compounds = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.compounds.forEach(element => {
        element.isEdit = false;
        return element;
      });

      this.compoundArray = this.compounds.map(x => Object.assign({}, x));
      this.loaderService.hide();
    });
  }


  public addCompound() {
    let isEdit = this.checkEditCase();
    if (isEdit) {
      this.isAdd = true;
    }
  }

  private editCompound(compound): void {
    this.isAdd = false;
    compound.isEdit = this.checkEditCase();
  }

  checkEditCase() {
    let count = 0;
    let isEdit = false;
    this.compounds.forEach(location => {
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

  public saveQualityControlCompound(compound: QualityControlCompound) {
    if (compound.COMP_NAME.trim() === '') {
      this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert Instrument name' });
      return;
    }
    compound.INSTRUMENT_ID = this.instrumentId;
    compound.COMP_NAME = compound.COMP_NAME.trim();
    this.loaderService.show();
    this.qualityControlService.saveQualityControlCompound(compound).then(result => {
      this.isAdd = false;
      this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record added successfully' });
      this.getQualityControlCompounds();
    })
  }

  private deleteCompound(compound: QualityControlCompound) {
    this.isAdd = false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete - ' + compound.COMP_NAME + ' ?',
      icon: 'fa fa-trash',
      accept: () => {
        this.loaderService.show();
        this.qualityControlService.deleteQCCompoundById(compound.COMP_ID).then(result => {
          this.getQualityControlCompounds();
          this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
        })
      }
    });
  }

  cancel() {
    this.isAdd = false;
  }

  cancelCompound(compound) {
    this.compounds = this.compoundArray.map(x => Object.assign({}, x));
    compound.isEdit = false;
  }

  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getQualityControlCompounds();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getQualityControlCompounds();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getQualityControlCompounds();
  }

}