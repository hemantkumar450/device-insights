import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LabModel } from './lab.model';
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
export class LabService {

  constructor(private http: Http) { }

  getLabs(params): Promise<ObjectResponseModel<BaseDataModel<LabModel>>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'lab/list', { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<BaseDataModel<LabModel>>>(promise);
  }

  getLabById(LAB_ID): Promise<PostObjectResponseModel<LabModel>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'lab/' + LAB_ID)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<LabModel>>(promise);
  }

  saveLab(data): Promise<PostObjectResponseModel<LabModel>> {
    let url = ApiUrl.LAB_URI + 'lab';
    let promise = null;

    if (data.LAB_ID > 0) {
      promise = this.http
        .put(url, JSON.stringify(data))
        .toPromise();
    } else {
      promise = this.http
        .post(url, JSON.stringify(data))
        .toPromise();
    }

    return new PromiseHandler<ObjectResponseModel<LabModel>>(promise);
  }


  activateLabById(LAB_ID): Promise<PostObjectResponseModel<LabModel>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'lab/activate/' + LAB_ID)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<LabModel>>(promise);
  }


  public deleteLabById(LAB_ID: number): Promise<ObjectResponseModel<boolean>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'lab/delete/' + LAB_ID)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<boolean>>(promise);
  }


  getLogo(id): Promise<ObjectResponseModel<LabModel>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'lab/getIconById/' + id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<LabModel>>(promise);
  }
}
