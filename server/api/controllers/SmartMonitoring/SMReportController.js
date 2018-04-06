
let SMReportController = {};
let moment = require('moment');
let moduleNames = moduleService.getModules();
let path = require('path');
let jsreport = require('jsreport-core')({});
let blobService = azureStorage.getBlobService();
let fs = require('fs')
let pdf = require('dynamic-html-pdf');
let Promise = require("bluebird");

let DefaultSensor = {
  Humidity: 102,
  Temperature: 103
}



let blobSvc = azureStorage.getBlobService();
let container = ''; //It should Be LAB_ID

SMReportController.generateReport = (req, res) => {

  let START_DATE = req.param('startDate');
  START_DATE = new Date(START_DATE).toISOString().slice(0, 10);
  let END_DATE = req.param('endDate');
  END_DATE = new Date(END_DATE).toISOString().slice(0, 10);
  let isHumidityPDF = false;

  let LAB_ID = '';
  req.token.user.LabIds.forEach(id => {
    LAB_ID += id + ',';
  });
  if (LAB_ID.charAt(LAB_ID.length - 1) == ',') {
    LAB_ID = LAB_ID.substr(0, LAB_ID.length - 1);
  }

  let promisifiedProduct = Promise.promisifyAll(SmartLabSensorReading)
  let humidityQuery = promisifiedProduct.queryAsync("EXEC spGetSMReportGeneration '" + START_DATE + "','" + END_DATE + "'," + LAB_ID + ',' + DefaultSensor.Humidity);
  let temperatureQuery = promisifiedProduct.queryAsync("EXEC spGetSMReportGeneration '" + START_DATE + "','" + END_DATE + "'," + LAB_ID + ',' + DefaultSensor.Temperature);
  let labDataQuery = Lab.findOne({ LAB_ID: LAB_ID });

  let retriever = Promise.all([humidityQuery, temperatureQuery, labDataQuery])

  retriever.then(results => {
    let array = [];
    results.forEach((result, index) => {
      if (result.length > 0) {
        if (index === 0) {
          isHumidityPDF = true;
        }
        result.forEach(function (element) {
          let obj = { LocationName: '', Year: 0, Month: 0, Days: [] };
          obj.LocationName = element.LOCATION_NAME;
          obj.Year = element.YEARNO;
          obj.Month = element.MONTHNO;
          delete element.LOCATION_NAME;
          delete element.YEARNO;
          delete element.MONTHNO;
          var result = Object.keys(element).map((k) => {
            return element[k];
          });
          obj.Days = result;
          array.splice(array.length, 0, obj);
        }, this);
      }
    });
    if (array.length === 0) {
      return res.status(400).send('Can not create a PDF file,due to lack of Device Reading!');
    }

    let date1 = new Date(req.param('startDate'));
    let date2 = new Date(req.param('endDate'));
    let monthDiff = date2.getMonth() - date1.getMonth();

    let content = '<!DOCTYPE html>'
    content += '<html>'
    content += '<head>'
    content += '<style>table, th, td {border: 1px solid black;font-family: monospace;}</style>';
    content += '<title>Page Title</title>';
    content += '</head>';
    content += '<body>  <p> Lab: ' + results[2].LAB_NAME + '</p>  <p>Address: ' + results[2].ADDR + '</p>';

    for (let arrindex = 0; arrindex < array.length; arrindex++) {

      if ((arrindex === 0) && isHumidityPDF) {
        content += '<p> Humidity Log</p>';
      } else {
        content += '<p> Temperature Log</p>';
      }
      let monthName = getMonthName(array[arrindex].Month);
      content += '<div><p style="float: left"> Month:  ' + monthName + '</p>';
      content += '<p style="margin-left: 30%;padding-top: 2%"> Year:  ' + array[arrindex].Year + '</p><br>';

      content += ' <table style="text-align: center;;width: 50%">';
      content += '<tr>';
      for (var i = 0; i <= 31; i++) {
        if (i === 0) {
          content += '<th>Daily</th>';
        } else {
          content += '<th >' + i + '</th>';
        }
      }
      content += '</tr>';
      content += '<tr>';
      content += '<td>' + array[arrindex].LocationName + '</td>';
      array[arrindex].Days.forEach(day => {
        if (day) {
          content += '<td>' + day + '</td>';
        } else {
          content += '<td>' + '-' + '</td>';
        }
      });
      content += '</tr>';
      content += ''
      content += '</table></div><br>'
    }


    content += '<p>Comments:</p>'
    content += '<p style="float: left">Reviewed by: </p>'
    content += '<p style="float: left;margin-left: 30%"> Date:</p>'
    content += '</body>'
    content += '</html>';
    let pdfReportPath = '../assets/pdfFiles/';
    let pdfName = '_' + Math.random().toString(36).substr(2, 9);
    pdfReportPath += pdfName + '.pdf';

    var options = {
      format: "A3",
      orientation: "landscape",
      border: "10mm"
    };

    var document = {
      template: content,
      context: {
        user: 'User'
      },
      path: '../server/assets/pdfFiles/' + pdfName + '.pdf'
    };

    pdf.create(document, options).then(pdfObj => {
      var YYYYY = moment().format('YYYY');
      var MM = moment().format('MM');
      var fileName = moment().format('YYYYMMDDHHmmss');
      var blobPath = moduleNames.SmartLabMonitoring + '/' + 'Reports/' + YYYYY + '/' + MM + '/' + fileName + '.pdf';
      let container = 'lab' + LAB_ID;

      let url = __dirname.split('api');
      url = url[0].replace(/\\/g, "/");;
      let pdfReportPath = url + "assets/pdfFiles/" + pdfName + '.pdf';
      blobSvc.createBlockBlobFromLocalFile(container, blobPath, pdfReportPath, (err, result, response) => {
        if (err) {
          fs.unlink(pdfReportPath, (err) => { });
          return res.status(500).send('Error in serving request.');
        } else {
          fs.unlink(pdfReportPath, (err) => { });
          let ChangeDate = moment().format('MM/DD/YYYY');;
          let DocLink = azureStorage.azureStorageLink() + container + '/' + blobPath;
          let smSensorQuery = Promise.promisify(SmartLabSensor.query);
          let querySaveReport = "EXEC spSaveSMReport " + LAB_ID + ",'" + START_DATE + "','" + END_DATE + "','" + DocLink + "'";
          smSensorQuery(querySaveReport).then(data => {
            res.json(null);
          }).catch(error => {
            if (error) return res.status(500).send('Error in serving request.');
          });
        }
      });
    }).catch(error => {
      console.error(error)
    });
  }).catch(error => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}


SMReportController.getReports = (req, res) => {
  let LAB_ID = '';
  req.token.user.LabIds.forEach(id => {
    LAB_ID += id + ',';
  });
  if (LAB_ID.charAt(LAB_ID.length - 1) == ',') {
    LAB_ID = LAB_ID.substr(0, LAB_ID.length - 1);
  }

  let query = 'EXEC spGetSMReport ' + LAB_ID;
  let smSensorQuery = Promise.promisify(SmartLabSensor.query);
  smSensorQuery(query).then(lab => {
    res.json(lab);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMReportController.deleteSMReportPdf = (req, res) => {
  let labId = req.param('labId');
  let reportId = req.param('reportId');

  SMReading.findOne({ LAB_ID: labId, REPORT_ID: reportId }).then(reportObj => {
    var remaining = reportObj.REPORT_LINK.substr(8);
    var ind = remaining.indexOf("/");
    remaining = remaining.substr(ind + 1);
    ind = remaining.indexOf("/");
    var container = remaining.substr(0, ind);
    var blob = remaining.substr(ind);

    blobService.deleteBlob(container, '.' + blob, (err, response) => {
      if (err) return res.status(500).send('Error in serving request.');
      let smSensorQuery = Promise.promisify(SmartLabSensor.query);
      let query = 'EXEC spDeleteSMReport ' + labId + ',' + reportId;
      smSensorQuery(query).then((locations) => {
        res.json(null);
      }).catch(error => {
        if (error) return res.status(500).send('Error in serving request.');
      });
    });
  });
}

function getMonthName(month) {
  let monthName = '';
  switch (month) {
    case 1:
      return monthName = 'January';
    case 2:
      return monthName = 'february';
    case 3:
      return monthName = 'March';
    case 4:
      return monthName = 'April';
    case 5:
      return monthName = 'May';
    case 6:
      return monthName = 'June';
    case 7:
      return monthName = 'July';
    case 8:
      return monthName = 'August';
    case 9:
      return monthName = 'September';
    case 10:
      return monthName = 'october';
    case 11:
      return monthName = 'November';
    case 12:
      return monthName = 'December';
  }

}

module.exports = SMReportController;
