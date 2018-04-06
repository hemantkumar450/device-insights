
import { Component, OnInit, ViewChild } from '@angular/core';
import { HumidityModel, SmartLabService } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { SmartLabSensorType } from '../../shared/enums/base.enum';

@Component({
  selector: 'app-smart-lab-humidity',
  templateUrl: './humidity.component.html',
})

export class HumidityComponent implements OnInit {

  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;

  public humidity: Array<HumidityModel> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public errorMessage: Array<Message> = [];
  public locations: Array<CustomDDO> = [];
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public humidities: Array<any> = [];
  public locationId: number = 0;
  public currentYear: number = 0;


  constructor(private smartLabService: SmartLabService,
    public routeService: RouteService,
    private masterService: MasterService,
    private loaderService: LoaderService,
    public confirmationService: ConfirmationService,
    public paginationService: PaginationService) {
    this.paginationService.setDefaultPage();
    this.getLocations();
    this.startDate.setMonth(this.startDate.getMonth() - 1);
  }

  ngOnInit() {
    let year = new Date();
    this.currentYear = year.getFullYear() + 10;
  }

  private getLocations() {
    this.loaderService.show();
    this.masterService.getLabDDOForSmartLabLocations().then((result) => {
      this.locations = result;
      if (result.length > 0) {
        this.locationId = result[0].value;
      }
      this.loaderService.hide();
      this.getHumidityAndTemp();
    });
  }

  getHumidityAndTemp() {
    let sensorTypeId = SmartLabSensorType.Humidity // humidityId
    if (this.startDate > this.endDate) {
      this.errorMessage.push({ severity: 'error', summary: 'Warn Message', detail: 'Start date should be less than end date' });
      return;
    }
    this.loaderService.show();
    this.smartLabService.getHumidityAndTemp(this.paginationService.getParams(), this.locationId, sensorTypeId, this.startDate, this.endDate).then(result => {
      this.humidities = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.loaderService.hide();
    })
  }

  /* call to page change of the grid */
  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getHumidityAndTemp();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getHumidityAndTemp();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getHumidityAndTemp();
  }
}
