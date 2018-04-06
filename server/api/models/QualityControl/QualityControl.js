module.exports = {
  attributes: {
    LAB_ID: { primaryKey: true },
    INSTRUMENT_ID: { primaryKey: true },
    BATCH_ID: { primaryKey: true },
    COMP_ID: { primaryKey: true },
    METHOD_ID: { primaryKey: true },
    REPORT_DATE: { type: 'date' },
    STATUS: { type: 'string' },
    QC_VALUE: { type: 'float' },
    REASON_ID: { type: 'integer' },
    COMMENT: { type: 'string' }
  },
  tableName: 'QC_RESULTS'
};
