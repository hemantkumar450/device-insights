import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SensorType } from './sensor-type.model';
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
export class SensorTypeService {

  constructor(private http: Http) { }

  getSensorType(params): Promise<ObjectResponseModel<BaseDataModel<SensorType>>> {
    let promise = this.http
      .get(ApiUrl.SMART_LAB_URI + 'sensorType/list', { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<BaseDataModel<SensorType>>>(promise);
  }

  saveSensorType(data): Promise<PostObjectResponseModel<SensorType>> {
    let url = ApiUrl.SMART_LAB_URI + 'sensorType';
    let promise = this.http
      .post(url, JSON.stringify(data))
      .toPromise();

    return new PromiseHandler<ObjectResponseModel<SensorType>>(promise);
  }

  public deleteSensorTypeById(locationId: number): Promise<ObjectResponseModel<boolean>> {
    let promise = this.http
      .delete(ApiUrl.SMART_LAB_URI + 'sensorType/delete/' + locationId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<boolean>>(promise);
  }

}
