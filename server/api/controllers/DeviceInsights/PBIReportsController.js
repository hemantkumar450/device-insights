let pbiReportsController = {};
let Promise = require("bluebird");

pbiReportsController.getPBIReports = (req, res) => {

    let filterObj = {
        LAB_NAME: '',
        MODULE_NAME: '',
        GROUP_ID: '',
        REPORT_ID: '',
        VIEW_NAME: ''
    };

    filterObj.LAB_NAME = req.query['Filter.LAB_NAME'] === undefined ? '' : req.query['Filter.LAB_NAME'];
    filterObj.MODULE_NAME = req.query['Filter.MODULE_NAME'] === undefined ? '' : req.query['Filter.MODULE_NAME'];
    filterObj.GROUP_ID = req.query['Filter.GROUP_ID'] === undefined ? '' : req.query['Filter.GROUP_ID'];
    filterObj.REPORT_ID = req.query['Filter.REPORT_ID'] === undefined ? '' : req.query['Filter.REPORT_ID'];
    filterObj.VIEW_NAME = req.query['Filter.VIEW_NAME'] === undefined ? '' : req.query['Filter.VIEW_NAME'];

    let query = 'EXEC spGetPBIReport ' + req.query.StartPageNo + ",'"
        + filterObj.LAB_NAME + "','"
        + filterObj.MODULE_NAME + "','"
        + filterObj.GROUP_ID + "','"
        + filterObj.REPORT_ID + "','"
        + filterObj.VIEW_NAME + "'";

    let pbiReportQuery = Promise.promisify(PBIReport.query);

    pbiReportQuery(query).then((pbiReport) => {
        let obj = {
            Data: pbiReport,
            TotalRecords: pbiReport.length === 0 ? 0 : pbiReport[0].TOTALCOUNT
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}


pbiReportsController.getPBIReportById = (req, res) => {
    let LAB_ID = req.param('LAB_ID');
    let MODULE_ID = req.param('MODULE_ID');

    PBIReport.findOne({ LAB_ID: LAB_ID, MODULE_ID: MODULE_ID }).then(pbiReport => {
        res.json(pbiReport);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}


pbiReportsController.savePBIReports = (req, res) => {
    let pbiReport = req.body;

    let query = "EXEC spSavePBIReport " + pbiReport.LAB_ID + ","
        + pbiReport.MODULE_ID + ",'"
        + pbiReport.GROUP_ID + "','"
        + pbiReport.REPORT_ID + "','"
        + pbiReport.VIEW_NAME + "',"
        + pbiReport.IS_EDIT;

    let pbiReportQuery = Promise.promisify(PBIReport.query);

    pbiReportQuery(query).then((pbiReport) => {
        if (pbiReport[0].ISEDIT) {
            res.json(null);
        } else {
            res.status(400).send('Lab and Module combination is already exists.You can edit the existing record or delete it.');
        }
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

pbiReportsController.deletePBIReports = (req, res) => {
    let LAB_ID = req.param('LAB_ID');
    let MODULE_ID = req.param('MODULE_ID');
    let query = 'EXEC spDeletePBIReportById ' + LAB_ID + ',' + MODULE_ID;

    let pbiReportQuery = Promise.promisify(PBIReport.query);

    pbiReportQuery(query).then((pbiReport) => {
        res.json(null);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

module.exports = pbiReportsController;
