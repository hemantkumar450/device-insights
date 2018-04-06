let IMReportController = {};
let Promise = require("bluebird");
var pdf = require('dynamic-html-pdf');
let moment = require('moment');
let moduleNames = moduleService.getModules();
let blobSvc = azureStorage.getBlobService();
let fs = require('fs');

IMReportController.generateReport = (req, res) => {

    let body = req.body;
    let MONTH = body.MONTH_NAME;
    let itemArray = null;

    let imChecklistQuery = Promise.promisify(IMChecklist.query);

    let query = 'EXEC spGetIMChecklist ' + body.LAB_ID + ','
        + body.INSTR_ID + ','
        + body.FREQ_ID;

    imChecklistQuery(query).then((data) => {
        if (data) {
            IMItem.find({ FREQ_ID: body.FREQ_ID, INSTR_ID: body.INSTR_ID }).then(item => {
                itemArray = item;
                var content = '<!DOCTYPE html>'
                content += '<html>'
                content += '<head>'
                content += '<style>table, th, td {border: 1px solid black;font-family: monospace;}</style>';
                content += '<title>Page Title</title>';
                content += '</head>';
                content += '<body>';
                content += "<p style='text-align: center;font-weight: 600;font-size: xx-large;'>" + body.FREQ_NAME + ' Maintenance</p>';
                content += '<div style="float:left;padding-right:200px">' +
                    '<div style="float:left;padding-right:5px"> Month: </div>' +
                    '<div style="float:left;">' + MONTH + '</div> </div>';
                content += '<div style="float:left;padding-right:200px">' +
                    '<div style="float:left;padding-right:5px"> Year: </div>' +
                    '<div style="float:left;">' + body.YEAR + '</div> </div>';
                content += '<div style="float:left;padding-right:200px">' +
                    '<div style="float:left;padding-right:5px"> Instrument: </div>' +
                    '<div style="float:left;">' + body.INSTR_NAME + '</div> </div>';
                content += '<br><br><br>';
                content += '<table style="text-align: center;;width: 50%">';
                content += '<tr>';
                let isColCreated = false;
                data.forEach(element => {
                    let colArray = Object.getOwnPropertyNames(element).sort();
                    if (!isColCreated) {
                        itemArray.forEach((item, index) => {
                            colArray.forEach(col => {
                                if (col === item.ITEM_NAME) {
                                    content += '<th>' + col + '</th>'
                                }
                            });
                            if (itemArray.length === index + 1) {
                                content += '<th>  REVIEWED BY </th>'
                            }
                        });
                        content += '</tr>'
                        isColCreated = true;
                    }
                });
                content += '<tr>';
                data.forEach(element => {
                    let colArray = Object.getOwnPropertyNames(element).sort();
                    itemArray.forEach((item, index) => {
                        colArray.forEach(col => {
                            if (col === item.ITEM_NAME) {
                                if (element[col] === 'true') {
                                    content += '<td>Yes</td>'
                                } else if (element[col] === 'false') {
                                    content += '<td>No</td>'
                                } else {
                                    content += '<td>' + element[col] + '</td>'
                                }
                            }
                        });
                        if (itemArray.length === index + 1) {
                            content += '<th>' + element.REVIEWED_BY + '</th>'
                        }
                    });
                    content += '</tr>'
                });
                content += ' </table>';
                content += ' <br>';
                content += '<div>' + '<p>Corrective Action for Instrument Out of Service: </p>' + '</div >'
                content += '<div>' + '<p>Reviewed By Lab Personnel: _______________________________ </p>' + '</div >'
                content += '<div>' + '<p>Reviewed By Lab Director: _______________________________ ' + '</div >'
                content += '</body>'
                content += '</html>';
                let pdfName = '_' + Math.random().toString(36).substr(2, 9);
                let pdfReportPath = '../assets/pdfFiles/';
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

                pdf.create(document, options).then(result => {
                    var fileName = body.LAB_ID + '_' + body.INSTR_ID + '_' + body.FREQ_ID;
                    var blobPath = moduleNames.SmartMaintenance + '/' + 'Reports/' + body.YEAR + '/' + body.MONTH + '/' + fileName + '.pdf';
                    let container = 'lab' + body.LAB_ID;

                    let url = __dirname.split('api');
                    url = url[0].replace(/\\/g, "/");;
                    let pdfReportPath = url + "assets/pdfFiles/" + pdfName + '.pdf';
                    blobSvc.createBlockBlobFromLocalFile(container, blobPath, pdfReportPath, (err, result, response) => {
                        if (err) {
                            fs.unlink(pdfReportPath, (err) => { });
                            return res.status(500).send('Error in serving request.');
                        } else {
                            fs.unlink(pdfReportPath, (err) => { });
                            let DocLink = azureStorage.azureStorageLink() + container + '/' + blobPath;
                            let query = 'EXEC spSaveIMReport ' + body.LAB_ID + ','
                                + body.INSTR_ID + ','
                                + body.FREQ_ID + ",'"
                                + DocLink + "'";
                            let imReportQuery = Promise.promisify(IMReport.query);
                            imReportQuery(query).then(report => {
                                res.json(null);
                            }).catch((error) => {
                                if (error) return res.status(500).send('Error in serving request.');
                            });
                        }
                    });
                }).catch(error => {
                    if (error) return res.status(500).send('Error in serving request.');
                });
            });
        }
        else {
            return res.status(400).send('Can not create a PDF file,due to lack of Checklists!');
        }
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

function getItems() {

}

IMReportController.getReports = (req, res) => {
    let LAB_ID = '';
    req.token.user.LabIds.forEach(id => {
        LAB_ID += id + ',';
    });
    if (LAB_ID.charAt(LAB_ID.length - 1) == ',') {
        LAB_ID = LAB_ID.substr(0, LAB_ID.length - 1);
    }
    let query = 'EXEC spGetIMReport ' + req.query.StartPageNo + ','
        + LAB_ID;

    let imReportQuery = Promise.promisify(IMReport.query);

    imReportQuery(query).then((report) => {
        let obj = {
            Data: report,
            TotalRecords: report.length === 0 ? 0 : report[0].TOTALCOUNT
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

module.exports = IMReportController;