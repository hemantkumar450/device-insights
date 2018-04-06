module.exports = {
    attributes: {
        INSTRUMENT_ID: { primaryKey: true },
        INSTRUMENT_NAME: { type: 'string' },
        LAB_ID: { type: 'integer' }
    },
    tableName: 'QC_INSTRUMENT'
};