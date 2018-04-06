import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SmartMaintenanceFrequency } from './smart-maintenance.model';
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
export class SmartMaintenanceFrequencyService {

    constructor(private http: Http) { }

    getFrequencies(params): Promise<ObjectResponseModel<BaseDataModel<SmartMaintenanceFrequency>>> {
        let promise = this.http
            .get(ApiUrl.SMART_LAB_URI + 'smartMaintenance/getFrequencies', { params: params })
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<BaseDataModel<SmartMaintenanceFrequency>>>(promise);
    }

    getFrequencyById(freqId): Promise<ObjectResponseModel<SmartMaintenanceFrequency>> {
        let promise = this.http
            .get(ApiUrl.SMART_LAB_URI + 'smartMaintenance/getFrequencyById/' + freqId)
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<SmartMaintenanceFrequency>>(promise);
    }

    getDynamicFrequencies(): Promise<ArrayResponseModel<SmartMaintenanceFrequency>> {
        let promise = this.http
            .get(ApiUrl.SMART_LAB_URI + 'smartMaintenance/frequency/ddo')
            .toPromise();
        return new PromiseHandler<ArrayResponseModel<SmartMaintenanceFrequency>>(promise);
    }

    saveFrequency(data): Promise<PostObjectResponseModel<SmartMaintenanceFrequency>> {
        let url = ApiUrl.SMART_LAB_URI + 'smartMaintenance/frequency';
        let promise = this.http
            .post(url, JSON.stringify(data))
            .toPromise();

        return new PromiseHandler<ObjectResponseModel<SmartMaintenanceFrequency>>(promise);
    }
}
