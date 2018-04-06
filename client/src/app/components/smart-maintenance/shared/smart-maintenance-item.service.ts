import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SmartMaintenanceItem } from './smart-maintenance.model';
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
export class SmartMaintenanceItemService {

    constructor(private http: Http) { }

    getItems(params, labId, INSTR_ID, FREQ_ID): Promise<ObjectResponseModel<BaseDataModel<SmartMaintenanceItem>>> {
        let promise = this.http
            .get(ApiUrl.SMART_LAB_URI + 'smartMaintenance/getitems/' + labId + '/' + INSTR_ID + '/' + FREQ_ID, { params: params })
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<BaseDataModel<SmartMaintenanceItem>>>(promise);
    }

    getItemByFrequency(FREQ_ID, INSTR_ID): Promise<ArrayResponseModel<SmartMaintenanceItem>> {
        let promise = this.http
            .get(ApiUrl.SMART_LAB_URI + 'smartMaintenance/getItemByFrequency/' + FREQ_ID + '/' + INSTR_ID)
            .toPromise();
        return new PromiseHandler<ArrayResponseModel<SmartMaintenanceItem>>(promise);
    }

    saveItem(data): Promise<PostObjectResponseModel<SmartMaintenanceItem>> {
        let url = ApiUrl.SMART_LAB_URI + 'smartMaintenance/item';
        let promise = this.http
            .post(url, JSON.stringify(data))
            .toPromise();

        return new PromiseHandler<ObjectResponseModel<SmartMaintenanceItem>>(promise);
    }

    public deleteItemById(locationId: number): Promise<ObjectResponseModel<boolean>> {
        let promise = this.http
            .delete(ApiUrl.SMART_LAB_URI + 'smartMaintenance/item/delete/' + locationId)
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<boolean>>(promise);
    }
}
