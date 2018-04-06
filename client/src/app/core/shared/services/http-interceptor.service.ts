import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ApiUrl } from '../../../shared/api.service';
import { LoaderService } from '../../loader/loader.service';
import { ErrorService } from '../../error/error.service';
import { LocalStorageService } from './local-storage.service';
import { ErrorModel } from '../../error/error.model';

@Injectable()
export class HttpInterceptor extends Http {
  error: ErrorModel = new ErrorModel();
  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private apiService: ApiUrl,
    private router: Router,
    private loaderService: LoaderService,
    private errorService: ErrorService,
    private localStorageService: LocalStorageService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
    // return super.request(url, options);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
    // return super.get(url, this.getRequestOptionArgs(options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    // return super.post(url, body, this.getRequestOptionArgs(options));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    // return super.put(url, body, this.getRequestOptionArgs(options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, this.getRequestOptionArgs(options)));
    // return super.delete(url, this.getRequestOptionArgs(options));
  }


  private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');

    let access_token = this.localStorageService.getAccessToken();
    if (access_token !== '') {
      options.headers.append('authorization', access_token);
    }

    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {

    return observable.catch((err, source) => {
      this.error.isError = true;
      this.error.errorMessages = [];
      if (err.status === 401) {                     // UnOthorised Access
        this.localStorageService.removeLogin();
        this.router.navigate(['/login']);
        this.loaderService.hide();
        return Observable.throw(err);
      } else if (err.status === 0) {                // Api Connection Refused
        this.showErrorMessage('Server down!');
        this.loaderService.hide();
        return Observable.throw(err);
      } else if (err.status === 404) {              // API path not found
        // this.showErrorMessage('404 (Path not found!)');
        this.loaderService.hide();
        return Observable.throw(err);
      } else if (err.status === 400) {
        if (err._body) {
          this.showErrorMessage(err._body);
        } else {
          this.showErrorMessage('400 (Bad Request)');
        }
        this.loaderService.hide();
        return Observable.throw(err);
      } else if (err.status === 500) {
        if (err._body) {
          this.showErrorMessage(err._body);
        } else {           // Internal Server error
          this.showErrorMessage('500 (Internal Server error)');
        }
        this.loaderService.hide();
        return Observable.throw(err);
      } else {
        this.loaderService.hide();
        return Observable.throw(err);
      }
    })
      .finally(() => {
        // this.loaderService.hide();
      });
  }

  private showErrorMessage(errorMessage) {
    this.error.errorMessages.push({ severity: 'error', summary: '', detail: errorMessage });
    this.errorService.sendErrorMessage(this.error);
  }
}
