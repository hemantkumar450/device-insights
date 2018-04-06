let qcCompoundController = {};
let Promise = require("bluebird");

qcCompoundController.getQualityControlCompounds = (req, res) => {

    let INSTRUMENT_ID = req.param('instrumentId');
    let labId = '';
    req.token.user.LabIds.forEach(id => {
        labId += id + ',';
    });
    if (labId.charAt(labId.length - 1) == ',') {
        labId = labId.substr(0, labId.length - 1);
    }


    let filterObj = { COMP_NAME: '' };
    filterObj.COMP_NAME = req.query['Filter.COMP_NAME'] === undefined ? '' : req.query['Filter.COMP_NAME'];

    let query = 'EXEC spGetQCCompounds ' + req.query.StartPageNo + ',' + labId + ",'" + filterObj.COMP_NAME + "'," + INSTRUMENT_ID;
    let qcCompoundQuery = Promise.promisify(QCCompound.query);

    qcCompoundQuery(query).then(compounds => {
        let obj = {
            Data: compounds,
            TotalRecords: compounds.length === 0 ? 0 : compounds[0].TOTALCOUNT
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcCompoundController.saveQCCompound = (req, res) => {
    let compound = req.body;
    let labId = '';
    req.token.user.LabIds.forEach(id => {
        labId += id + ',';
    });
    if (labId.charAt(labId.length - 1) == ',') {
        labId = labId.substr(0, labId.length - 1);
    }

    let query = 'EXEC spSaveQCCompound ' + compound.COMP_ID + ",'"
        + compound.COMP_NAME + "',"
        + labId + ','
        + compound.INSTRUMENT_ID;

    let qcCompoundQuery = Promise.promisify(QCCompound.query);

    qcCompoundQuery(query).then(compounds => {
        res.json('saved successfully');
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

qcCompoundController.deleteQCCompound = (req, res) => {
    let COMP_ID = req.param('id');
    let query = 'EXEC spDeleteQCCompoundById ' + COMP_ID;
    let qcCompoundQuery = Promise.promisify(QCCompound.query);

    qcCompoundQuery(query).then(compounds => {
        res.json('deleted successfully');
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

module.exports = qcCompoundController;
