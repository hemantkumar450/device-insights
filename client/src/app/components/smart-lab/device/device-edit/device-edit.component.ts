import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from './../../../../shared';
import { DeviceModel, SmartLabDeviceService } from '../../shared';
import { Message } from 'primeng/primeng';
import { UserService } from '../../../user';
import { CustomDDO, MasterService } from '../../../shared';
import { LoaderService } from '../../../../core/loader/loader.service';


@Component({
  selector: 'app-smart-lab-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.css']
})

export class SmartLabDeviceEditComponent implements OnInit {

  public errorMsg: Message[] = [];
  public device: DeviceModel = new DeviceModel();
  public locations: Array<CustomDDO> = [];
  public sensorTypes: Array<CustomDDO> = [];
  public isEmailExist: boolean = false;
  EmailId: Array<string> = [];
  Phone: Array<string> = [];

  constructor(
    private smartLabDeviceService: SmartLabDeviceService,
    private routeService: RouteService,
    private loaderService: LoaderService,
    private userService: UserService,
    private masterService: MasterService,
    public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getDefaultParams();
  }

  getDefaultParams() {
    this.device.SENSOR_ID = +this.route.snapshot.params['id'] || 0;
    this.getSensorTypes();
  }

  private getSensorTypes() {
    this.loaderService.show();
    this.masterService.getLabDDOForSensorTypes().then((result) => {
      this.sensorTypes = result;
      this.getLocations();
    });
  }

  private getLocations() {
    this.loaderService.show();
    this.masterService.getLabDDOForSmartLabLocations().then((result) => {
      this.locations = result;
      if (this.device.SENSOR_ID > 0) {
        this.getLabById(this.device.SENSOR_ID);
      } else {
        this.getAdminEmails();
      }
    });
  }

  private getLabById(id) {
    this.loaderService.show();
    this.smartLabDeviceService.getDeviceById(id).then((result) => {
      this.device = result.data;
      this.getAdminEmails();
    });
  }


  getAdminEmails() {
    this.loaderService.show();
    this.smartLabDeviceService.getAdminEmails().then((result) => {
      let res = result.data;
      this.EmailId = res.EMAIL_ID;
      this.Phone = res.PHONE;
      this.loaderService.hide();
    });
  }

  public save(isValid) {

    if (this.device.SENSOR_FACTORY_CODE.trim() === '') {
      return;
    }

    if (this.device.UPPER_LIMIT === 0 || this.device.LOWER_LIMIT === 0 || this.device.LOCATION_ID === 0) {
      return;
    }

    this.loaderService.show();
    this.smartLabDeviceService.saveDevice(this.device).then((res) => {
      this.errorMsg.push({
        severity: 'success',
        summary: 'Success Message', detail: 'Save Successfully'
      });
      this.loaderService.hide();
      this.cancel();
    });
  }

  public cancel(): void {
    this.routeService.openRoute('smartLab/device');
  }

  public keyPressBattery(event: any) {
  }

}
