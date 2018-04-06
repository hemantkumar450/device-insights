import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { RouteService, PaginationService } from '../../../shared';
import { Paginator } from '../../../core/paginator/paginator';
import { Message } from 'primeng/primeng';
import { PaginationEnum } from '../../shared/enums';
import { LocalStorageService } from '../../../core/shared/services/index';
import { LocationModel, SmartLabLocationService } from '../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { DefaultRole } from '../../shared/enums/index';

@Component({
  selector: 'app-smart-lab-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})

export class LocationComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild(Paginator) paginatorComponent: Paginator;
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public locations: Array<LocationModel> = new Array<LocationModel>();
  public locationArray: Array<LocationModel> = new Array<LocationModel>();
  public location = new LocationModel();
  isAppAdmin: boolean = false;
  isLabAdmin: boolean = false;
  public currentUser: any;

  public errorMsg: Message[] = [];

  constructor(
    public paginationService: PaginationService,
    private routeService: RouteService,
    public route: ActivatedRoute,
    private loaderService: LoaderService,
    public confirmationService: ConfirmationService,
    private smartLabLocationService: SmartLabLocationService,
    private localStorageService: LocalStorageService) {
    this.paginationService.setDefaultPage();
    this.currentUser = this.localStorageService.getCurrentUser();
    if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
      this.isAppAdmin = true;
    }
    if (this.currentUser.roleId === DefaultRole.LabAdmin || this.currentUser.roleId === DefaultRole.SuperAdmin) {
      this.isLabAdmin = true;
    }
  }

  ngOnInit() {
    this.getLocation();
  }

  public getLocation() {
    this.loaderService.show();
    this.smartLabLocationService.getLocations(this.paginationService.getParams()).then(result => {
      this.locations = result.data.Data;
      this.totalRecords = result.data.TotalRecords;
      this.locations.forEach(element => {
        element.isEdit = false;
        return element;
      });
      this.locationArray = this.locations.map(x => Object.assign({}, x));
      this.loaderService.hide();
    })
  }


  public addLocation() {
    let errorCount = 0;
    let isEdit = false;
    this.locations.forEach(element => {
      if (element.LOCATION_ID === 0) {
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
      this.location = new LocationModel();
      this.locations = [...this.locations, this.location];
    }
  }

  private editLocation(compound): void {
    let count = 0;
    this.locations.forEach(location => {
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

  public saveLocation(locationItem) {
    if (locationItem.LOCATION_NAME.trim() === '') {
      this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert location name' });
      return;
    }
    locationItem.LOCATION_NAME = locationItem.LOCATION_NAME.trim();
    this.loaderService.show();
    this.smartLabLocationService.saveLocation(locationItem).then(result => {
      this.getLocation();
    })
  }

  private deleteLocation(location: LocationModel) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete - ' + location.LOCATION_NAME + ' ?',
      icon: 'fa fa-trash',
      accept: () => {
        this.loaderService.show();
        this.smartLabLocationService.deleteLocationById(location.LOCATION_ID).then(result => {
          this.getLocation();
          this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
        })
      }
    });
  }

  cancelLocation(compound) {
    this.locations = this.locationArray.map(x => Object.assign({}, x));
    compound.isEdit = false
  }

  pageChanged(event) {
    this.paginationService.setPageChange(event);
    this.getLocation();
  }

  /* call to sorting the grid data */
  onSorting(event) {
    this.paginationService.setSortExpression(event);
    this.getLocation();
  }

  /* call to filter the grid data */
  onFiltering(event) {
    this.dataTableComponent.reset();
    this.paginatorComponent.first = 0;
    this.paginationService.setFilterValues(event.filters);
    this.getLocation();
  }

}
