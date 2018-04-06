import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SmartMaintenance, SmartMaintenanceItem } from './smart-maintenance.model';
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
export class SmartMaintenanceService {

  constructor(private http: Http) { }

  /* instrument functions */
  getSMInstruments(params, labId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'smartMaintenance/getInstruments/' + labId, { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveSMInstrument(data): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'smartMaintenance/instrument', data)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteSMInstrumentById(id): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'smartMaintenance/instrument/delete/' + id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }


  getSMInstrumentFrequencies(params, labId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'smartMaintenance/getInstrumentFrequencies/' + labId, { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveSMInstrumentFrequency(data): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'smartMaintenance/instrumentFrequency', data)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteSMInstrumentFrequencyById(id): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'smartMaintenance/instrumentFrequency/delete/' + id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  /* instrument functions */
  getChecklistArray(labId, instrumentId, freqId, monthId, yearId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'smartMaintenance/getchecklists/' + labId + '/' + instrumentId + '/' + freqId
      + '/' + monthId + '/' + yearId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveChecklist(data, freqId, labId, instrumentId, date): Promise<ObjectResponseModel<any>> {
    let obj = {
      data: data,
      FREQ_ID: freqId,
      LAB_ID: labId,
      INSTR_ID: instrumentId,
      DATE: date
    }
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'smartMaintenance/checklist', obj)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteChecklistById(data): Promise<ObjectResponseModel<any>> {
    let obj = {
      LAB_ID: data.LAB_ID,
      INSTR_ID: data.INSTR_ID,
      FREQ_ID: data.FREQ_ID,
      DATE: data.DATE
    }
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'smartMaintenance/checklist/delete', obj)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  generateReport(data): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'smartMaintenance/generateReport', data)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  getReport(params, labId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'smartMaintenance/report/list/' + labId, { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }


}
