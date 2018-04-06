module.exports = {
    attributes: {
        LAB_ID: { primaryKey: true },
        INSTR_ID: { primaryKey: true },
        FREQ_ID: { type: 'integer' },
        ITEM_ID: { type: 'integer' },
        MAP_ID: { type: 'integer' },
        MAP_NAME: { type: 'string' }
    },
    tableName: 'IM_ITEMS_MAP'
};
