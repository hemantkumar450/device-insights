let QCMethodController = {};
let Promise = require("bluebird");


QCMethodController.getQualityControlMethods = (req, res) => {
    let INSTRUMENT_ID = req.param('instrumentId');
    getLabIds(req.token.user.LabIds).then(labId => {
        let filterObj = { METHOD_NAME: '' };
        filterObj.METHOD_NAME = req.query['Filter.METHOD_NAME'] === undefined ? '' : req.query['Filter.METHOD_NAME'];

        let query = 'EXEC spGetQCMethods ' + req.query.StartPageNo + ',' + labId + ",'" + filterObj.METHOD_NAME + "'," + INSTRUMENT_ID;
        let qcMethodQuery = Promise.promisify(QCMethod.query);
        qcMethodQuery(query).then(methods => {
            let obj = {
                Data: methods,
                TotalRecords: methods.length === 0 ? 0 : methods[0].TOTALCOUNT
            }
            res.json(obj);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

QCMethodController.saveQCMethod = (req, res) => {
    let method = req.body;
    let labId = '';
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = 'EXEC spSaveQCMethod ' + method.METHOD_ID + ",'"
            + method.METHOD_NAME + "',"
            + labId + ','
            + method.INSTRUMENT_ID;
        let qcMethodQuery = Promise.promisify(QCMethod.query);
        qcMethodQuery(query).then(methods => {
            res.json('saved successfully');
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

QCMethodController.deleteQCMethod = (req, res) => {
    let COMP_ID = req.param('id');
    let query = 'EXEC spDeleteQCMethodById ' + COMP_ID;
    let qcMethodQuery = Promise.promisify(QCMethod.query);
    qcMethodQuery(query).then(methods => {
        res.json('deleted successfully');
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}


QCMethodController.compoundMethodDDOByInstrumentId = (req, res) => {
    let labId = req.param('labId');
    let instrumentId = req.param('instrumentId');
    QCMethod.find({ LAB_ID: labId, INSTRUMENT_ID: instrumentId }).then(result => {
        res.json(result);
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

module.exports = QCMethodController;
