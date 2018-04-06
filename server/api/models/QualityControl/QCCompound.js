module.exports = {
    attributes: {
        COMP_ID: { primaryKey: true },
        COMP_NAME: { type: 'string' },
        INSTRUMENT_ID: { type: 'integer' },
        LAB_ID: { type: 'integer' }
    },
    tableName: 'QC_COMPOUND'
};