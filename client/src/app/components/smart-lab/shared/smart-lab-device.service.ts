import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DeviceModel } from './smart-lab.model';
import {
  BaseDataModel,
  ObjectResponseModel,
  PromiseHandler,
  PostObjectResponseModel,
  ArrayResponseModel,
  DeletePromiseHandler
} from './../../shared/models/base-data.model';

import { ApiUrl } from '../../../shared/api.service';


@Injectable()
export class SmartLabDeviceService {

  constructor(private http: Http) { }

  getDevices(params): Promise<ObjectResponseModel<BaseDataModel<DeviceModel>>> {
    let promise = this.http
      .get(ApiUrl.SMART_LAB_URI + 'smartLabDevice/list', { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<BaseDataModel<DeviceModel>>>(promise);
  }

  getAdminEmails(): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.SMART_LAB_URI + 'getAdminEmails')
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  getDeviceById(id): Promise<ObjectResponseModel<DeviceModel>> {
    let promise = this.http
      .get(ApiUrl.SMART_LAB_URI + 'smartLabDevice/' + id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<DeviceModel>>(promise);
  }

  saveDevice(data): Promise<PostObjectResponseModel<DeviceModel>> {
    let url = ApiUrl.SMART_LAB_URI + 'smartLabDevice';
    let promise = this.http
      .post(url, JSON.stringify(data))
      .toPromise();

    return new PromiseHandler<ObjectResponseModel<DeviceModel>>(promise);
  }

  public deleteDeviceById(deviceId: number): Promise<ObjectResponseModel<boolean>> {
    let promise = this.http
      .delete(ApiUrl.SMART_LAB_URI + 'smartLabDevice/delete/' + deviceId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<boolean>>(promise);
  }

}
