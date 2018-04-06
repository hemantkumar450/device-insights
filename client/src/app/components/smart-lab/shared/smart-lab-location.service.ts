import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocationModel } from './smart-lab.model';
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
export class SmartLabLocationService {

  constructor(private http: Http) { }

  getLocations(params): Promise<ObjectResponseModel<BaseDataModel<LocationModel>>> {
    let promise = this.http
      .get(ApiUrl.SMART_LAB_URI + 'smartLabLocation/list', { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<BaseDataModel<LocationModel>>>(promise);
  }

  saveLocation(data): Promise<PostObjectResponseModel<LocationModel>> {
    let url = ApiUrl.SMART_LAB_URI + 'smartLabLocation';
    let promise = this.http
      .post(url, JSON.stringify(data))
      .toPromise();

    return new PromiseHandler<ObjectResponseModel<LocationModel>>(promise);
  }

  public deleteLocationById(locationId: number): Promise<ObjectResponseModel<boolean>> {
    let promise = this.http
      .delete(ApiUrl.SMART_LAB_URI + 'smartLabLocation/delete/' + locationId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<boolean>>(promise);
  }

}
