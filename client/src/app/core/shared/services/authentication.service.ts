import { Http, Headers, RequestOptions, BaseRequestOptions, Response } from '@angular/http';
import { ResetPasswordModel } from '../../reset-password/reset-password.model';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';
import {
  BaseDataModel,
  ObjectResponseModel,
  ArrayResponseModel,
  PromiseHandler,
  PostObjectResponseModel,
  DeletePromiseHandler
} from './../../../components/shared/models/base-data.model';
import { Token } from '../../login/login.model';
import { ApiUrl } from '../../../shared/api.service';

@Injectable()
export class AuthenticationService {
  constructor(private http: Http) { }

  public login(userName: string, password: string): Promise<ObjectResponseModel<Token>> {
    let obj = {
      userName: userName,
      password: password
    }
    let promise = this.http
      .post(ApiUrl.LOGIN_URI + 'login', obj)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<Token>>(promise);
  }

  public changeLab(labId: number): Promise<ObjectResponseModel<Token>> {
    let obj = { LabId: labId }
    let promise = this.http
      .post(ApiUrl.LOGIN_URI + 'switchLabLogin', obj)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<Token>>(promise);
  }

  public changeUserPassword(password): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LOGIN_URI + 'user/changePassword/' + password)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  public changeSuperUserPassword(password, userId): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LOGIN_URI + 'user/changePassword/' + password + '/' + userId)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }



  public emailVerification(email): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LOGIN_URI + 'emailVerification/' + email)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  public ResetPassword(userId, password): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LOGIN_URI + 'resetPassword/' + userId + '/' + password)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

  public CheckToken(token): Promise<ObjectResponseModel<any>> {
    let promise = this.http
      .get(ApiUrl.LOGIN_URI + 'checkToken/' + token)
      .toPromise();
    return new PromiseHandler<ObjectResponseModel<any>>(promise);
  }

}
