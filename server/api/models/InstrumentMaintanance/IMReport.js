module.exports = {
    attributes: {
        LAB_ID: { primaryKey: true },
        INSTR_ID: { primaryKey: true },
        FREQ_ID: { type: 'integer' },
        MONTH: { type: 'integer' },
        YEAR: { type: 'string' },
        REPORT_ID: { type: 'integer' },
        REPORT_URL: { type: 'integer' },
    },
    tableName: 'IM_REPORTS'
};
