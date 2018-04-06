module.exports = {
    attributes: {
        REASON_ID: { primaryKey: true },
        REASON_NAME: { type: 'string' },
        LAB_ID: { primaryKey: true },
        REASON_CODE: { type: 'int' },
    },
    tableName: 'QC_REASONS'
};