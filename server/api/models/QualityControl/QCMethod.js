module.exports = {
    attributes: {
        METHOD_ID: { primaryKey: true },
        METHOD_NAME: { type: 'string' },
        LAB_ID: { type: 'integer' },
        INSTRUMENT_ID: { type: 'integer' }
    },
    tableName: 'QC_METHOD'
};