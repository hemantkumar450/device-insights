let IMFrequenvyController = {};
let Promise = require("bluebird");

IMFrequenvyController.getFrequencies = (req, res) => {
    let query = 'EXEC spGetIMFrequency ' + req.query.StartPageNo;
    let imFrequencyQuery = Promise.promisify(IMFrequency.query);
    imFrequencyQuery(query).then((frequency) => {
        let obj = {
            Data: frequency,
            TotalRecords: frequency.length === 0 ? 0 : frequency[0].TOTALCOUNT
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMFrequenvyController.getFrequencyDDO = (req, res) => {
    let query = 'SELECT * FROM IM_FREQ';
    let imFrequencyQuery = Promise.promisify(IMFrequency.query);
    imFrequencyQuery(query).then((frequency) => {
        res.json(frequency);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMFrequenvyController.getFrequencyById = (req, res) => {
    let FREQ_ID = req.param('freqId');
    IMFrequency.findOne({ FREQ_ID: FREQ_ID }).then(frequency => {
        res.json(frequency);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}


IMFrequenvyController.saveFrequency = (req, res) => {
    let frequency = req.body;

    let query = "EXEC spSaveIMfrequency "
        + frequency.FREQ_ID + ",'"
        + frequency.FREQ_NAME + "'";

    let imFrequencyQuery = Promise.promisify(IMFrequency.query);
    imFrequencyQuery(query).then((frequency) => {
        res.json(frequency);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

module.exports = IMFrequenvyController;
