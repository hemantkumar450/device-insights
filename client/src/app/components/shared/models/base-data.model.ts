
export class BaseDataModel<T> {
  Data: T[] = new Array<T>();
  TotalRecords: number = 0;
}

export class BaseResponseModel<T> {
  status: number = 0;
  statusText: string;
  successful: boolean = false;
}

export class ArrayResponseModel<T> extends BaseResponseModel<T> {
  data: T[] = new Array<T>();
  constructor() {
    super();
  }
}

export class ObjectResponseModel<T> extends BaseResponseModel<T> {
  data: T = {} as T;
  constructor() {
    super();
  }
}

export class PostObjectResponseModel<T> extends ObjectResponseModel<T> {
  ValidatonResult: ValidationResult = new ValidationResult();
  constructor() {
    super();
  }
}


export class ValidationResult {
  validationErrors: ValidationErrors[] = new Array<ValidationErrors>();
}

export class ValidationErrors {
  errorMessage: string = '';
  memberNames: string[] = new Array<string>();
  errorCode: number = 0;
}




export class PromiseHandler<T> extends Promise<BaseResponseModel<T>>  {
  constructor(promise: Promise<any>) {
    super((resolve, reject) => {
      if (!promise) { return; }
      promise.then(res => {
        let returnValue: BaseResponseModel<T> = {} as BaseResponseModel<T>;

        if (res.status === 200) {
          let data = res.json() as T[];

          if (data) {
            (returnValue as ArrayResponseModel<T>).data = data;
          } else {
            let dataObject = res.json() as T;
            (returnValue as ObjectResponseModel<T>).data = dataObject;
          }
          returnValue.successful = true;
          resolve(returnValue);
        }

        if (res.status !== 200) {
          returnValue.status = res.status;
          returnValue.statusText = (res as any)._body;
          try {
            let validationResult = res.json() as ValidationResult;
            if (validationResult) {
              (returnValue as PostObjectResponseModel<T>).ValidatonResult = validationResult;
            }
          } catch (ex) {

          }
          reject(returnValue);
        }

      })
      promise.catch(err => {
        let returnValue: PostObjectResponseModel<T> = new PostObjectResponseModel<T>();
        returnValue.status = err.status;
        returnValue.statusText = (err as any)._body;
        try {
          let validationResult = err.json() as ValidationResult;
          if (validationResult) {
            (returnValue as PostObjectResponseModel<T>).ValidatonResult = validationResult;
          }
        } catch (ex) {

        }
        reject(returnValue);
      })
    })
  }
}

export class DeletePromiseHandler<T> extends Promise<BaseResponseModel<T>>  {
  constructor(promise: Promise<any>) {
    super((resolve, reject) => {
      if (!promise) { return; }
      promise.then(res => {
        let returnValue: BaseResponseModel<T> = {} as BaseResponseModel<T>;

        if (res.status === 200) {
          let data = res as T[];
          if (data) {
            (returnValue as ArrayResponseModel<T>).data = data;
          } else {
            let dataObject = res.json() as T;
            if (dataObject) {
              (returnValue as ObjectResponseModel<T>).data = dataObject;
            }
          }
          returnValue.successful = true;
          resolve(returnValue);
        }

        if (res.status !== 200) {
          returnValue.status = res.status;
          returnValue.statusText = (res as any)._body;
          try {
            let validationResult = res.json() as ValidationResult;
            if (validationResult) {
              (returnValue as PostObjectResponseModel<T>).ValidatonResult = validationResult;
            }
          } catch (ex) {

          }
          reject(returnValue);
        }

      })
      promise.catch(err => {
        let returnValue: PostObjectResponseModel<T> = new PostObjectResponseModel<T>();
        returnValue.status = err.status;
        returnValue.statusText = (err as any)._body;
        try {
          let validationResult = err.json() as ValidationResult;
          if (validationResult) {
            (returnValue as PostObjectResponseModel<T>).ValidatonResult = validationResult;
          }
        } catch (ex) {

        }
        reject(returnValue);
      })
    })
  }
}
