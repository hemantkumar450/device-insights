import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SmartMaintenanceItemMapping } from './smart-maintenance.model';
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
export class SmartMaintenanceItemMappingService {

    constructor(private http: Http) { }

    getItemMapping(params, labId, INSTR_ID, FREQ_ID): Promise<ObjectResponseModel<BaseDataModel<SmartMaintenanceItemMapping>>> {
        let promise = this.http
            .get(ApiUrl.SMART_LAB_URI + 'smartMaintenance/getitemMapping/' + labId + '/' + INSTR_ID + '/' + FREQ_ID, { params: params })
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<BaseDataModel<SmartMaintenanceItemMapping>>>(promise);
    }

    saveItemMapping(data): Promise<PostObjectResponseModel<SmartMaintenanceItemMapping>> {
        let url = ApiUrl.SMART_LAB_URI + 'smartMaintenance/itemMapping';
        let promise = this.http
            .post(url, JSON.stringify(data))
            .toPromise();

        return new PromiseHandler<ObjectResponseModel<SmartMaintenanceItemMapping>>(promise);
    }

    public deleteItemMappingById(locationId: number): Promise<ObjectResponseModel<boolean>> {
        let promise = this.http
            .delete(ApiUrl.SMART_LAB_URI + 'smartMaintenance/itemMapping/delete/' + locationId)
            .toPromise();
        return new PromiseHandler<ObjectResponseModel<boolean>>(promise);
    }
}
