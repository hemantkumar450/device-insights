import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UserModel } from './user.model';
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
export class UserService {

  constructor(private http: Http) { }

  public getUsers(params, isAppAdmin): Promise<ObjectResponseModel<BaseDataModel<UserModel>>> {
    let promise = this.http
      .get(ApiUrl.USER_URI + 'user/list/' + isAppAdmin, { params: params })
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<BaseDataModel<UserModel>>>(promise);
  }

  public getUserById(userId): Promise<ObjectResponseModel<UserModel>> {
    let promise = this.http
      .get(ApiUrl.USER_URI + 'user/' + userId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<UserModel>>(promise);
  }

  public emailValidate(emailId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.USER_URI + 'emailValidate/' + emailId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  saveUser(data): Promise<PostObjectResponseModel<UserModel>> {
    let url = ApiUrl.USER_URI + 'user';
    let promise = null;
    promise = this.http
      .post(url, JSON.stringify(data))
      .toPromise();

    return new PromiseHandler<ObjectResponseModel<UserModel>>(promise);
  }

  deleteProfileImageById(Id: number): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.USER_URI + 'user/profileImage/delete/' + Id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  deleteUserById(Id: number): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .delete(ApiUrl.USER_URI + 'user/delete/' + Id)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

}
