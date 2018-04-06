export class ApiUrl {
  
    static prodMode = 'PM';
    static QAMode = 'QM';
    static devMode = 'DM';
    
    static env = ApiUrl.devMode // Change  mode here

    static get endpoint() {
      var url;

      if(ApiUrl.env === ApiUrl.prodMode){//checks prod
        url = 'https://deviceinsights.azurewebsites.net/';
      }

      else if(ApiUrl.env === ApiUrl.QAMode){//checks QAMode
        url = 'https://qadeviceinsights.azurewebsites.net/';
      }

      else if(ApiUrl.env === ApiUrl.devMode){//checks devMode
        var port='4337',
            uri = 'http://localhost:';
        url = uri + port + '/';
      }
      return url;
    }

    static endPointPath = ApiUrl.endpoint;

    static LOGIN_URI = ApiUrl.endPointPath;
    static LAB_URI =  ApiUrl.endPointPath;
    static USER_URI =  ApiUrl.endPointPath;
    static MASTER_URI =  ApiUrl.endPointPath;
    static SMART_LAB_URI =  ApiUrl.endPointPath;
  
    // static localUrl = 'http://localhost';
    // // static serverUrl = 'https://deviceinsights.azurewebsites.net/'
    // static localPort= ':4337/';
    // static serverPort= '';
    // static serverUrl = 'http://96.11.225.222:3000/';

    // static baseUrl: string = ApiUrl.prodMode === true ? ApiUrl.serverUrl : ApiUrl.localUrl;
    // static basePort: string = ApiUrl.prodMode === true ? ApiUrl.serverPort : ApiUrl.localPort;
  
    // static LOGIN_URI = ApiUrl.baseUrl + ApiUrl.basePort;
    // static LAB_URI = ApiUrl.baseUrl + ApiUrl.basePort;
    // static USER_URI = ApiUrl.baseUrl + ApiUrl.basePort;
    // static MASTER_URI = ApiUrl.baseUrl + ApiUrl.basePort;
    // static SMART_LAB_URI = ApiUrl.baseUrl + ApiUrl.basePort;
  
  }

