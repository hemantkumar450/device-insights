let SMLocationController = {};
let Promise = require("bluebird");


SMLocationController.getLocations = (req, res) => {

  let labId = '';
  req.token.user.LabIds.forEach(id => {
    labId += id + ',';
  });
  if (labId.charAt(labId.length - 1) == ',') {
    labId = labId.substr(0, labId.length - 1);
  }

  let filterObj = { LOCATION_NAME: '' };
  filterObj.LOCATION_NAME = req.query['Filter.LOCATION_NAME'] === undefined ? '' : req.query['Filter.LOCATION_NAME'];

  query = 'EXEC spGetSMLocations ' + req.query.StartPageNo + ",'" + filterObj.LOCATION_NAME + "'," + labId;

  let smLocationQuery = Promise.promisify(SMLocation.query);
  smLocationQuery(query).then((locations) => {
    let obj = {
      Data: locations,
      TotalRecords: locations.length === 0 ? 0 : locations[0].TOTALCOUNT
    }
    res.json(obj);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMLocationController.getLocationDDO = (req, res) => {
  let labId = '';
  req.token.user.LabIds.forEach(id => {
    labId += id + ',';
  });
  if (labId.charAt(labId.length - 1) == ',') {
    labId = labId.substr(0, labId.length - 1);
  }

  query = 'select * from SM_LOCATIONS where LAB_ID = ' + labId;

  let smLocationQuery = Promise.promisify(SMLocation.query);
  smLocationQuery(query).then((locations) => {
    res.json(locations);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMLocationController.saveLocation = (req, res) => {
  let location = req.body;
  let labIdArray = req.token.user.LabIds;
  let labIds = '';

  labIdArray.forEach(element => {
    labIds += element + ',';
  });

  if (labIds && labIds.charAt(labIds.length - 1) == ',') {
    labIds = labIds.substr(0, labIds.length - 1);
  };

  let query = "EXEC spSaveSMLocation "
    + location.LOCATION_ID + ",'"
    + location.LOCATION_NAME + "',"
    + labIds;

  let smLocationQuery = Promise.promisify(SMLocation.query);
  smLocationQuery(query).then((location) => {
    res.json(location);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMLocationController.deleteLocation = (req, res) => {
  let LOCATION_ID = req.param('id');
  let query = 'EXEC spDeleteSMLocation ' + LOCATION_ID;

  let smLocationQuery = Promise.promisify(SMLocation.query);
  smLocationQuery(query).then((lab) => {
    res.json(null);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

module.exports = SMLocationController;