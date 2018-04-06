let qcAdjMeanController = {};
let Promise = require("bluebird");
let isServerResponseSend = false;

qcAdjMeanController.saveAdjMeanSD = (req, res) => {
    isServerResponseSend = false;
    let adjMean = req.body;

    let query = "EXEC spSaveQualityControlAdjMean " + adjMean.labId + ',' +
        adjMean.instrumentId + ',' +
        adjMean.compoundId + ',' +
        adjMean.methodId + ',' +
        adjMean.monthId + ',' +
        adjMean.yearId + ',' +
        adjMean.adjMean + ',' +
        adjMean.adjSD;

    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
        if (!isServerResponseSend) {
            isServerResponseSend = true;
            res.json(null);
        }
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcAdjMeanController.getAdjMeanSD = (req, res) => {
    let query = req.query;
    if (query.compoundId === "All") {
        query.compoundId = 0;
    }
    if (query.methodId === "All") {
        query.methodId = 0;
    }
    let filterObj = { labId: 0, compoundId: 0, instrumentId: 0, methodId: 0, monthId: 0, yearId: 0, pageNo: 0 };

    filterObj.pageNo = req.query['pageNo'] === undefined ? 1 : req.query['pageNo'];
    filterObj.labId = req.query['labId'] === undefined ? 0 : req.query['labId'];
    filterObj.compoundId = req.query['compoundId'] === undefined ? 0 : req.query['compoundId'];
    filterObj.instrumentId = req.query['instrumentId'] === undefined ? 0 : req.query['instrumentId'];
    filterObj.methodId = req.query['methodId'] === undefined ? 0 : req.query['methodId'];
    filterObj.monthId = req.query['monthId'] === undefined ? 0 : req.query['monthId'];
    filterObj.yearId = req.query['yearId'] === undefined ? 0 : req.query['yearId'];

    let sdMeanquery = "EXEC spGetAdjMeanSD " + filterObj.pageNo + ','
        + filterObj.labId + ','
        + filterObj.instrumentId + ','
        + filterObj.compoundId + ','
        + filterObj.methodId + ','
        + filterObj.monthId + ','
        + filterObj.yearId;

    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(sdMeanquery).then(result => {
        res.json(result);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcAdjMeanController.getAdjMeanYearDDO = (req, res) => {
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = 'select distinct [YEAR] from QC_ADJ_MEAN_STD where LAB_ID=' + labId + ' order by [YEAR] desc';
        let qualityControlQuery = Promise.promisify(QualityControl.query);
        qualityControlQuery(query).then(result => {
            res.json(result);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

qcAdjMeanController.getAdjMeanMonthDDO = (req, res) => {
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = 'select distinct [MONTH] from QC_ADJ_MEAN_STD where LAB_ID=' + labId + ' order by [MONTH] desc';
        let qualityControlQuery = Promise.promisify(QualityControl.query);
        qualityControlQuery(query).then(result => {
            res.json(result);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
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


module.exports = qcAdjMeanController;