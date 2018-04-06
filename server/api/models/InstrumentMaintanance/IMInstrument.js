module.exports = {
    attributes: {
        LAB_ID: { primaryKey: true },
        INSTR_ID: { primaryKey: true },
        FREQ_ID: { type: 'integer' },
        INSTR_NAME: { type: 'string' }
    },
    tableName: 'IM_INSTRUMENTS'
};
