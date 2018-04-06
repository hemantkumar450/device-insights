import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SmartLabModel, ReportModel } from './smart-lab.model';
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
export class SmartLabService {

  constructor(private http: Http) { }

  getSmartLabReports(): Promise<ArrayResponseModel<ReportModel>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'smartLabReport/list')
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<ReportModel>>(promise);
  }

  getHumidityAndTemp(params, locationId, sensorTypeId, startDate, endDate): Promise<ObjectResponseModel<BaseDataModel<SmartLabModel>>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'smartLabDevice/' + locationId + '/' + sensorTypeId + '/' + startDate + '/' + endDate, { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<BaseDataModel<SmartLabModel>>>(promise);
  }

  generateReport(startDate, endDate): Promise<ObjectResponseModel<BaseDataModel<SmartLabModel>>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'smartLabReport/generatePdf/' + startDate + '/' + endDate)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<BaseDataModel<SmartLabModel>>>(promise);
  }

  deleteSMReportPdf(labId, reportId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'smartLabReport/deleteSMReportPdf/' + labId + '/' + reportId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }
}
