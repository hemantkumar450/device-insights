import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PBIReportModel } from './pbi-reports.model';
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
export class PBIReportsService {

    constructor(private http: Http) { }

    getPBIReports(params): Promise<ObjectResponseModel<BaseDataModel<PBIReportModel>>> {
        let promise = this.http
            .get(ApiUrl.LAB_URI + 'DI/pbiReports/list', { params: params })
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<BaseDataModel<PBIReportModel>>>(promise);
    }

    getPBIReportsById(LAB_ID, MODULE_ID): Promise<PostObjectResponseModel<PBIReportModel>> {
        let promise = this.http
            .get(ApiUrl.LAB_URI + 'DI/pbiReports/getPBIReportById/' + LAB_ID + '/' + MODULE_ID)
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<PBIReportModel>>(promise);
    }

    savePBIReports(data): Promise<PostObjectResponseModel<PBIReportModel>> {
        let url = ApiUrl.LAB_URI + 'DI/pbiReports';
        let promise = this.http.post(url, JSON.stringify(data)).toPromise();
        return new PromiseHandler<ObjectResponseModel<PBIReportModel>>(promise);
    }


    public deletePBIReportsById(LAB_ID: number, MODULE_ID: number): Promise<ObjectResponseModel<boolean>> {
        let promise = this.http
            .delete(ApiUrl.LAB_URI + 'DI/pbiReports/delete/' + LAB_ID + '/' + MODULE_ID)
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<boolean>>(promise);
    }
}
