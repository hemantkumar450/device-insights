import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AnalyticsModel } from './analytics.model';
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
export class AnalyticsService {

  constructor(private http: Http) { }

  getLabs(params): Promise<ArrayResponseModel<AnalyticsModel>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'lab/list', { params: params })
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<AnalyticsModel>>(promise);
  }

}
