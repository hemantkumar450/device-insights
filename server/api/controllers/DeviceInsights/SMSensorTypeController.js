let SMSensorTypeController = {};
let Promise = require("bluebird");


SMSensorTypeController.getSensorTypes = (req, res) => {
  let filterObj = { SENSOR_TYPE_NAME: '' };
  filterObj.SENSOR_TYPE_NAME = req.query['Filter.SENSOR_TYPE_NAME'] === undefined ? '' : req.query['Filter.SENSOR_TYPE_NAME'];

  query = 'EXEC spGetSMSensorType ' + req.query.StartPageNo + ",'" + filterObj.SENSOR_TYPE_NAME + "'";


  let sensorTypeQuery = Promise.promisify(SensorType.query);

  sensorTypeQuery(query).then((sensorTypes) => {
    let obj = {
      Data: sensorTypes,
      TotalRecords: sensorTypes.length === 0 ? 0 : sensorTypes[0].TOTALCOUNT
    }
    res.json(obj);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMSensorTypeController.getSensorTypeDDO = (req, res) => {
  query = 'select * from SM_SENSOR_TYPES';
  let sensorTypeQuery = Promise.promisify(SensorType.query);

  sensorTypeQuery(query).then((sensorTypes) => {
    res.json(sensorTypes);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMSensorTypeController.saveSensorType = (req, res) => {
  let sensorType = req.body;

  let query = "EXEC spSaveSMSensorType "
    + sensorType.SENSOR_TYPE_ID + ",'"
    + sensorType.SENSOR_TYPE_NAME + "'";

  let sensorTypeQuery = Promise.promisify(SensorType.query);

  sensorTypeQuery(query).then((sensorType) => {
    res.json(sensorType);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });

}

SMSensorTypeController.deleteSensorType = (req, res) => {
  let sensorTypeId = req.param('id');
  let query = 'EXEC spDeleteSMSensorType ' + sensorTypeId;
  let sensorTypeQuery = Promise.promisify(SensorType.query);

  sensorTypeQuery(query).then((sensorType) => {
    res.json(null);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

module.exports = SMSensorTypeController;