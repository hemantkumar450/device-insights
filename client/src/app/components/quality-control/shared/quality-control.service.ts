import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { QualityControlModel, AdjMeanSD, MeanSD, Results, QualityControlReview } from './quality-control.model';
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
export class QualityControlService {

  constructor(private http: Http) { }

  saveAdjMeanSD(data): Promise<ArrayResponseModel<AdjMeanSD>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/adjMeanSD', data)
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<AdjMeanSD>>(promise);
  }

  getMeanSD(obj): Promise<ArrayResponseModel<MeanSD>> {
    let params = { compoundId: obj.compoundId, instrumentId: obj.instrumentId, methodId: obj.methodId, startDate: obj.startDate, endDate: obj.endDate };
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/meanSD', { params: params })
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<MeanSD>>(promise);
  }

  getAdjMeanSD(obj): Promise<ArrayResponseModel<AdjMeanSD>> {
    let params = {
      labId: obj.labId,
      compoundId: obj.compoundId,
      instrumentId: obj.instrumentId,
      methodId: obj.methodId,
      monthId: obj.monthId,
      yearId: obj.yearId,
      pageNo: obj.startPage
    }
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/getAdjMeanSD', { params: params })
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<AdjMeanSD>>(promise);
  }

  getResults(param, instrumentId, batchId, yearId, monthId, dayId, compoundId, status): Promise<ObjectResponseModel<BaseDataModel<Results>>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/getResults/' + instrumentId + '/' + batchId + '/' + yearId + '/' + monthId + '/' + dayId + '/' + compoundId + '/' + status, { params: param })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<BaseDataModel<Results>>>(promise);
  }

  updateCompoundReason(reasonId): Promise<ArrayResponseModel<Results>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/reason/' + reasonId)
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<Results>>(promise);
  }

  updateBatchStatus(data): Promise<ArrayResponseModel<Results>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/updateBatchStatus', data)
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<Results>>(promise);
  }

  getModuleChartByModuleId(labId, moduleId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'powerBIEmbedToken/getLJChart/' + labId + '/' + moduleId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteBatch(batchId, yearId, monthId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'qualityControl/Result/delete/' + batchId + '/' + monthId + '/' + yearId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }


  reviewBatch(instrumentId, batchId, userId, comment): Promise<ArrayResponseModel<Results>> {
    let obj = {
      INSTRUMENT_ID: instrumentId,
      BATCH_ID: batchId,
      USER_ID: userId,
      COMMENT: comment
    }
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/reviewBatch', obj)
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<Results>>(promise);
  }

  reviewBatchByMonth(instrumentId, monthId, yearId, userId): Promise<ArrayResponseModel<Results>> {
    let obj = {
      INSTRUMENT_ID: instrumentId,
      MONTH: monthId,
      YEAR: yearId,
      USER_ID: userId
    }
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/reviewBatchByMonth', obj)
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<Results>>(promise);
  }

  uploadReviewBatchFile(fileObj): Promise<ArrayResponseModel<Results>> {

    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/uploadReviewBatchFile', fileObj)
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<Results>>(promise);
  }

  updateReviewBatchStatus(item: QualityControlReview): Promise<ArrayResponseModel<QualityControlReview>> {

    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/updateReviewBatchStatus/', item)
      .toPromise();
    return new PromiseHandler<ArrayResponseModel<QualityControlReview>>(promise);
  }


  deleteReviewBatchFile(labId, instrumentId, monthId, yearId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'qualityControl/deleteReviewBatchFile/' + labId + '/' + instrumentId + '/' + monthId + '/' + yearId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }



  getReviewByMonth(labId, instrumentId, yearId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/getReviewBatchByMonth/' + labId + '/' + instrumentId + '/' + yearId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveQCReviewBatchByMonth(labId, instrumentId, monthId, yearId, userId): Promise<ObjectResponseModel<any>> {
    let obj = {
      LAB_ID: labId,
      INSTRUMENT_ID: instrumentId,
      MONTH: monthId,
      YEAR: yearId,
      USER_ID: userId
    }
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/saveReviewBatchByMonth/', obj)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteQCReviewBatchByMonth(labId, instrumentId, monthId, yearId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'qualityControl/deleteReviewBatchByMonth/' + labId + '/' + instrumentId + '/' + monthId + '/' + yearId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }


  /* compounds functions */
  getQualityControlCompounds(instrumentId, params): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/getCompounds/' + instrumentId, { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveQualityControlCompound(data): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/compound', data)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteQCCompoundById(id): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'qualityControl/compound/delete/' + id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }


  /* instrument functions */
  getQualityControlInstruments(params): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/getInstruments', { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveQualityControlInstrument(data): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/instrument', data)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteQCInstrumentById(id): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'qualityControl/instrument/delete/' + id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }


  /* instrument functions */
  getQualityControlMethods(instrumentId, params): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/getMethods/' + instrumentId, { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveQualityControlMethod(data): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/method', data)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteQCMethodById(id): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'qualityControl/method/delete/' + id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  /* Reason functions */
  getQualityControlReason(params): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LAB_URI + 'qualityControl/getReasons', { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveQualityControlReason(data): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/reason', data)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteQCReasonById(id): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.LAB_URI + 'qualityControl/reason/delete/' + id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  /* Result Services */
  saveQualityControlResultRow(data): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .post(ApiUrl.LAB_URI + 'qualityControl/resultGridRow', data)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }


}
