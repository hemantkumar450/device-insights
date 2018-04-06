module.exports = {
    attributes: {
        LAB_ID: { primaryKey: true },
        REPORT_ID: { primaryKey: true },
        START_DATE: { type: 'date' },
        END_DATE: { type: 'date' },
        REPORT_LINK: { type: 'string' },
    },
    tableName: 'SM_REPORTS'
};
