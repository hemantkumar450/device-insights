module.exports = {
  attributes: {
    SENSOR_ID: { primaryKey: true },
    SENSOR_TYPE_ID: { type: 'integer' },
    SENSOR_ID: { type: 'integer' },
    SENSOR_CODE: { type: 'string' },
    LOCATION_ID: { type: 'integer' },
    UPPER_LIMIT: { type: 'integer' },
    LOWER_LIMIT: { type: 'integer' },
    MINUTES: { type: 'integer' },
    BATTERY: { type: 'integer' },
    EMAIL_ID: { type: 'string' },
    LAB_ID: { type: 'integer' },
  },
  tableName: 'SM_SENSORS'
};
