import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { RouteService, PaginationService } from '../../shared';
import { Paginator } from '../../core/paginator/paginator';
import { Message } from 'primeng/primeng';
import { PaginationEnum } from '../shared/enums';
import { LocalStorageService } from '../../core/shared/services/index';
import { SensorTypeService, SensorType } from './index';
import { LoaderService } from '../../core/loader/loader.service';


@Component({
  selector: 'app-sensor-type',
  templateUrl: './sensor-type.component.html',
  styleUrls: ['./sensor-type.component.css']
})

export class SensorTypeComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;
  @ViewChild('fileInput') myFileInput: ElementRef;
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public sensorTypes: Array<SensorType> = new Array<SensorType>();
  public sensorTypeArray: Array<SensorType> = new Array<SensorType>();
  public sensorType = new SensorType();

  public errorMsg: Message[] = [];

  constructor(
    public paginationService: PaginationService,
    private routeService: RouteService,
    private loaderService: LoaderService,
    public route: ActivatedRoute,
    public confirmationService: ConfirmationService,
    private sensorTypeService: SensorTypeService,
    private localStorageService: LocalStorageService) {
    this.paginationService.setDefaultPage();

  }

  ngOnInit() {
    this.getsensorTypes();
  }



  public getsensorTypes() {
    this.loaderService.show();
    this.sensorTypeService.getSensorType(this.paginationService.getParams()).then(result => {
      this.sensorTypes = result.data.Data;
      this.loaderService.hide();
      this.totalRecords = result.data.TotalRecords;
      this.sensorTypes.forEach(element => {
        element.isEdit = false;
        return element;
      });
      this.sensorTypeArray = this.sensorTypes.map(x => Object.assign({}, x));
    })
  }


  public addSensorType() {
    let errorCount = 0;
    let isEdit = false;
    this.sensorTypes.forEach(element => {
      if (element.SENSOR_TYPE_ID === 0) {
        this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Location can not be blank' });
        errorCount++;
        return;
      }
      if (element.isEdit) {
        isEdit = true;
      }
    });
    if (isEdit) {
      this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please first save edit case' });
    }
    if (errorCount === 0 && !isEdit) {
      this.sensorType = new SensorType();
      this.sensorTypes = [...this.sensorTypes, this.sensorType];
    }
  }

  private editSensorType(compound: SensorType): void {
    let count = 0;
    this.sensorTypes.forEach(location => {
      if (location.isEdit) {
        count++;
      }
    });
    if (count > 0) {
      compound.isEdit = false;
      this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'First save previous edit' });
    } else {
      compound.isEdit = true;
    }
  }

  public saveSensorType(locationItem: SensorType) {
    if (locationItem.SENSOR_TYPE_NAME.trim() === '') {
      this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert Sensor Type Name' });
      return;
    }
    locationItem.SENSOR_TYPE_NAME = locationItem.SENSOR_TYPE_NAME.trim();
    this.loaderService.show();
    this.sensorTypeService.saveSensorType(locationItem).then(result => {
      this.getsensorTypes();
    })
  }

  private deleteSensorType(sensorType: SensorType) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete - ' + sensorType.SENSOR_TYPE_NAME + ' ?',
      icon: 'fa fa-trash',
      accept: () => {
        this.loaderService.show();
        this.sensorTypeService.deleteSensorTypeById(sensorType.SENSOR_TYPE_ID).then(result => {
          this.getsensorTypes();
          this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
        })
      }
    });
  }

  cancelSensorType(compound) {
    this.sensorTypes = this.sensorTypeArray.map(x => Object.assign({}, x));
    compound.isEdit = false;
  }

  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getsensorTypes();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getsensorTypes();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getsensorTypes();
  }

}
