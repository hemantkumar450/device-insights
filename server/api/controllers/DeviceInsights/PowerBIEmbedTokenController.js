let qs = require("querystring");
let accesstoken = powerBIEmbedTokenService.getAccessToken();
let http = require("https");
let Promise = require("bluebird");

let powerBIEmbedTokenController = {};

powerBIEmbedTokenController.getEmbedTokenForPowerBi = (request, response) => {
  let labId = request.param('labId');
  let moduleId = request.param('moduleId');
  let groupid = null;
  let reportid = null;
  let viewName = null;

  let moduleQuery = Promise.promisify(Module.query);
  let query = 'EXEC spGetPowerBIReport ' + labId + ',' + moduleId;

  moduleQuery(query).then((powerBIReport) => {
    if (powerBIReport.length !== 0) {
      groupid = powerBIReport[0].GROUP_ID;
      reportid = powerBIReport[0].REPORT_ID;
      viewName = powerBIReport[0].VIEW_NAME;
      let accesstoken = powerBIEmbedTokenService.getToken();
      let options = {
        "method": "POST",
        "hostname": "api.powerbi.com",
        "port": null,
        "path": "/v1.0/myorg/groups/" + groupid + "/reports/" + reportid + "/GenerateToken",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
          "authorization": "Bearer " + accesstoken
        }
      };

      let req = http.request(options, (res) => {
        if (res.statusCode !== 200) {
          console.log('got in callback error');
        };
        let chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          let body = Buffer.concat(chunks);
          var token='';
          try {
            token = JSON.parse(body.toString()).token
          }catch(e){
            return res.status(500).send('Powerbi token error.');
          }
          let obj = {
            groupId: groupid,
            reportId: reportid,
            viewName: viewName,
            token: token
          }
          response.json(obj);
          req.end();
        });
      }).on('error', err => {
        req.abort();
      });

      let rls = {
        "accessLevel": "View"
      }
      req.write(qs.stringify(rls));
      req.end();
    } else {
      response.json(null);
    }
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

module.exports = powerBIEmbedTokenController;
