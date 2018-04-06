
module.exports = {
  attributes: {
    SM_SENSOR_READING_ID: { primaryKey: true },
    SENSOR_ID: { type: 'Int' },
    DATE_TIME: { type: 'letChar' },
    TIME: { type: 'letChar' },
    READING: { type: 'Float' },
    LAB_ID: { type: 'Int' }
  },
  tableName: 'SM_SENSOR_READINGS'
};
