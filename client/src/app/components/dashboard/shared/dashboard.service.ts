import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DashboardModel } from './dashboard.model';
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
export class DashboardService {

  constructor(private http: Http) { }

  getModule(moduleIds): Promise<ArrayResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LOGIN_URI + 'module', moduleIds)
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<any>>(promise);
  }

}
