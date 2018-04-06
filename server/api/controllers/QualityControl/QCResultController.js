let qcResultController = {};
let moment = require('moment');
let Promise = require("bluebird");


qcResultController.compoundDDOByInstrumentId = (req, res) => {
  let labId = req.param('labId');
  let instrumentId = req.param('instrumentId');
  let query = 'EXEC spGetQCCompoundDDOByInstrumentId ' + labId + ',' + instrumentId;
  let qualityControlQuery = Promise.promisify(QualityControl.query);
  qualityControlQuery(query).then(result => {
    res.json(result);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

qcResultController.instrumentDDO = (req, res) => {
  let labId = req.param('labId');
  let query = 'EXEC spGetInstrumentDDO ' + labId;
  let qualityControlQuery = Promise.promisify(QualityControl.query);
  qualityControlQuery(query).then(result => {
    res.json(result);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

qcResultController.getMeanYearDDO = (req, res) => {
  let instrumentId = req.param('instrumentId');
  getLabIds(req.token.user.LabIds).then(labId => {
    let query = 'select distinct [YEAR] from QC_RESULTS where LAB_ID='
      + labId + ' and INSTRUMENT_ID = ' + instrumentId + '  order by [YEAR] desc';
    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
      res.json(result);
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  })

}

qcResultController.getMeanMonthDDO = (req, res) => {
  getLabIds(req.token.user.LabIds).then(labId => {
    let query = 'select distinct [MONTH] from QC_RESULTS where LAB_ID='
      + labId + '  order by [MONTH]';
    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
      res.json(result);
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  });
}

qcResultController.getReviewMonthDDO = (req, res) => {
  let labId = req.param('labId');
  let yearId = req.param('yearId');
  let query = 'select distinct [MONTH] from QC_RESULTS where LAB_ID='
    + labId + 'and YEAR=' + yearId + '  order by [MONTH]';

  let qualityControlQuery = Promise.promisify(QualityControl.query);
  qualityControlQuery(query).then(result => {
    res.json(result);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

qcResultController.getQCCompoundDDO = (req, res) => {
  let INSTRUMENT_ID = req.param('instrumentId');
  getLabIds(req.token.user.LabIds).then(labId => {
    let query = 'EXEC spGetQCCompoundDDO ' + labId + ',' + INSTRUMENT_ID;
    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
      res.json(result);
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  });
}

qcResultController.getMeanSD = (req, res) => {
  let query = req.query;
  let startDate = query.startDate.replace(/"/g, "");
  let endDate = query.endDate.replace(/"/g, "");
  if (startDate !== "null") {
    startDate = moment(startDate).format('MM/DD/YYYY');
    startDate = "'" + startDate + "'";
  } else {
    startDate = null;
  }
  if (endDate !== "null") {
    endDate = moment(endDate).format('MM/DD/YYYY');
    endDate = "'" + endDate + "'";
  } else {
    endDate = null;
  }
  if (query.methodId === "All") {
    query.methodId = null;
  }
  if (query.compoundId === "All") {
    query.compoundId = null;
  }
  let meanSDQuery = "EXEC spGetMeanSD " + startDate + "," +
    endDate + "," +
    query.compoundId + ',' +
    query.instrumentId + ',' +
    query.methodId;
  let qualityControlQuery = Promise.promisify(QualityControl.query);
  qualityControlQuery(meanSDQuery).then(result => {
    res.json(result);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

qcResultController.getResults = (req, res) => {
  let BATCH_ID = req.param('batchId');
  let INSTRUMENT_ID = req.param('instrumentId');
  let DAY = req.param('dayId');
  let MONTH = req.param('monthId');
  let YEAR = req.param('yearId');
  let compoundId = req.param('compoundId');
  let status = req.param('status');

  if (MONTH === 'All') { MONTH = 0; }
  if (YEAR === 'All') { YEAR = 0; }

  if (status === 'Pass') {
    status = 1
  } else if (status === 'Fail') {
    status = 0
  }

  getLabIds(req.token.user.LabIds).then(labId => {
    let query = 'EXEC spGetQCResultForGrid ' + req.query.StartPageNo + ','
      + labId + ','
      + INSTRUMENT_ID + ','
      + YEAR + ','
      + MONTH + ','
      + DAY + ",'"
      + BATCH_ID + "',"
      + compoundId + ','
      + status;

    let qualityControlQuery = Promise.promisify(QualityControl.query);
    qualityControlQuery(query).then(result => {
      let obj = {
        Data: result,
        TotalRecords: result.length === 0 ? 0 : result[0].TOTALCOUNT
      }
      res.json(obj);
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  });
}

qcResultController.saveResultGridRow = (req, res) => {
  let resultgridRow = req.body;
  let query = 'EXEC spSaveQCResultGrid ' + resultgridRow.LAB_ID + ','
    + resultgridRow.INSTRUMENT_ID + ",'"
    + resultgridRow.BATCH_ID + "',"
    + resultgridRow.COMP_ID + ','
    + resultgridRow.REASON_ID;

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

module.exports = qcResultController;
