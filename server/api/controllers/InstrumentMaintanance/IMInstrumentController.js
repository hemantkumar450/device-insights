let IMInstrumentController = {};
let Promise = require("bluebird");

IMInstrumentController.getMasterInstruments = (req, res) => {
    let LAB_ID = req.param('labId');
    let query = 'EXEC spGetIMInstrument ' + req.query.StartPageNo + ','
        + LAB_ID;

    let imInstrumentQuery = Promise.promisify(IMInstrument.query);

    imInstrumentQuery(query).then((instrument) => {
        let obj = {
            Data: instrument,
            TotalRecords: instrument.length === 0 ? 0 : instrument[0].TOTALCOUNT
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMInstrumentController.getInstrumentDDO = (req, res) => {
    let LAB_ID = req.param('labId');
    IMInstrument.find({ LAB_ID: LAB_ID }).then((instrument) => {
        res.json(instrument);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMInstrumentController.saveMasterInstrument = (req, res) => {
    let instrument = req.body;

    let query = "EXEC spSaveIMInstrument "
        + instrument.LAB_ID + ','
        + instrument.INSTR_ID + ",'"
        + instrument.INSTR_NAME + "'";

    let imInstrumentQuery = Promise.promisify(IMInstrument.query);

    imInstrumentQuery(query).then((instrument) => {
        res.json(instrument);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMInstrumentController.deleteMasterInstrument = (req, res) => {

    let labId = '';
    req.token.user.LabIds.forEach(id => {
        labId += id + ',';
    });
    if (labId.charAt(labId.length - 1) == ',') {
        labId = labId.substr(0, labId.length - 1);
    }

    let INSTR_ID = req.param('id');
    let query = 'EXEC spDeleteIMInstrumentById ' + INSTR_ID + ',' + labId;

    let imInstrumentQuery = Promise.promisify(IMInstrument.query);

    imInstrumentQuery(query).then((instrument) => {
        res.json('deleted successfully');
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

/* Instrument Frequency */

IMInstrumentController.getInstrumentFrequencies = (req, res) => {
    let LAB_ID = req.param('labId');
    let query = 'EXEC spGetIMInstrumentFrequencies ' + req.query.StartPageNo + ','
        + LAB_ID;

    let imInstrumentQuery = Promise.promisify(IMInstrument.query);

    imInstrumentQuery(query).then((instrument) => {
        let obj = {
            Data: instrument,
            TotalRecords: instrument.length === 0 ? 0 : instrument[0].TOTALCOUNT
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMInstrumentController.saveInstrumentFrequency = (req, res) => {
    let instrument = req.body;

    let query = "EXEC spSaveIMInstrumentFrequency "
        + instrument.INSTR_FREQ_ID + ','
        + instrument.LAB_ID + ','
        + instrument.INSTR_ID + ','
        + instrument.FREQ_ID;

    let imInstrumentQuery = Promise.promisify(IMInstrument.query);

    imInstrumentQuery(query).then((instrument) => {
        if (instrument[0].INSTR_ID === 0) {
            return res.status(500).send('Already exists this record');
        }
        res.json(instrument);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMInstrumentController.deleteInstrumentFrequency = (req, res) => {
    let labId = '';
    req.token.user.LabIds.forEach(id => {
        labId += id + ',';
    });
    if (labId.charAt(labId.length - 1) == ',') {
        labId = labId.substr(0, labId.length - 1);
    }

    let INSTR_FREQ_ID = req.param('id');
    let query = 'EXEC spDeleteIMInstrumentFrequencyById ' + INSTR_FREQ_ID + ',' + labId;

    let imInstrumentQuery = Promise.promisify(IMInstrument.query);

    imInstrumentQuery(query).then((instrument) => {
        res.json(null);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

module.exports = IMInstrumentController;