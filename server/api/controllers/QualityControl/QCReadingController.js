let qcReadingController = {};
let Promise = require("bluebird");

let insertedRowValue = 0;
let queueList = [];
let alreadyReading = false;

qcReadingController.callResultInQueueList = () => {
    qcReadingController.addResultInQueueList();
    try {
        setInterval(() => {
            qcReadingController.addResultInQueueList();
        }, 40000);
    } catch (e) {
        console.error(e);
    }
}

qcReadingController.addResultInQueueList = () => {
    let query = 'EXEC spInsertQualityControlResultData ';
    QualityControl.query(query, (err, result) => {
    });
}

qcReadingController.saveQualityControlJson = (req, res) => {
    let qualityControl;
    if (req.body) {
        qualityControl = req.body;
    } else {
        res.json('wrong Param passed.Should use Data as param and pass json object');
    }
    Lab.findOne({ LAB_ID: qualityControl.labId }).then((lab) => {
        if (lab) {
            let query = "EXEC spSaveQCResultJson '" + JSON.stringify(qualityControl) + "'";
            let qualityControlQuery = Promise.promisify(QualityControl.query);
            qualityControlQuery(query).then(result => {
                if (result[0].ISERROR > 0) {
                    if (result[0].ISERROR === 1) {
                        res.json('Data is not in correct format.Please review it & send it again');
                    } else if (result[0].ISERROR === 2) {
                        res.json('Data can not be saved because this month is already approved');
                    }

                } else {
                    res.json('data saved successfully');
                }
            }).catch((error) => {
                if (error) return res.status(500).send('Error in serving request.');
            });
        } else {
            res.json('Lab is not exists');
        }
    }).catch((error) => {
        console.log(error);
    });
}

qcReadingController.getCompoundByLabAndInstrument = (req, res) => {
    let labId = req.param('labId');
    let instrumentId = req.param('instrumentId');
    let query = 'EXEC spGetCompoundByLabAndInstrument ' + labId + ',' + instrumentId;
    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
        let newData = {};
        result.forEach((item, index) => {
            newData[item.COMP_NAME] = item.COMP_ID;
        })
        res.json(newData);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcReadingController.getMethodByLabAndInstrument = (req, res) => {
    let labId = req.param('labId');
    let instrumentId = req.param('instrumentId');
    let query = 'EXEC spGetMethodByLabAndInstrument ' + labId + ',' + instrumentId;

    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
        let newData = {};
        result.forEach(item => {
            newData[item.METHOD_NAME] = item.METHOD_ID;
        });
        res.json(newData);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

module.exports = qcReadingController;
