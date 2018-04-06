module.exports = {
    attributes: {
        LAB_ID: { type: 'integer' },
        INSTRUMENT_ID: { type: 'integer' },
        MONTH: { type: 'integer' },
        YEAR: { type: 'integer' },
        REVIEWD_BY: { type: 'string' },
        DATE_TIME: { type: 'datetime' },
        DOCUMENT_URL: { type: 'string' }
    },
    tableName: 'QC_BATCH_MONTHLY_REVIEW'
};