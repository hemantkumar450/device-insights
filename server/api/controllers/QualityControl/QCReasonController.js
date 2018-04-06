let QCReasonController = {};
let Promise = require("bluebird");

QCReasonController.getQualityControlReasons = (req, res) => {
    getLabIds(req.token.user.LabIds).then(labId => {
        let filterObj = { REASON_NAME: '' };
        filterObj.REASON_NAME = req.query['Filter.REASON_NAME'] === undefined ? '' : req.query['Filter.REASON_NAME'];

        let query = 'EXEC spGetQCReasons ' + req.query.StartPageNo + ',' + labId + ",'" + filterObj.REASON_NAME + "'";

        let qcReasonQuery = Promise.promisify(QCReason.query);
        qcReasonQuery(query).then(reasons => {
            let obj = {
                Data: reasons,
                TotalRecords: reasons.length === 0 ? 0 : reasons[0].TOTALCOUNT
            }
            res.json(obj);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

QCReasonController.saveQCReason = (req, res) => {
    let compound = req.body;
    getLabIds(req.token.user.LabIds).then(labId => {
        let query = 'EXEC spSaveQCReason ' + compound.REASON_ID + ",'"
            + compound.REASON_NAME + "',"  + compound.REASON_CODE + ","
            + labId;

        let qcReasonQuery = Promise.promisify(QCReason.query);
        qcReasonQuery(query).then(reasons => {
            res.json('saved successfully');
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

QCReasonController.deleteQCReason = (req, res) => {
    let REASON_ID = req.param('id');
    let query = 'EXEC spDeleteQCReasonById ' + REASON_ID;

    let qcReasonQuery = Promise.promisify(QCReason.query);
    qcReasonQuery(query).then(reasons => {
        res.json('deleted successfully');
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

QCReasonController.getQCReasonDDO = (req, res) => {
    getLabIds(req.token.user.LabIds).then(labId => {
      QCReason.find({ LAB_ID: labId }).then(result => {
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

module.exports = QCReasonController;