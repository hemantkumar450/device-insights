module.exports = {
    attributes: {
        LAB_ID: { primaryKey: true },
        INSTR_ID: { primaryKey: true },
        FREQ_ID: { type: 'integer' },
        ITEM_ID: { type: 'integer' },
        DATE: { type: 'date' },
        STATUS: { type: 'string' },
        REVIEWED_BY: { type: 'integer' },
        APPROVED_BY: { type: 'integer' },
    },
    tableName: 'IM_CHECKLIST'
};
