let qcBatchController = {};
let blobService = azureStorage.getBlobService();
let Promise = require("bluebird");
let moduleNames = moduleService.getModules();
let fs = require('fs')


qcBatchController.getQualityControlBatches = (req, res) => {
    let MONTH = req.param('monthId')
    let YEAR = req.param('yearId');
    let DAY = req.param('dayId');
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = 'EXEC spGetQCResultBatchDDO ' + labId + ','
            + MONTH + ','
            + YEAR + ','
            + DAY;
        let qualityControlQuery = Promise.promisify(QualityControl.query);
        qualityControlQuery(query).then(result => {
            res.json(result);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

qcBatchController.deleteQCResultByBatch = (req, res) => {
    let labId = '';
    let BATCH_ID = req.param('batchId');
    let MONTH = req.param('monthId');
    let YEAR = req.param('yearId');
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = "EXEC spDeleteQCResultByBatch '" + BATCH_ID + "',"
            + labId + ','
            + MONTH + ','
            + YEAR;

        let qualityControlQuery = Promise.promisify(QualityControl.query);
        qualityControlQuery(query).then(result => {
            res.json(null);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

qcBatchController.updateBatchStatus = (req, res) => {
    let obj = req.body;

    let query = "EXEC spSaveQCResultStatusByBatch " + obj.LAB_ID + ',' +
        obj.INSTRUMENT_ID + ',' +
        obj.COMP_ID + ',' +
        obj.MONTH + ',' +
        obj.YEAR + ",'" +
        obj.BATCH_ID + "'";

    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
        res.json(null);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });

}

qcBatchController.reviewBatch = (req, res) => {
    let obj = req.body;
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = 'EXEC spSaveQCBatchReview ' + labId + ','
            + obj.INSTRUMENT_ID + ",'"
            + obj.BATCH_ID + "',"
            + obj.USER_ID + ",'"
            + obj.COMMENT + "'";

        let qualityControlQuery = Promise.promisify(QualityControl.query);
        qualityControlQuery(query).then(result => {
            res.json(null);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

qcBatchController.reviewBatchByMonth = (req, res) => {
    let obj = req.body;
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = 'EXEC spSaveQCBatchReviewByMonth ' + labId + ','
            + obj.INSTRUMENT_ID + ','
            + obj.MONTH + ','
            + obj.YEAR + ','
            + obj.USER_ID + ','
            + null;
        let qualityControlQuery = Promise.promisify(QualityControl.query);
        qualityControlQuery(query).then(result => {
            res.json(result[0].Id);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

qcBatchController.getReviewBatchByMonth = (req, res) => {
    let labId = req.param('labId');
    let instrumentId = req.param('instrumentId');
    let yearId = req.param('yearId');
    let query = 'EXEC spGetQCBatchReviewByMonth ' + labId + ','
        + instrumentId + ','
        + yearId;

    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
        res.json(result);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcBatchController.saveReviewBatchByMonth = (req, res) => {
    let obj = req.body;

    let query = "EXEC spUpdateQCBatchReviewByMonth " + obj.LAB_ID + ',' +
        obj.INSTRUMENT_ID + ',' +
        obj.MONTH + ',' +
        obj.YEAR + ',' +
        obj.USER_ID + ','
        + null;

    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
        res.json(null);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcBatchController.deleteReviewBatchByMonth = (req, res) => {
    let labId = req.param('labId');
    let instrumentId = req.param('instrumentId');
    let monthId = req.param('monthId');
    let yearId = req.param('yearId');

    QCBatchMonthReview.findOne({
        LAB_ID: labId,
        INSTRUMENT_ID: instrumentId,
        MONTH: monthId,
        YEAR: yearId
    }).then(monthReviewRow => {
        if (monthReviewRow.DOCUMENT_URL) {
            var remaining = monthReviewRow.DOCUMENT_URL.substr(8);
            var ind = remaining.indexOf("/");
            remaining = remaining.substr(ind + 1);
            ind = remaining.indexOf("/");
            var container = remaining.substr(0, ind);
            var blob = remaining.substr(ind);

            blobService.deleteBlob(container, '.' + blob, function (err, response) {
                if (err) return res.status(500).send('Error in serving request.');
                deleteBatchByMonth(labId, instrumentId, monthId, yearId, res)
            });
        } else {
            deleteBatchByMonth(labId, instrumentId, monthId, yearId, res)
        }
    });
}

function deleteBatchByMonth(labId, instrumentId, monthId, yearId, res) {
    let query = 'EXEC spDeleteQCReviewBatchByMonth ' + labId + ','
        + instrumentId + ','
        + monthId + ','
        + yearId;
    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
        res.json(null);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcBatchController.uploadReviewBatchFile = (req, res) => {
    QCInstrument.findOne({ INSTRUMENT_ID: req.body.INSTRUMENT_ID }).then(instrumentObj => {
        let obj = req.body;
        let base64Image = obj.fileBase64.split(';base64,').pop();
        let uniqueFileName = '_' + Math.random().toString(36).substr(2, 9);
        var tempPath = 'assets/pdfFiles/' + uniqueFileName + '.pdf';
        fs.writeFile(tempPath, base64Image, { encoding: 'base64' }, (err) => {
            let container = 'lab' + req.token.user.LabIds[0];
            let module = moduleNames.QualityControl;
            let year = obj.YEAR;
            let month = obj.MONTH;
            let instrument = obj.INSTRUMENT_ID + instrumentObj.INSTRUMENT_NAME;
            let fileName = uniqueFileName + '.pdf';

            var blobPath = module + "/ReviewReports/" + instrument + '/' + year + '/' + month + '/' + fileName;

            blobService.createBlockBlobFromLocalFile(container, blobPath, tempPath, (error, result, response) => {
                if (!error) {
                    var DocLink = azureStorage.azureStorageLink() + container + '/' + blobPath;

                    let query = "EXEC spUpdateQCBatchReviewByMonth " + obj.LAB_ID + ','
                        + obj.INSTRUMENT_ID + ','
                        + obj.MONTH + ','
                        + obj.YEAR + ','
                        + null + ",'"
                        + DocLink + "'";

                    let qualityControlQuery = Promise.promisify(QualityControl.query);
                    qualityControlQuery(query).then(result => {
                        fs.unlink(tempPath, (err) => { });
                        res.json(null);
                    }).catch((error) => {
                        if (error) return res.status(500).send('Error in serving request.');
                    });
                } else {
                    return res.status(400).send('Failed');
                    fs.unlink(tempPath, (err) => { });
                }
            });
        });
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcBatchController.deleteReviewBatchFile = (req, res) => {
    let labId = req.param('labId');
    let instrumentId = req.param('instrumentId');
    let monthId = req.param('monthId');
    let yearId = req.param('yearId');

    QCBatchMonthReview.findOne({
        LAB_ID: labId,
        INSTRUMENT_ID: instrumentId,
        MONTH: monthId,
        YEAR: yearId
    }).then(batchMonthReview => {
        var remaining = batchMonthReview.DOCUMENT_URL.substr(8);
        var ind = remaining.indexOf("/");
        remaining = remaining.substr(ind + 1);
        ind = remaining.indexOf("/");
        var container = remaining.substr(0, ind);
        var blob = remaining.substr(ind);

        blobService.deleteBlob(container, '.' + blob, function (err, response) {
            if (!err) {
                let query = 'EXEC spDeleteQCReviewBatchFile ' + labId + ','
                    + instrumentId + ','
                    + monthId + ','
                    + yearId;

                let qualityControlQuery = Promise.promisify(QualityControl.query);
                qualityControlQuery(query).then(result => {
                    res.json(null);
                }).catch((error) => {
                    if (error) return res.status(500).send('Error in serving request.');
                });
            } else {
                return res.status(400).send('File not exists Or Error in deleting file from Azure storage ');
            }
        });
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcBatchController.updateReviewBatchStatus = (req, res) => {
    let body = req.body;
    let query = 'EXEC spUpdateQCReviewBatchStatus ' + body.LAB_ID + ','
        + body.INSTRUMENT_ID + ','
        + body.MONTH + ','
        + body.YEAR + ",'"
        + body.STATUS + "'";

    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
        res.json(null);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

function getLabIds(labIds) {
    return new Promise((resolve, reject) => {
        let labId = '';
        labIds.forEach(id => {
            labId += id + ',';
        });
        if (labId.charAt(labId.length - 1) == ',') {
            labId = labId.substr(0, labId.length - 1);
        }
        resolve(labId);
    });
}

module.exports = qcBatchController;