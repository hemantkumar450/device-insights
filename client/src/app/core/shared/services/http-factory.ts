import { Router } from '@angular/router';
import { XHRBackend, Http, RequestOptions } from '@angular/http';
import { HttpInterceptor } from './http-interceptor.service';
import { ApiUrl } from '../../../shared/api.service';
import { LoaderService } from '../../loader/loader.service';
import { ErrorService } from '../../error/error.service';
import { LocalStorageService } from './local-storage.service';

export function httpFactory(xhrBackend: XHRBackend,
  requestOptions: RequestOptions,
  apiService: ApiUrl,
  router: Router,
  loaderService: LoaderService,
  errorService: ErrorService,
  localStorageService: LocalStorageService): Http {
  return new HttpInterceptor(xhrBackend, requestOptions, apiService, router, loaderService, errorService, localStorageService);
}
