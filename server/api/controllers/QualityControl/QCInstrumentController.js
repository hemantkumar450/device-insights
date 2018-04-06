let QCInstrumentController = {};
let Promise = require("bluebird");

QCInstrumentController.getQualityControlInstrumentDDO = (req, res) => {
    getLabIds(req.token.user.LabIds).then(labId => {
        QCInstrument.find({ LAB_ID: labId }).then(instruments => {
            res.json(instruments);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

QCInstrumentController.getQualityControlInstruments = (req, res) => {
    getLabIds(req.token.user.LabIds).then(labId => {
        let filterObj = { INSTRUMENT_NAME: '' };
        filterObj.INSTRUMENT_NAME = req.query['Filter.INSTRUMENT_NAME'] === undefined ? '' : req.query['Filter.INSTRUMENT_NAME'];

        let query = 'EXEC spGetQCInstruments ' + req.query.StartPageNo + ',' + labId + ",'" + filterObj.INSTRUMENT_NAME + "'";
        let qcInstrumentQuery = Promise.promisify(QCInstrument.query);
        qcInstrumentQuery(query).then(instruments => {
            let obj = {
                Data: instruments,
                TotalRecords: instruments.length === 0 ? 0 : instruments[0].TOTALCOUNT
            }
            res.json(obj);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

QCInstrumentController.saveQCInstrument = (req, res) => {
    let compound = req.body;
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = 'EXEC spSaveQCInstrument ' + compound.INSTRUMENT_ID + ",'"
            + compound.INSTRUMENT_NAME + "',"
            + labId;
        let qcInstrumentQuery = Promise.promisify(QCInstrument.query);

        qcInstrumentQuery(query).then(instruments => {
            res.json('saved successfully');
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

QCInstrumentController.deleteQCInstrument = (req, res) => {
    let INSTRUMENT_ID = req.param('id');
    let query = 'EXEC spDeleteQCInstrumentById ' + INSTRUMENT_ID;

    let qcInstrumentQuery = Promise.promisify(QCInstrument.query);
    qcInstrumentQuery(query).then(instruments => {
        res.json('deleted successfully');
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

module.exports = QCInstrumentController;